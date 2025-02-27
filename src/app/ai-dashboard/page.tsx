'use client';

import { useEffect } from 'react';
import { MetricsTable } from './components/metrics-table';
import { OverviewPanels } from './components/overview-panels';
import { AISourcesBreakdown } from './components/ai-sources-breakdown';
import { useAIDashboardStore } from '@/store/ai-dashboard';
import { TrafficDistribution } from './components/traffic-distribution';

const defaultMetrics = {
    sessions: 0,
    users: 0,
    newUsers: 0,
    bounceRate: 0,
    engagementRate: 0,
    avgSessionDuration: 0,
};

const defaultSourceBreakdown = {
    CHATGPT: { ...defaultMetrics },
    PERPLEXITY: { ...defaultMetrics },
    GOOGLE_AI: { ...defaultMetrics },
    BING: { ...defaultMetrics },
    PHIND: { ...defaultMetrics },
    POE: { ...defaultMetrics },
    ANTHROPIC: { ...defaultMetrics },
    YOU: { ...defaultMetrics },
    OTHER_AI: { ...defaultMetrics },
    NON_AI: { ...defaultMetrics },
} as const;

const defaultConversionRateBySource = {
    CHATGPT: 0,
    PERPLEXITY: 0,
    GOOGLE_AI: 0,
    BING: 0,
    PHIND: 0,
    POE: 0,
    ANTHROPIC: 0,
    YOU: 0,
    OTHER_AI: 0,
    NON_AI: 0,
};

export default function AIAnalyticsDashboard() {
    const { data, loading, error, fetchAIAnalytics } = useAIDashboardStore();

    useEffect(() => {
        fetchAIAnalytics();
    }, [fetchAIAnalytics]);

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    // Create a safe data object with default values
    const safeData = data || {
        totalSessions: 0,
        aiSessions: 0,
        nonAiSessions: 0,
        sourceBreakdown: defaultSourceBreakdown,
        conversionMetrics: {
            totalConversions: 0,
            aiConversions: 0,
            nonAiConversions: 0,
            conversionRateBySource: defaultConversionRateBySource
        }
    };

    return (
        <div className="space-y-6">
            <OverviewPanels data={safeData} loading={loading} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrafficDistribution data={safeData} loading={loading} />
                <AISourcesBreakdown data={safeData} loading={loading} />
            </div>
            <MetricsTable data={safeData} loading={loading} />
        </div>
    );
}