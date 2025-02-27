'use client';

import { AIAnalytics } from "@/utils/ai-analytics";
import { ChartConfig } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart, Sector } from "recharts";

interface TrafficDistributionProps {
    data: AIAnalytics;
    loading: boolean;
}

const chartConfig = {
    visitors: {
        label: "Sessions",
    },
    ai: {
        label: "AI Traffic",
        color: "hsl(var(--chart-1))",
    },
    nonAi: {
        label: "Non-AI Traffic",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig;

export function TrafficDistribution({ data, loading }: TrafficDistributionProps) {
    if (loading || !data) {
        return (
            <Card className="dark:bg-accent">
                <CardHeader>
                    <CardTitle>Traffic Distribution</CardTitle>
                    <CardDescription>AI vs Non-AI Traffic</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Loading traffic data...</p>
                </CardContent>
            </Card>
        );
    }

    const chartData = [
        { type: "ai", sessions: data.aiSessions, fill: chartConfig.ai.color },
        { type: "nonAi", sessions: data.nonAiSessions, fill: chartConfig.nonAi.color },
    ];

    const aiPercentage = (data.aiSessions / data.totalSessions) * 100;

    return (
        <Card className="dark:bg-accent">
            <CardHeader>
                <CardTitle>Traffic Distribution</CardTitle>
                <CardDescription>AI vs Non-AI Traffic</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <div className="mx-auto aspect-square max-h-[250px]">
                    <PieChart width={250} height={250}>
                        <Pie
                            data={chartData}
                            dataKey="sessions"
                            nameKey="type"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            label={({ name, percent }) =>
                                `${chartConfig[name as keyof typeof chartConfig].label}: ${(percent * 100).toFixed(1)}%`
                            }
                        />
                    </PieChart>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                    AI traffic dominates <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    {aiPercentage.toFixed(1)}% of total traffic comes from AI sources
                </div>
            </CardFooter>
        </Card>
    );
} 