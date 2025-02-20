import { NextResponse } from 'next/server';
import { logger } from '@/utils/logger';
import { initializeSearchConsoleClient } from '../utils';

// This route is used to test the authentication of the Search Console API
// It will list all available sites for the authenticated user
// It is used to ensure that the authentication is working correctly
// and that the user has access to the Search Console API
// It is used to debug issues with the authentication process

export async function GET() {
    try {
        logger.info('Starting authentication test');

        // Initialize client
        const client = await initializeSearchConsoleClient();

        // List all available sites
        logger.debug('Attempting to list sites');
        const sites = await client.sites.list();

        logger.info('Successfully listed sites', {
            siteCount: sites.data.siteEntry?.length || 0
        });

        return NextResponse.json({
            status: 'success',
            message: 'Authentication successful',
            sites: sites.data.siteEntry?.map(site => ({
                siteUrl: site.siteUrl,
                permissionLevel: site.permissionLevel,
            }))
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Authentication test failed', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined
        });

        return NextResponse.json({
            status: 'error',
            message: errorMessage,
            environmentStatus: {
                GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'present' : 'missing',
                GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? 'present (length: ' + process.env.GOOGLE_PRIVATE_KEY.length + ')' : 'missing',
                GOOGLE_SITE_URL: process.env.GOOGLE_SITE_URL ? 'present' : 'missing'
            }
        }, { status: 500 });
    }
} 