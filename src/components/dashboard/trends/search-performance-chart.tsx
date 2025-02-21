"use client"

import * as React from "react"
import { SearchPerformanceChartProps } from "../types"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { formatter } from "@/utils/format"
import { TrendingDown } from "lucide-react"

export function SearchPerformanceChart({ data, loading = false }: SearchPerformanceChartProps) {
    if (loading || !data) {
        return (
            <Card className="dark:bg-accent">
                <CardHeader>
                    <CardTitle>Search Performance</CardTitle>
                    <CardDescription>Clicks and impressions over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Loading search data...</p>
                </CardContent>
            </Card>
        );
    }

    // Calculate performance metrics
    const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);
    const totalImpressions = data.reduce((sum, item) => sum + item.impressions, 0);
    const avgPosition = data.reduce((sum, item) => sum + item.position, 0) / data.length;
    const avgCTR = (totalClicks / totalImpressions) * 100;

    return (
        <Card className="dark:bg-accent">
            <CardHeader>
                <CardTitle>Search Performance</CardTitle>
                <CardDescription>Search visibility and engagement trends</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => format(new Date(value), "MMM d")}
                                fontSize={12}
                                className="fill-muted-foreground"
                            />
                            <YAxis
                                yAxisId="left"
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                tickFormatter={formatter("number")}
                                className="fill-muted-foreground"
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                tickLine={false}
                                axisLine={false}
                                fontSize={12}
                                tickFormatter={formatter("number")}
                                className="fill-muted-foreground"
                            />
                            <Tooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                                                <div className="grid gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            {format(new Date(data.date), "MMM d, yyyy")}
                                                        </span>
                                                        <span className="font-bold">
                                                            {formatter("number")(data.clicks)} clicks
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {formatter("number")(data.impressions)} impressions
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            Position: {data.position.toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend />
                            <Area
                                yAxisId="left"
                                type="monotone"
                                dataKey="clicks"
                                name="Clicks"
                                stroke="hsl(var(--primary))"
                                fill="hsl(var(--primary))"
                                fillOpacity={0.2}
                                strokeWidth={2}
                            />
                            <Area
                                yAxisId="right"
                                type="monotone"
                                dataKey="impressions"
                                name="Impressions"
                                stroke="hsl(var(--secondary))"
                                fill="hsl(var(--secondary))"
                                fillOpacity={0.1}
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    Average position {avgPosition.toFixed(1)} <TrendingDown className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    {formatter("number")(totalClicks)} clicks ({avgCTR.toFixed(1)}% CTR) from {formatter("number")(totalImpressions)} impressions
                </div>
            </CardFooter>
        </Card>
    );
} 