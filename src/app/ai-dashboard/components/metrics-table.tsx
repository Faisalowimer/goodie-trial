'use client';

import { Card } from "@/components/ui/card";
import { AIAnalytics } from "@/utils/ai-analytics";

interface MetricsTableProps {
    data: AIAnalytics;
    loading: boolean;
}

export function MetricsTable({ data, loading }: MetricsTableProps) {
    if (loading || !data) {
        return (
            <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Detailed Metrics by Source</h2>
                <div className="text-center py-4">Loading metrics...</div>
            </Card>
        );
    }

    // Include all AI sources, even those with 0 sessions
    const allSources = Object.entries(data.sourceBreakdown)
        .filter(([source]) => source !== 'NON_AI')
        .map(([source, metrics]) => ({
            name: source,
            sessions: metrics.sessions,
            users: metrics.users,
            newUsers: metrics.newUsers,
            engagementRate: (metrics.engagementRate * 100).toFixed(1),
            bounceRate: (metrics.bounceRate * 100).toFixed(1),
            avgDuration: metrics.avgSessionDuration.toFixed(1),
        }))
        .sort((a, b) => b.sessions - a.sessions);

    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Detailed Metrics by Source</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Source
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sessions
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Users
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                New Users
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Engagement Rate
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Bounce Rate
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Avg Duration (s)
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {allSources.map((source) => (
                            <tr key={source.name} className={source.sessions === 0 ? 'text-gray-400' : ''}>
                                <td className="px-6 py-4 whitespace-nowrap">{source.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{source.sessions}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{source.users}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{source.newUsers}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{source.engagementRate}%</td>
                                <td className="px-6 py-4 whitespace-nowrap">{source.bounceRate}%</td>
                                <td className="px-6 py-4 whitespace-nowrap">{source.avgDuration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
} 