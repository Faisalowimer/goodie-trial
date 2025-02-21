import { logger } from '@/utils/logger';
import { NextResponse } from 'next/server';
import { saveToJsonFile } from '@/utils/dataSaving';
import { loadSearchConsoleData } from '@/utils/data-transform';

export async function GET() {
    try {
        // Transform search console data
        const searchConsoleData = await loadSearchConsoleData();

        // Save transformed data
        const savedPath = await saveToJsonFile(searchConsoleData, {
            baseDir: 'search-console',
            filePrefix: 'transformed-data',
            isTransformed: true,
            customMetadata: {
                originalSources: [
                    'csv-crawler',
                    'csv-overall'
                ],
                transformationDate: new Date().toISOString()
            }
        });

        logger.info('Data transformation complete', {
            savedPath,
            dataStats: {
                crawlerStats: searchConsoleData.crawler.stats.length,
                queries: searchConsoleData.performance.queries.length,
                pages: searchConsoleData.performance.pages.length,
                countries: searchConsoleData.performance.countries.length
            }
        });

        return NextResponse.json({
            success: true,
            message: 'Data transformed and saved successfully',
            path: savedPath,
            stats: {
                crawlerStats: searchConsoleData.crawler.stats.length,
                queries: searchConsoleData.performance.queries.length,
                pages: searchConsoleData.performance.pages.length,
                countries: searchConsoleData.performance.countries.length
            }
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Failed to transform data', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined
        });

        return NextResponse.json({
            success: false,
            error: 'Failed to transform data',
            details: errorMessage
        }, { status: 500 });
    }
} 