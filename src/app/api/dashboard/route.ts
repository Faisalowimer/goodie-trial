import { logger } from '@/utils/logger';
import { NextResponse } from 'next/server';
import { aggregateData } from '@/services/analytics';

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');

        const dateRange = from && to ? {
            from: new Date(from),
            to: new Date(to)
        } : undefined;

        logger.debug('Fetching dashboard data with date range', { dateRange });

        const data = await aggregateData(dateRange);

        return NextResponse.json({
            success: true,
            data
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Failed to fetch dashboard data', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined
        });

        return NextResponse.json({
            success: false,
            error: 'Failed to fetch dashboard data',
            details: errorMessage
        }, { status: 500 });
    }
} 