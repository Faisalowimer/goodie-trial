import { parse } from 'csv-parse/sync';
import { SearchConsoleData } from '@/types/search-console';
import fs from 'fs';
import path from 'path';

export function transformCsvToJson(csvContent: string, headers: boolean = true): any[] {
    return parse(csvContent, {
        columns: headers,
        skip_empty_lines: true,
        trim: true,
    });
}

export async function loadSearchConsoleData(): Promise<SearchConsoleData> {
    const baseDir = path.join(process.cwd(), 'src', 'data', 'google', 'search-console');

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
            status: row.Status,
            count: Number(row.Count)
        })),
        botTypes: transformCsvToJson(
            fs.readFileSync(path.join(baseDir, 'csv-crawler', 'Googlebot type table.csv'), 'utf-8')
        ).map(row => ({
            type: row.Type,
            count: Number(row.Count)
        }))
    };

    // Load overall performance data
    const performanceData = {
        queries: transformCsvToJson(
            fs.readFileSync(path.join(baseDir, 'csv-overall', 'Queries.csv'), 'utf-8')
        ).map(row => ({
            query: row.Query,
            clicks: Number(row.Clicks),
            impressions: Number(row.Impressions),
            ctr: Number(row.CTR.replace('%', '')) / 100,
            position: Number(row.Position)
        })),
        pages: transformCsvToJson(
            fs.readFileSync(path.join(baseDir, 'csv-overall', 'Pages.csv'), 'utf-8')
        ).map(row => ({
            page: row.Page,
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

    return {
        crawler: crawlerData,
        performance: performanceData
    };
} 