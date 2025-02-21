export interface AggregatedMetrics {
    overview: {
        totalTraffic: { value: number; trend: string };
        conversionRate: { value: number; trend: string };
        engagementRate: { value: number; trend: string };
        avgSessionDuration: { value: number; trend: string };
    };
    trafficSources: {
        source: string;
        sessions: number;
        conversions: number;
        engagement: number;
    }[];
    keywords: {
        branded: {
            keyword: string;
            clicks: number;
            impressions: number;
            ctr: number;
            position: number;
        }[];
        nonBranded: {
            keyword: string;
            clicks: number;
            impressions: number;
            ctr: number;
            position: number;
        }[];
    };
    aiPlatforms: {
        platform: string;
        traffic: number;
        engagement: number;
        conversions: number;
    }[];
    geographicData: {
        country: string;
        traffic: number;
        engagement: number;
    }[];
}