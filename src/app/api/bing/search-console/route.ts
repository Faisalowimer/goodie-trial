import { logger } from '@/utils/logger';
import { NextResponse } from 'next/server';
import { fetchBingData, saveToJsonFile } from './utils';

export async function GET() {
    try {
        logger.info('Fetching Bing Webmaster data for the last 30 days');

        // Validate environment variables
        if (!process.env.SITE_URL) {
            logger.error('SITE_URL environment variable is not set');
            return NextResponse.json(
                {
                    error: 'SITE_URL environment variable is not set',
                },
                { status: 400 }
            );
        }

        // Calculate date range for last 30 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        // Format dates as YYYY-MM-DD
        const searchParams = {
            siteUrl: process.env.SITE_URL,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };

        logger.debug('Fetching data with parameters', {
            ...searchParams,
            siteUrl: process.env.SITE_URL ? '[PRESENT]' : '[MISSING]'
        });

        const searchData = await fetchBingData(searchParams);

        // Save data for historical tracking
        await saveToJsonFile(searchData);

        if (searchData.totalCount === 0) {
            logger.info('No data found - site may be newly added to Bing Webmaster Tools');
            return NextResponse.json({
                data: [],
                totalCount: 0,
                message: 'No data available yet. Please wait 48 hours for Bing to prepare your site data.'
            });
        }

        return NextResponse.json(searchData);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Error in Bing Webmaster API route', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined
        });

        return NextResponse.json(
            {
                error: 'Failed to fetch Bing Webmaster data',
                details: errorMessage,
            },
            { status: 500 }
        );
    }
}
