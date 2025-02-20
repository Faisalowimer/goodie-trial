import { google } from 'googleapis';
import { logger } from '@/utils/logger';
import { SearchAnalyticsResponse, SearchConsoleQueryParams, SearchConsoleClient } from './types';
import fs from 'fs';
import path from 'path';

// Initialize Google Auth
export const initializeSearchConsoleClient = async (): Promise<SearchConsoleClient> => {
    try {

        // Validate environment variables
        const envVars = {
            GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
            GOOGLE_SITE_URL: process.env.GOOGLE_SITE_URL,
        };

        // Check all required environment variables
        Object.entries(envVars).forEach(([key, value]) => {
            if (!value) {
                throw new Error(`Missing required environment variable: ${key}`);
            }
            if (key === 'GOOGLE_PRIVATE_KEY' && !value.includes('BEGIN PRIVATE KEY')) {
                throw new Error(`Invalid format for ${key}`);
            }
        });

        // Initialize the client
        const auth = new google.auth.JWT({
            email: envVars.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: envVars.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
            scopes: ['https://www.googleapis.com/auth/webmasters']
        });

        await auth.authorize();

        const client = google.searchconsole({ version: 'v1', auth });

        logger.info('Search Console client initialized successfully');
        return client;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Failed to initialize Search Console client', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
            envVarsStatus: {
                email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? 'present' : 'missing',
                privateKey: process.env.GOOGLE_PRIVATE_KEY ? 'present' : 'missing',
                siteUrl: process.env.GOOGLE_SITE_URL ? 'present' : 'missing'
            }
        });
        throw error;
    }
};

// Fetch Search Console data
export const fetchSearchAnalytics = async (
    searchConsole: SearchConsoleClient,
    params: SearchConsoleQueryParams
): Promise<SearchAnalyticsResponse> => {
    try {
        logger.debug('Preparing to fetch Search Console data', {
            params: {
                ...params,
                // Mask private key if present in siteUrl
                siteUrl: params.siteUrl.replace(/key=[^&]+/, 'key=REDACTED')
            }
        });

        if (!params.siteUrl) {
            throw new Error('Site URL is required but not provided');
        }

        // Validate date range
        const startDate = new Date(params.startDate);
        const endDate = new Date(params.endDate);
        const today = new Date();

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            throw new Error('Invalid date format in date range');
        }

        if (startDate > endDate) {
            throw new Error('Start date must be before end date');
        }

        if (endDate > today) {
            throw new Error('End date cannot be in the future');
        }

        // Make the API request
        logger.debug('Making Search Console API request');
        const response = await searchConsole.searchanalytics.query({
            siteUrl: params.siteUrl,
            requestBody: {
                startDate: params.startDate,
                endDate: params.endDate,
                dimensions: params.dimensions,
                rowLimit: params.rowLimit || 1000,
                aggregationType: params.aggregationType,
                dataState: params.dataState,
                type: params.type
            },
        });

        // Transform the response to match our expected types
        const transformedResponse: SearchAnalyticsResponse = {
            rows: response.data.rows?.map(row => ({
                clicks: Number(row.clicks || 0),
                impressions: Number(row.impressions || 0),
                ctr: Number(row.ctr || 0),
                position: Number(row.position || 0),
                keys: row.keys || []
            })) || [],
            responseAggregationType: response.data.responseAggregationType || undefined
        };

        const rowCount = transformedResponse.rows?.length || 0;
        logger.info('Search Console data fetched successfully', {
            rowCount,
            dateRange: `${params.startDate} to ${params.endDate}`,
            dimensions: params.dimensions,
            sampleData: rowCount > 0 ? transformedResponse.rows?.[0] : null
        });

        return transformedResponse;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Failed to fetch Search Console data', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
            params: {
                ...params,
                siteUrl: params.siteUrl.replace(/key=[^&]+/, 'key=REDACTED')
            },
            googleApiError: error instanceof Error && 'response' in error ?
                (error as any).response?.data : undefined
        });
        throw error;
    }
};

// Save data to JSON file
export const saveToJsonFile = async (data: SearchAnalyticsResponse) => {
    try {
        // Create nested directory structure if it doesn't exist
        const baseDir = path.join(process.cwd(), 'src', 'data', 'google', 'search-console');
        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir, { recursive: true });
            logger.debug(`Created directory structure`, { path: baseDir });
        }

        // Create timestamp for filename
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `${timestamp}-search-console-data.json`;
        const filePath = path.join(baseDir, fileName);

        // Add metadata to the saved data
        const dataWithMetadata = {
            metadata: {
                timestamp: new Date().toISOString(),
                rowCount: data.rows?.length || 0,
                aggregationType: data.responseAggregationType,
                dimensions: data.rows?.[0]?.keys.length || 0
            },
            data
        };

        fs.writeFileSync(filePath, JSON.stringify(dataWithMetadata, null, 2));
        logger.info('Search Console data saved', {
            path: `src/data/google/search-console/${fileName}`,
            stats: {
                rowCount: data.rows?.length || 0,
                fileSize: fs.statSync(filePath).size
            }
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('Failed to save Search Console data', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
    }
}; 