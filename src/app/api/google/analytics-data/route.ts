import { logger } from '@/utils/logger';
import { saveToJsonFile } from './utils';
import { AnalyticsResponse } from './types';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const propertyId = process.env.GOOGLE_PROPERTY_ID;
// using last 7 days due to quota limits for now
const startDate = '2025-02-20';
const endDate = '2025-02-26';

const analyticsDataClient = new BetaAnalyticsDataClient();

async function runReport() {
    try {
        if (!propertyId) {
            throw new Error('GOOGLE_PROPERTY_ID environment variable is not set');
        }

        logger.info('Fetching Google Analytics data', {
            propertyId: propertyId,
            dateRange: `${startDate} to ${endDate}`
        });

        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: startDate,
                    endDate: endDate,
                },
            ],
            dimensions: [
                { name: 'date' },
                { name: 'city' },
                { name: 'country' },
                { name: 'browser' },
                { name: 'eventName' },
                { name: 'searchTerm' },
                { name: 'sessionSource' },
                { name: 'sessionMedium' },
            ],
            metrics: [
                { name: 'totalUsers' },
                { name: 'newUsers' },
                { name: 'sessions' },
                { name: 'checkouts' },
                { name: 'bounceRate' },
                { name: 'addToCarts' },
                { name: 'engagementRate' },
                { name: 'engagedSessions' },
                { name: 'averageSessionDuration' },
            ],
            keepEmptyRows: true,
            returnPropertyQuota: true
        });

        // Add debug logging for raw response
        const uniqueSources = new Set(response.rows?.map(row => row.dimensionValues?.[6]?.value));
        logger.info('Raw Analytics Response:', {
            rowCount: response.rows?.length || 0,
            dimensionHeaders: response.dimensionHeaders?.map(h => h.name),
            metricHeaders: response.metricHeaders?.map(h => h.name),
            sampleSize: response.rowCount,
            uniqueSources: {
                count: uniqueSources.size,
                values: Array.from(uniqueSources).sort()
            },
            uniqueMediums: new Set(response.rows?.map(row => row.dimensionValues?.[7]?.value)).size
        });

        // Create a map to store aggregated session data
        const sessionMap: AnalyticsResponse = {};

        response.rows?.forEach((row) => {
            // Create a unique session identifier that includes source and medium
            const sessionId = `${row.dimensionValues?.[0]?.value}-${row.dimensionValues?.[1]?.value}-${row.dimensionValues?.[2]?.value}-${row.dimensionValues?.[3]?.value}-${row.dimensionValues?.[6]?.value}-${row.dimensionValues?.[7]?.value}`;

            // Get or create session data
            if (!sessionMap[sessionId]) {
                sessionMap[sessionId] = {
                    date: row.dimensionValues?.[0]?.value || 'N/A',
                    city: row.dimensionValues?.[1]?.value || 'N/A',
                    country: row.dimensionValues?.[2]?.value || 'N/A',
                    browser: row.dimensionValues?.[3]?.value || 'N/A',
                    events: [],
                    searchTerm: row.dimensionValues?.[5]?.value || 'N/A',
                    session: `${row.dimensionValues?.[6]?.value || 'N/A'}-${row.dimensionValues?.[7]?.value || 'N/A'}`,
                    sessionSource: row.dimensionValues?.[6]?.value || 'N/A',
                    sessionMedium: row.dimensionValues?.[7]?.value || 'N/A',
                    metrics: {
                        totalUsers: parseInt(row.metricValues?.[0]?.value || '0', 10),
                        newUsers: parseInt(row.metricValues?.[1]?.value || '0', 10),
                        sessions: parseInt(row.metricValues?.[2]?.value || '0', 10),
                        checkouts: parseInt(row.metricValues?.[3]?.value || '0', 10),
                        bounceRate: parseFloat(row.metricValues?.[4]?.value || '0'),
                        addsToCart: parseInt(row.metricValues?.[5]?.value || '0', 10),
                        engagementRate: parseFloat(row.metricValues?.[6]?.value || '0'),
                        engagedSessions: parseInt(row.metricValues?.[7]?.value || '0', 10),
                        avgSessionDuration: parseInt(row.metricValues?.[8]?.value || '0', 10),
                    },
                };
            }

            // Add event to events array if not already present
            const eventName = row.dimensionValues?.[4]?.value;
            if (eventName && !sessionMap[sessionId].events.includes(eventName)) {
                sessionMap[sessionId].events.push(eventName);
            }

            // Update metrics by adding values instead of overwriting
            const currentMetrics = sessionMap[sessionId].metrics;
            sessionMap[sessionId].metrics = {
                totalUsers: currentMetrics.totalUsers + parseInt(row.metricValues?.[0]?.value || '0', 10),
                newUsers: currentMetrics.newUsers + parseInt(row.metricValues?.[1]?.value || '0', 10),
                sessions: currentMetrics.sessions + parseInt(row.metricValues?.[2]?.value || '0', 10),
                checkouts: currentMetrics.checkouts + parseInt(row.metricValues?.[3]?.value || '0', 10),
                bounceRate: parseFloat(row.metricValues?.[4]?.value || '0'),
                addsToCart: currentMetrics.addsToCart + parseInt(row.metricValues?.[5]?.value || '0', 10),
                engagementRate: parseFloat(row.metricValues?.[6]?.value || '0'),
                engagedSessions: currentMetrics.engagedSessions + parseInt(row.metricValues?.[7]?.value || '0', 10),
                avgSessionDuration: parseInt(row.metricValues?.[8]?.value || '0', 10),
            };
        });

        // Log aggregated data
        logger.info('Aggregated Analytics Data:', {
            sessionCount: Object.keys(sessionMap).length,
            sampleSession: Object.values(sessionMap)[0] || null
        });

        // Save data to JSON file
        await saveToJsonFile(sessionMap);

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Error running analytics report:', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
            propertyId: propertyId || '[MISSING]'
        });
        throw error;
    }
}

runReport();
