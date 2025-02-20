import { logger } from '@/utils/logger';
import { NextResponse } from 'next/server';
import { fetchBingData } from '../utils';
import { SuccessResult } from '../types';



export async function GET() {
    try {
        logger.info('Testing Bing Webmaster API connection');

        // Check environment variables
        const envStatus = {
            BING_API_KEY: process.env.BING_API_KEY ? 'present' : 'missing',
            SITE_URL: process.env.SITE_URL ? 'present' : 'missing',
            NODE_ENV: process.env.NODE_ENV || 'not set'
        };

        logger.debug('Environment variables status', envStatus);

        if (!process.env.BING_API_KEY) {
            return NextResponse.json({
                success: false,
                error: 'BING_API_KEY environment variable is not set',
                envStatus,
            }, { status: 400 });
        }

        if (!process.env.SITE_URL) {
            return NextResponse.json({
                success: false,
                error: 'SITE_URL environment variable is not set',
                envStatus,
            }, { status: 400 });
        }

        // Try different date ranges
        const dateRanges = [
            {
                // Last 7 days
                startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0]
            },
            {
                // Last month
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0]
            },
            {
                // Last year
                startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0]
            }
        ];

        // Try different site URL formats
        const siteUrls = [
            process.env.SITE_URL,
            process.env.SITE_URL.replace(/^https?:\/\//, ''),
            `https://${process.env.SITE_URL.replace(/^https?:\/\//, '')}`
        ];

        const results = await Promise.all(
            dateRanges.flatMap(dateRange =>
                siteUrls.map(siteUrl =>
                    fetchBingData({
                        siteUrl,
                        ...dateRange
                    }).then(data => ({
                        siteUrl,
                        dateRange,
                        success: true as const,
                        data
                    })).catch(error => ({
                        siteUrl,
                        dateRange,
                        success: false as const,
                        error: error instanceof Error ? error.message : String(error)
                    }))
                )
            )
        );

        const successfulResults = results.filter((r): r is SuccessResult => r.success && r.data.totalCount > 0);

        if (successfulResults.length > 0) {
            return NextResponse.json({
                success: true,
                message: 'Successfully connected to Bing Webmaster API',
                envStatus,
                testResults: successfulResults.map(r => ({
                    siteUrl: r.siteUrl,
                    dateRange: `${r.dateRange.startDate} to ${r.dateRange.endDate}`,
                    dataPoints: r.data.totalCount,
                    sampleData: r.data.data.slice(0, 1)
                }))
            });
        }

        return NextResponse.json({
            success: false,
            message: 'Connected to API but no data found',
            envStatus,
            allResults: results,

        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Bing API test failed', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined
        });

        return NextResponse.json({
            success: false,
            error: errorMessage,
            envStatus: {
                BING_API_KEY: process.env.BING_API_KEY ? 'present' : 'missing',
                SITE_URL: process.env.SITE_URL ? 'present' : 'missing',
                NODE_ENV: process.env.NODE_ENV || 'not set'
            },
        }, { status: 500 });
    }
} 