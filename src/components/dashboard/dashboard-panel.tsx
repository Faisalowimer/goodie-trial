import { PanelCard } from "@/components/panel-card";
import { DashboardPanelProps } from "./types";

export function DashboardPanel({ loading = false, data }: DashboardPanelProps) {
    return (
        <div className="grid grid-cols-4 gap-4 w-full pt-1">
            <PanelCard
                title="Total AI Traffic"
                value={data?.totalTraffic.value ?? 0}
                statsMsg={data?.totalTraffic.trend ?? "Loading..."}
                format="number"
                isLoading={loading}
            />
            <PanelCard
                title="Conversion Rate"
                value={data?.conversionRate.value ?? 0}
                statsMsg={data?.conversionRate.trend ?? "Loading..."}
                format="percentage"
                isLoading={loading}
            />
            <PanelCard
                title="Engagement Rate"
                value={data?.engagementRate.value ?? 0}
                statsMsg={data?.engagementRate.trend ?? "Loading..."}
                format="percentage"
                isLoading={loading}
            />
            <PanelCard
                title="Avg. Session Duration"
                value={data?.avgSessionDuration.value ?? 0}
                statsMsg={data?.avgSessionDuration.trend ?? "Loading..."}
                format="duration"
                isLoading={loading}
            />
        </div>
    );
}