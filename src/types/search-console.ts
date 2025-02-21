// Crawler Data Types
export interface CrawlStats {
    date: string;
    totalRequests: number;
    downloadSize: number;
    responseTime: number;
}

export interface FileTypeDistribution {
    type: string;
    ratio: number;
}

export interface CrawlerResponse {
    status: string;
    count: number;
}

export interface GooglebotType {
    type: string;
    count: number;
}

// Overall Search Console Data Types
export interface SearchQuery {
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
}

export interface PageStats {
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
}

export interface CountryStats {
    country: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
}

export interface DeviceStats {
    device: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
}

export interface DateStats {
    date: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
}

// Unified Search Console Data
export interface SearchConsoleData {
    crawler: {
        stats: CrawlStats[];
        fileTypes: FileTypeDistribution[];
        responses: CrawlerResponse[];
        botTypes: GooglebotType[];
    };
    performance: {
        queries: SearchQuery[];
        pages: PageStats[];
        countries: CountryStats[];
        devices: DeviceStats[];
        dates: DateStats[];
    };
} 