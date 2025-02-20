import { logger } from '@/utils/logger';
import { NextResponse } from 'next/server';
import { initializeSearchConsoleClient, fetchSearchAnalytics, saveToJsonFile } from './utils';

export async function GET() {
    try {
        // Initialize the Search Console client
        const searchConsole = await initializeSearchConsoleClient();

        // Fetch search analytics data
        const searchData = await fetchSearchAnalytics(searchConsole, {
            siteUrl: process.env.SITE_URL || '',
            startDate: '2024-01-01',
            endDate: '2024-01-31',
            dimensions: ['date', 'query', 'page'],
            rowLimit: 1000,
        });

        // Save data to JSON file
        await saveToJsonFile(searchData);

        // Return the data
        return NextResponse.json(searchData);
    } catch (error) {
        logger.error('Error in Search Console API route:', error instanceof Error ? error.message : String(error));
        return NextResponse.json(
            { error: 'Failed to fetch Search Console data' },
            { status: 500 }
        );
    }
}


