import { parse } from 'csv-parse/sync';
import { logger } from '@/utils/logger';
import { SearchConsoleData } from '@/types/search-console';
import fs from 'fs';
import path from 'path';

interface CsvRow {
    [key: string]: string;
}

export function transformCsvToJson(csvContent: string, headers: boolean = true): CsvRow[] {
    return parse(csvContent, {
        columns: headers,
        skip_empty_lines: true,
        trim: true,
    });
}

export async function loadSearchConsoleData(): Promise<SearchConsoleData> {
    const baseDir = path.join(process.cwd(), 'src', 'data', 'google', 'search-console');
    logger.debug('Loading search console data from', { baseDir });

    try {
        // Load crawler data
        const crawlerData = {
            stats: transformCsvToJson(
                fs.readFileSync(path.join(baseDir, 'csv-crawler', 'Summary crawl stats chart.csv'), 'utf-8')
            ).map(row => ({
                date: row.Date,
                totalRequests: Number(row['Total crawl requests']),
                downloadSize: Number(row['Total download size (Bytes)']),
                responseTime: Number(row['Average response time (ms)'])
            })),
            fileTypes: transformCsvToJson(
                fs.readFileSync(path.join(baseDir, 'csv-crawler', 'File type table.csv'), 'utf-8')
            ).map(row => ({
                type: row['File type'],
                ratio: Number(row['Total requests ratio'])
            })),
            responses: transformCsvToJson(
                fs.readFileSync(path.join(baseDir, 'csv-crawler', 'Response table.csv'), 'utf-8')
            ).map(row => ({
                status: row['Response'],
                count: Number(row['Total requests ratio'])
            })),
            botTypes: transformCsvToJson(
                fs.readFileSync(path.join(baseDir, 'csv-crawler', 'Googlebot type table.csv'), 'utf-8')
            ).map(row => ({
                type: row['Googlebot type'],
                count: Number(row['Total requests ratio'])
            }))
        };

        // Load overall performance data
        const performanceData = {
            queries: transformCsvToJson(
                fs.readFileSync(path.join(baseDir, 'csv-overall', 'Queries.csv'), 'utf-8')
            ).map(row => ({
                query: row['Top queries'], // Match the CSV header
                clicks: Number(row.Clicks),
                impressions: Number(row.Impressions),
                ctr: Number(row.CTR.replace('%', '')) / 100,
                position: Number(row.Position)
            })),
            pages: transformCsvToJson(
                fs.readFileSync(path.join(baseDir, 'csv-overall', 'Pages.csv'), 'utf-8')
            ).map(row => ({
                page: row['Top pages'],
                clicks: Number(row.Clicks),
                impressions: Number(row.Impressions),
                ctr: Number(row.CTR.replace('%', '')) / 100,
                position: Number(row.Position)
            })),
            countries: transformCsvToJson(
                fs.readFileSync(path.join(baseDir, 'csv-overall', 'Countries.csv'), 'utf-8')
            ).map(row => ({
                country: row.Country,
                clicks: Number(row.Clicks),
                impressions: Number(row.Impressions),
                ctr: Number(row.CTR.replace('%', '')) / 100,
                position: Number(row.Position)
            })),
            devices: transformCsvToJson(
                fs.readFileSync(path.join(baseDir, 'csv-overall', 'Devices.csv'), 'utf-8')
            ).map(row => ({
                device: row.Device,
                clicks: Number(row.Clicks),
                impressions: Number(row.Impressions),
                ctr: Number(row.CTR.replace('%', '')) / 100,
                position: Number(row.Position)
            })),
            dates: transformCsvToJson(
                fs.readFileSync(path.join(baseDir, 'csv-overall', 'Dates.csv'), 'utf-8')
            ).map(row => ({
                date: row.Date,
                clicks: Number(row.Clicks),
                impressions: Number(row.Impressions),
                ctr: Number(row.CTR.replace('%', '')) / 100,
                position: Number(row.Position)
            }))
        };

        logger.debug('Successfully loaded all search console data', {
            stats: {
                crawlerStats: crawlerData.stats.length,
                queries: performanceData.queries.length,
                pages: performanceData.pages.length,
                countries: performanceData.countries.length
            }
        });

        return {
            crawler: crawlerData,
            performance: performanceData
        };
    } catch (error) {
        logger.error('Failed to load search console data', {
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
    }
} 