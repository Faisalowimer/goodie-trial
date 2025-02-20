import { logger } from '@/utils/logger';
import { saveToJsonFile } from './utils';
import { AnalyticsSession } from './types';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const propertyId = process.env.GOOGLE_PROPERTY_ID;

const analyticsDataClient = new BetaAnalyticsDataClient();

async function runReport() {
    try {
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '2024-01-01',
                    endDate: '2025-01-31',
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
        });

        // Create a map to store aggregated session data
        const sessionMap: Record<string, AnalyticsSession> = {};

        response.rows?.forEach((row) => {
            // Create a unique session identifier
            const sessionId = `${row.dimensionValues?.[0]?.value}-${row.dimensionValues?.[1]?.value}-${row.dimensionValues?.[2]?.value}-${row.dimensionValues?.[3]?.value}`;

            // Get or create session data
            if (!sessionMap[sessionId]) {
                sessionMap[sessionId] = {
                    date: row.dimensionValues?.[0]?.value || 'N/A',
                    city: row.dimensionValues?.[1]?.value || 'N/A',
                    country: row.dimensionValues?.[2]?.value || 'N/A',
                    browser: row.dimensionValues?.[3]?.value || 'N/A',
                    events: [],
                    searchTerm: row.dimensionValues?.[5]?.value || 'N/A',
                    session: row.dimensionValues?.[6]?.value || 'N/A',
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

            // Update metrics with latest values (they should be the same for all events in a session)
            sessionMap[sessionId].metrics = {
                totalUsers: parseInt(row.metricValues?.[0]?.value || '0', 10),
                newUsers: parseInt(row.metricValues?.[1]?.value || '0', 10),
                sessions: parseInt(row.metricValues?.[2]?.value || '0', 10),
                checkouts: parseInt(row.metricValues?.[3]?.value || '0', 10),
                bounceRate: parseFloat(row.metricValues?.[4]?.value || '0'),
                addsToCart: parseInt(row.metricValues?.[5]?.value || '0', 10),
                engagementRate: parseFloat(row.metricValues?.[6]?.value || '0'),
                engagedSessions: parseInt(row.metricValues?.[7]?.value || '0', 10),
                avgSessionDuration: parseInt(row.metricValues?.[8]?.value || '0', 10),
            };
        });

        // Log aggregated data
        logger.info('Aggregated Analytics Data:');
        Object.values(sessionMap).forEach((session) => {
            logger.info(JSON.stringify(session, null, 2));
        });

        // Save data to JSON file
        await saveToJsonFile(sessionMap);

    } catch (error) {
        logger.error('Error running report:', error instanceof Error ? error.message : String(error));
    }
}

runReport();
