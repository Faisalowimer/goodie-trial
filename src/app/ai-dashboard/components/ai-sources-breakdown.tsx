'use client';

import { AIAnalytics } from "@/utils/ai-analytics";
import { TrafficSourcesChart } from "@/components/dashboard/trends/ai-sources-chart";

interface AISourcesBreakdownProps {
    data: AIAnalytics;
    loading: boolean;
}

export function AISourcesBreakdown({ data, loading }: AISourcesBreakdownProps) {
    if (!data) return null;

    const sourcesData = Object.entries(data.sourceBreakdown)
        .filter(([source]) => source !== 'NON_AI')
        .map(([source, metrics]) => ({
            source,
            sessions: metrics.sessions,
            users: metrics.users,
            newUsers: metrics.newUsers,
            engagement: metrics.engagementRate,
            conversions: 0, // We'll add this when we implement conversion tracking
            severity: metrics.bounceRate > 0.5 ? 'high' : metrics.bounceRate > 0.3 ? 'medium' : 'low'
        }))
        .sort((a, b) => b.sessions - a.sessions);

    return <TrafficSourcesChart data={sourcesData} loading={loading} />;
} 