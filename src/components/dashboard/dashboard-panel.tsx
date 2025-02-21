import { PanelCard } from "@/components/panel-card";
import { differenceInDays } from "date-fns";
import { useDashboardStore } from "@/store/dashboard";
import { DashboardPanelProps, DateRange } from "./types";

function formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
}

function formatTrendText(trend: number | undefined, dateRange: DateRange): string {
    if (trend === undefined) return "Loading...";
    const days = dateRange.from && dateRange.to ? differenceInDays(dateRange.to, dateRange.from) : 7;
    return `${trend >= 0 ? '+' : ''}${trend.toFixed(1)}% in last ${days}d`;
}

export function DashboardPanel({ loading = false, data }: DashboardPanelProps) {
    const { dateRange } = useDashboardStore();

    return (
        <div className="grid grid-cols-4 gap-4 w-full pt-1">
            <PanelCard
                title="Total Sessions"
                value={data?.totalTraffic.value ?? 0}
                trend={formatTrendText(data?.totalTraffic.trend, dateRange)}
                format="number"
                isLoading={loading}
            />
            <PanelCard
                title="Conversion Rate"
                value={data?.conversionRate.value ?? 0}
                trend={formatTrendText(data?.conversionRate.trend, dateRange)}
                format="percentage"
                isLoading={loading}
            />
            <PanelCard
                title="Engagement Rate"
                value={data?.engagementRate.value ?? 0}
                trend={formatTrendText(data?.engagementRate.trend, dateRange)}
                format="percentage"
                isLoading={loading}
            />
            <PanelCard
                title="Avg. Session Duration"
                value={data?.avgSessionDuration.value ?? 0}
                trend={formatTrendText(data?.avgSessionDuration.trend, dateRange)}
                format="duration"
                formatFn={formatDuration}
                isLoading={loading}
            />
        </div>
    );
}