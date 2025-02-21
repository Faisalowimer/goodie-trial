import { logger } from '@/utils/logger';
import { NextResponse } from 'next/server';
import { aggregateData } from '@/services/analytics';

export async function GET() {
    try {
        const data = await aggregateData();

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