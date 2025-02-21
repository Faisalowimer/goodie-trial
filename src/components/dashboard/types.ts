import { DashboardOverview, KeywordAnalytics, SearchPerformanceData, TrafficSource, GeoData } from "@/types/analytics";

export interface DashboardLayoutProps {
    children: React.ReactNode;
    params?: Promise<any>;
}

export interface DateRange {
    from: Date | null;
    to: Date | null;
}

export interface DashboardPanelProps {
    loading?: boolean;
    data?: DashboardOverview;
}

export interface SearchPerformanceChartProps {
    loading?: boolean;
    data?: SearchPerformanceData[];
}

export interface TrafficSourcesChartProps {
    loading?: boolean;
    data?: TrafficSource[];
}

export interface KeywordTableProps {
    loading?: boolean;
    data?: KeywordAnalytics;
}

export interface GeoDistributionProps {
    loading?: boolean;
    data: GeoData[];
}