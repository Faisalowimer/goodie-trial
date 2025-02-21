"use client"

import * as React from "react"
import { formatter } from "@/utils/format"
import { TrendingUp } from "lucide-react"
import { TrafficSourcesChartProps } from "../types"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function TrafficSourcesChart({ data, loading = false }: TrafficSourcesChartProps) {
    if (loading || !data || data.length === 0) {
        return (
            <Card className="dark:bg-accent">
                <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                    <CardDescription>Sessions by source</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">No traffic data available</p>
                </CardContent>
            </Card>
        );
    }

    // Calculate total sessions and engagement metrics
    const totalSessions = data.reduce((sum, item) => sum + item.sessions, 0);
    let topSource = data[0];
    for (const source of data) {
        if (source.sessions > topSource.sessions) {
            topSource = source;
        }
    }
    const topSourcePercentage = (topSource.sessions / totalSessions) * 100;

    return (
        <Card className="dark:bg-accent">
            <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Distribution of traffic by source</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                            <XAxis
                                dataKey="source"
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                className="fill-muted-foreground"
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                tickFormatter={formatter("number")}
                                className="fill-muted-foreground"
                            />
                            <Tooltip
                                cursor={false}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        const percentage = (data.sessions / totalSessions) * 100;
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="grid gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            {data.source}
                                                        </span>
                                                        <span className="font-bold">
                                                            {formatter("number")(data.sessions)} sessions
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {percentage.toFixed(1)}% of total traffic
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar
                                dataKey="sessions"
                                fill="hsl(var(--chart-2))"
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    {topSource.source} is the top source <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    {formatter("number")(topSource.sessions)} sessions ({topSourcePercentage.toFixed(1)}% of total traffic)
                </div>
            </CardFooter>
        </Card>
    );
}
