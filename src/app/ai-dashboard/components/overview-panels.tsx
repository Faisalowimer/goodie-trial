'use client';

import { PanelCard } from "@/components/panel-card";
import { AIAnalytics } from "@/utils/ai-analytics";

interface OverviewPanelsProps {
    data: AIAnalytics;
    loading: boolean;
}

export function OverviewPanels({ data, loading }: OverviewPanelsProps) {
    const aiPercentage = ((data?.aiSessions / data?.totalSessions) * 100) || 0;
    const activeAISources = Object.entries(data?.sourceBreakdown || {})
        .filter(([source, metrics]) => source !== 'NON_AI' && metrics.sessions > 0)
        .length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PanelCard
                title="Total Sessions"
                value={data?.totalSessions || 0}
                trend="All traffic in selected period"
                format="number"
                isLoading={loading}
            />
            <PanelCard
                title="AI Traffic"
                value={aiPercentage}
                trend="Percentage of total traffic"
                format="percentage"
                isLoading={loading}
            />
            <PanelCard
                title="Active AI Sources"
                value={activeAISources}
                trend="Different AI platforms"
                format="number"
                isLoading={loading}
            />
        </div>
    );
} 