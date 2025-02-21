import { PanelCard } from "@/components/panel-card";
import { useDashboardStore } from "@/store/dashboard";
import { DashboardPanelProps } from "./types";
import { formatDuration, formatTrendText } from "@/utils/format";

export function DashboardPanel({ loading = false, data }: DashboardPanelProps) {
    const { dateRange } = useDashboardStore();

    return (
        <div className="grid grid-cols-4 gap-4 w-full pt-1">
            <PanelCard
                title="Total Sessions"
                value={data?.totalTraffic.value ?? 0}
                trend={loading ? "" : formatTrendText(data?.totalTraffic.trend, dateRange)}
                format="number"
                isLoading={loading}
            />
            <PanelCard
                title="Conversion Rate"
                value={data?.conversionRate.value ?? 0}
                trend={loading ? "" : formatTrendText(data?.conversionRate.trend, dateRange)}
                format="percentage"
                isLoading={loading}
            />
            <PanelCard
                title="Engagement Rate"
                value={data?.engagementRate.value ?? 0}
                trend={loading ? "" : formatTrendText(data?.engagementRate.trend, dateRange)}
                format="percentage"
                isLoading={loading}
            />
            <PanelCard
                title="Avg. Session Duration"
                value={data?.avgSessionDuration.value ?? 0}
                trend={loading ? "" : formatTrendText(data?.avgSessionDuration.trend, dateRange)}
                format="duration"
                formatFn={formatDuration}
                isLoading={loading}
            />
        </div>
    );
}