import { searchconsole_v1 } from 'googleapis';

export interface SearchAnalyticsRow {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
    keys: string[];
}

export interface SearchAnalyticsResponse {
    rows?: SearchAnalyticsRow[];
    responseAggregationType?: string;
}

export interface SearchConsoleQueryParams {
    startDate: string;
    endDate: string;
    dimensions: Array<'date' | 'query' | 'page' | 'country' | 'device' | 'search-appearance'>;
    rowLimit?: number;
    siteUrl: string;
    aggregationType?: 'auto' | 'by_page' | 'by_property';
    dataState?: 'all' | 'final';
    type?: 'web' | 'discover' | 'news';
}

export type SearchConsoleClient = searchconsole_v1.Searchconsole; 