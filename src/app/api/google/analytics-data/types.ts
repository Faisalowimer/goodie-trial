/**
 * Metrics collected for each analytics session
 */
export interface AnalyticsMetrics {
    totalUsers: number;
    newUsers: number;
    sessions: number;
    checkouts: number;
    bounceRate: number;
    addsToCart: number;
    engagementRate: number;
    engagedSessions: number;
    avgSessionDuration: number;
}

/**
 * Analytics session data structure
 */
export interface AnalyticsSession {
    date: string;
    city: string;
    country: string;
    browser: string;
    events: string[];
    searchTerm: string;
    session: string;
    sessionSource: string;
    sessionMedium: string;
    /** Session metrics */
    metrics: AnalyticsMetrics;
}

/**
 * Response from the Google Analytics Data API
 * Maps session IDs to their corresponding session data
 */
export type AnalyticsResponse = Record<string, AnalyticsSession>;