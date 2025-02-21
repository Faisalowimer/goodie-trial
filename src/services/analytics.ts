import { logger } from "@/utils/logger";
import { AggregatedMetrics } from "@/types/analytics";
import { SearchConsoleData } from "@/types/search-console";
import { AnalyticsResponse } from "@/app/api/google/analytics-data/types";
import fs from 'fs';
import path from 'path';

export async function aggregateData(): Promise<AggregatedMetrics> {
    try {
        logger.debug('Reading analytics and search console data from files');

        // Read analytics data from the latest file
        const analyticsDir = path.join(process.cwd(), 'src', 'data', 'google', 'analytics-data');
        const analyticsFiles = fs.readdirSync(analyticsDir)
            .filter(file => file.endsWith('.json'))
            .sort((a, b) => b.localeCompare(a)); // Sort descending to get latest file

        if (analyticsFiles.length === 0) {
            throw new Error('No analytics data files found');
        }

        const latestAnalyticsFile = analyticsFiles[0];
        const analyticsPath = path.join(analyticsDir, latestAnalyticsFile);
        logger.debug('Reading analytics data', { path: analyticsPath });

        let analyticsResponse;
        try {
            const analyticsContent = fs.readFileSync(analyticsPath, 'utf-8');
            analyticsResponse = JSON.parse(analyticsContent);
            logger.debug('Successfully read analytics data', {
                file: latestAnalyticsFile,
                metadata: analyticsResponse.metadata
            });
        } catch (error) {
            logger.error('Failed to read analytics data file', {
                error: error instanceof Error ? error.message : String(error),
                path: analyticsPath
            });
            throw new Error('Failed to read analytics data');
        }

        // Read the transformed search console data from file
        const transformedDataPath = path.join(process.cwd(), 'src', 'data', 'transformed', 'search-console', '2025-02-21T15-03-22-906Z-transformed-data.json');
        logger.debug('Reading transformed search console data', { path: transformedDataPath });

        let searchConsoleResponse;
        try {
            const fileContent = fs.readFileSync(transformedDataPath, 'utf-8');
            searchConsoleResponse = JSON.parse(fileContent);
            logger.debug('Successfully read transformed data', {
                metadata: searchConsoleResponse.metadata
            });
        } catch (error) {
            logger.error('Failed to read transformed data file', {
                error: error instanceof Error ? error.message : String(error),
                path: transformedDataPath
            });
            throw new Error('Failed to read transformed search console data');
        }

        // Validate responses
        if (!analyticsResponse.data) {
            logger.error('Invalid analytics data', { response: analyticsResponse });
            throw new Error('Invalid analytics data structure');
        }

        if (!searchConsoleResponse.data) {
            logger.error('Invalid search console data', { response: searchConsoleResponse });
            throw new Error('Invalid search console data structure');
        }

        const analytics: AnalyticsResponse = analyticsResponse.data;
        const searchConsole: SearchConsoleData = searchConsoleResponse.data;

        logger.debug('Processing analytics data', {
            sessionCount: Object.keys(analytics).length,
            sampleSession: Object.values(analytics)[0]
        });

        // Process analytics data
        const sessions = Object.values(analytics);
        const totalTraffic = sessions.reduce((sum, session) => sum + session.metrics.totalUsers, 0);
        const totalConversions = sessions.reduce((sum, session) => sum + session.metrics.checkouts, 0);
        const avgEngagement = sessions.reduce((sum, session) => sum + session.metrics.engagementRate, 0) / sessions.length;

        // Calculate trends by comparing with previous period
        const midPoint = Math.floor(sessions.length / 2);
        const currentPeriod = sessions.slice(midPoint);
        const previousPeriod = sessions.slice(0, midPoint);

        const calculateTrend = (current: number, previous: number): number => {
            if (previous === 0) return 0;
            return ((current - previous) / previous) * 100;
        };

        // Calculate metrics for both periods
        const currentTraffic = currentPeriod.reduce((sum, session) => sum + session.metrics.totalUsers, 0);
        const previousTraffic = previousPeriod.reduce((sum, session) => sum + session.metrics.totalUsers, 0);

        const currentConversions = currentPeriod.reduce((sum, session) => sum + session.metrics.checkouts, 0);
        const previousConversions = previousPeriod.reduce((sum, session) => sum + session.metrics.checkouts, 0);

        const currentEngagement = currentPeriod.reduce((sum, session) => sum + session.metrics.engagementRate, 0) / currentPeriod.length;
        const previousEngagement = previousPeriod.reduce((sum, session) => sum + session.metrics.engagementRate, 0) / previousPeriod.length;

        const currentDuration = currentPeriod.reduce((sum, session) => sum + session.metrics.avgSessionDuration, 0) / currentPeriod.length;
        const previousDuration = previousPeriod.reduce((sum, session) => sum + session.metrics.avgSessionDuration, 0) / previousPeriod.length;

        // Process search console data - specifically queries for keywords
        logger.debug('Processing search console data', {
            queryCount: searchConsole.performance.queries.length,
            sampleQuery: searchConsole.performance.queries[0]
        });

        const queries = searchConsole.performance.queries;
        const brandKeywords = ['globalvets', 'global vets', 'vet']; // Example brand keywords

        // Process search performance data
        const searchPerformanceData = searchConsole.performance.dates.map(date => ({
            date: date.date,
            clicks: date.clicks,
            impressions: date.impressions,
            position: date.position
        }));

        // Process geographic data from search console
        const geoDistribution = searchConsole.performance.countries.map(country => ({
            country: country.country,
            clicks: country.clicks,
            impressions: country.impressions,
            ctr: country.ctr,
            position: country.position // Position indicates average ranking position (lower is better)
        }));

        // Add a comment explaining our data sources
        logger.info('Data sources used:', {
            analytics: {
                source: 'Local JSON file (demo data)',
                file: latestAnalyticsFile
            },
            searchConsole: {
                source: 'Transformed CSV data',
                file: '2025-02-21T15-03-22-906Z-transformed-data.json'
            }
        });

        // Aggregate metrics
        return {
            overview: {
                totalTraffic: {
                    value: totalTraffic,
                    trend: calculateTrend(currentTraffic, previousTraffic)
                },
                conversionRate: {
                    value: (totalConversions / totalTraffic) * 100,
                    trend: calculateTrend(
                        currentConversions / currentPeriod.length,
                        previousConversions / previousPeriod.length
                    )
                },
                engagementRate: {
                    value: avgEngagement,
                    trend: calculateTrend(currentEngagement, previousEngagement)
                },
                avgSessionDuration: {
                    value: sessions.reduce((sum, session) => sum + session.metrics.avgSessionDuration, 0) / sessions.length,
                    trend: calculateTrend(currentDuration, previousDuration)
                }
            },
            trafficSources: Object.entries(
                sessions.reduce((acc, session) => {
                    const source = session.sessionSource;
                    if (!acc[source]) {
                        acc[source] = { sessions: 0, conversions: 0, engagement: 0 };
                    }
                    acc[source].sessions += session.metrics.sessions;
                    acc[source].conversions += session.metrics.checkouts;
                    acc[source].engagement += session.metrics.engagementRate;
                    return acc;
                }, {} as Record<string, { sessions: number; conversions: number; engagement: number }>)
            ).map(([source, data]) => ({
                source,
                ...data
            })),
            keywords: {
                branded: queries
                    .filter(q => brandKeywords.some(bk => q.query?.toLowerCase().includes(bk)))
                    .sort((a, b) => b.clicks - a.clicks)
                    .slice(0, 10)
                    .map(q => ({
                        keyword: q.query,
                        clicks: q.clicks,
                        impressions: q.impressions,
                        ctr: q.ctr,
                        position: q.position
                    })),
                nonBranded: queries
                    .filter(q => !brandKeywords.some(bk => q.query?.toLowerCase().includes(bk)))
                    .sort((a, b) => b.clicks - a.clicks)
                    .slice(0, 10)
                    .map(q => ({
                        keyword: q.query,
                        clicks: q.clicks,
                        impressions: q.impressions,
                        ctr: q.ctr,
                        position: q.position
                    }))
            },
            searchPerformance: searchPerformanceData,
            geoDistribution,

            // MOCK DATA: AI Platform metrics
            // TODO: Replace with actual data once we have AI platform tracking implemented
            // This is temporary mock data because we don't have AI platform tracking implemented yet due to lack of data
            aiPlatforms: [
                { platform: 'ChatGPT', traffic: 450, engagement: 65, conversions: 23 },
                { platform: 'Google SGE', traffic: 320, engagement: 58, conversions: 18 },
                { platform: 'Perplexity', traffic: 180, engagement: 72, conversions: 12 },
                { platform: 'Claude', traffic: 150, engagement: 68, conversions: 8 }
            ],
        };
    } catch (error) {
        logger.error('Failed to aggregate data:', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            context: {
                nodeEnv: process.env.NODE_ENV
            }
        });
        throw error;
    }
} 