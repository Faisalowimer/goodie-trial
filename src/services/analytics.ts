import { AggregatedMetrics } from "@/types/analytics";
import { SearchConsoleData } from "@/types/search-console";
import { AnalyticsResponse } from "@/app/api/google/analytics-data/types";

export async function aggregateData(): Promise<AggregatedMetrics> {
    try {
        // Fetch data from our endpoints
        const [analyticsResponse, searchConsoleResponse] = await Promise.all([
            fetch('/api/google/analytics-data').then(res => res.json()),
            fetch('/api/transform').then(res => res.json())
        ]);

        const analytics: AnalyticsResponse = analyticsResponse.data;
        const searchConsole: SearchConsoleData = searchConsoleResponse.data;

        // Process analytics data
        const sessions = Object.values(analytics);
        const totalTraffic = sessions.reduce((sum, session) => sum + session.metrics.totalUsers, 0);
        const totalConversions = sessions.reduce((sum, session) => sum + session.metrics.checkouts, 0);
        const avgEngagement = sessions.reduce((sum, session) => sum + session.metrics.engagementRate, 0) / sessions.length;

        // Process search console data
        const keywords = searchConsole.performance.queries;
        const brandKeywords = ['globalvets', 'global vets', 'vet']; // Example brand keywords

        // Aggregate metrics
        return {
            overview: {
                totalTraffic: {
                    value: totalTraffic,
                    trend: '+20%' // Calculate from historical data
                },
                conversionRate: {
                    value: (totalConversions / totalTraffic) * 100,
                    trend: '+0.5%'
                },
                engagementRate: {
                    value: avgEngagement,
                    trend: '+2.3%'
                },
                avgSessionDuration: {
                    value: sessions.reduce((sum, session) => sum + session.metrics.avgSessionDuration, 0) / sessions.length,
                    trend: '-15s'
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
                }, {} as Record<string, any>)
            ).map(([source, data]) => ({
                source,
                ...data
            })),
            keywords: {
                branded: keywords
                    .filter(k => brandKeywords.some(bk => k.query.toLowerCase().includes(bk)))
                    .sort((a, b) => b.clicks - a.clicks)
                    .slice(0, 10),
                nonBranded: keywords
                    .filter(k => !brandKeywords.some(bk => k.query.toLowerCase().includes(bk)))
                    .sort((a, b) => b.clicks - a.clicks)
                    .slice(0, 10)
            },
            aiPlatforms: [
                { platform: 'ChatGPT', traffic: 450, engagement: 65, conversions: 23 },
                { platform: 'Google SGE', traffic: 320, engagement: 58, conversions: 18 },
                { platform: 'Perplexity', traffic: 180, engagement: 72, conversions: 12 },
                { platform: 'Claude', traffic: 150, engagement: 68, conversions: 8 }
            ],
            geographicData: Object.entries(
                sessions.reduce((acc, session) => {
                    const country = session.country;
                    if (!acc[country]) {
                        acc[country] = { traffic: 0, engagement: 0 };
                    }
                    acc[country].traffic += session.metrics.totalUsers;
                    acc[country].engagement += session.metrics.engagementRate;
                    return acc;
                }, {} as Record<string, any>)
            ).map(([country, data]) => ({
                country,
                ...data
            }))
        };
    } catch (error) {
        console.error('Failed to aggregate data:', error);
        throw error;
    }
} 