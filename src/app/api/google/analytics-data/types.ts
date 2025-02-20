// Interface for analytics data structure
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
    metrics: {
        totalUsers: number;
        newUsers: number;
        sessions: number;
        checkouts: number;
        bounceRate: number;
        addsToCart: number;
        engagementRate: number;
        engagedSessions: number;
        avgSessionDuration: number;
    };
}