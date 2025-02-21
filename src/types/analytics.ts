export interface MetricWithTrend {
    value: number;
    trend: number;
}

export interface DashboardOverview {
    totalTraffic: MetricWithTrend;
    conversionRate: MetricWithTrend;
    engagementRate: MetricWithTrend;
    avgSessionDuration: MetricWithTrend;
}

export interface TrafficSource {
    source: string;
    sessions: number;
    conversions: number;
    engagement: number;
}

export interface KeywordData {
    keyword: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
}

export interface KeywordAnalytics {
    branded: KeywordData[];
    nonBranded: KeywordData[];
}

export interface SearchPerformanceData {
    date: string;
    clicks: number;
    impressions: number;
    position: number;
}

export interface GeoData {
    country: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
}

export interface AiPlatformData {
    platform: string;
    traffic: number;
    engagement: number;
    conversions: number;
}

export interface AggregatedMetrics {
    overview: DashboardOverview;
    trafficSources: TrafficSource[];
    keywords: KeywordAnalytics;
    searchPerformance: SearchPerformanceData[];
    geoDistribution: GeoData[];
    aiPlatforms: AiPlatformData[];
}