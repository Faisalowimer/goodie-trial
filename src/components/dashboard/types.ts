export interface DashboardLayoutProps {
    children: React.ReactNode;
    fontClasses: string;
    defaultOpen: boolean;
}

export type DateRange = {
    from: Date | null | undefined
    to: Date | null | undefined
}

export interface DashboardPanelProps {
    loading?: boolean;
    data?: {
        totalTraffic: { value: number; trend: string };
        conversionRate: { value: number; trend: string };
        engagementRate: { value: number; trend: string };
        avgSessionDuration: { value: number; trend: string };
    };
}