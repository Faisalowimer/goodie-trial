import { logger } from '@/utils/logger';
import { NextResponse } from 'next/server';
import { processAITraffic } from '@/utils/ai-analytics';
import { AnalyticsResponse } from '../google/analytics-data/types';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

const propertyId = process.env.GOOGLE_PROPERTY_ID;
const analyticsDataClient = new BetaAnalyticsDataClient();

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const startDate = searchParams.get('startDate') || '7daysAgo';
        const endDate = searchParams.get('endDate') || 'today';

        if (!propertyId) {
            throw new Error('GOOGLE_PROPERTY_ID environment variable is not set');
        }

        logger.info('Fetching AI Analytics data', {
            propertyId,
            dateRange: `${startDate} to ${endDate}`
        });

        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate,
                    endDate,
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

        // Transform GA4 response into our analytics format
        const analyticsData: AnalyticsResponse = {};

        response.rows?.forEach((row) => {
            const sessionId = `${row.dimensionValues?.[0]?.value}-${row.dimensionValues?.[1]?.value}-${row.dimensionValues?.[2]?.value}-${row.dimensionValues?.[3]?.value}-${row.dimensionValues?.[6]?.value}-${row.dimensionValues?.[7]?.value}`;

            if (!analyticsData[sessionId]) {
                analyticsData[sessionId] = {
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

            const eventName = row.dimensionValues?.[4]?.value;
            if (eventName && !analyticsData[sessionId].events.includes(eventName)) {
                analyticsData[sessionId].events.push(eventName);
            }
        });

        // Process the data to get AI-specific insights
        const aiAnalytics = processAITraffic(analyticsData);

        logger.info('AI Analytics processed successfully', {
            totalSessions: aiAnalytics.totalSessions,
            aiSessions: aiAnalytics.aiSessions,
            nonAiSessions: aiAnalytics.nonAiSessions
        });

        return NextResponse.json({
            success: true,
            data: aiAnalytics
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Error fetching AI analytics:', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined
        });

        return NextResponse.json({
            success: false,
            error: errorMessage
        }, { status: 500 });
    }
} 