/**
 * Raw response from Bing API's GetRankAndTrafficStats endpoint
 * Represents the data as it comes directly from the API
 */
export interface BingRawResponse {
    Date: string;
    Impressions: number;
    Clicks: number;
    AvgPosition?: number;
    CTR?: number;
}

/**
 * Success result type for Bing API tests
 */
export interface SuccessResult {
    siteUrl: string;
    dateRange: { startDate: string; endDate: string };
    success: true;
    data: BingApiResponse;
}

export interface BingTrafficStats {
    date: string;
    impressions: number;
    clicks: number;
    position?: number;
    ctr?: number;
}

/**
 * API response structure with data array and total count
 */
export interface BingApiResponse {
    data: BingTrafficStats[];
    totalCount: number;
}

/**
 * Parameters required for querying the Bing API
 */
export interface BingQueryParams {
    siteUrl: string;
    startDate: string;
    endDate: string;
}

/**
 * Raw SOAP response structure for GetRankAndTrafficStats
 * Used for parsing the XML response from Bing's SOAP API
 */
export interface BingRankAndTrafficStats {
    Date: string;
    Impressions: string | number;
    Clicks: string | number;
    Position?: string | number;
    CTR?: string | number;
} 