"use client";

import { Card } from "@/components/ui/card";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { AggregatedMetrics } from "@/types/analytics";
import { useEffect, useState } from "react";
import { AiPlatformsTrendChart } from "@/components/dashboard/trends/ai-paltform-charts";
import { TrafficSourcesTrendChart } from "@/components/dashboard/trends/traffic-sources-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Page() {
  const [data, setData] = useState<AggregatedMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(response => {
        if (response.success) {
          setData(response.data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch dashboard data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Overview Panels */}
      <DashboardPanel loading={loading} data={data?.overview} />

      {/* Traffic Sources and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
        <TrafficSourcesTrendChart />
        <AiPlatformsTrendChart />
      </div>

      {/* Keywords Analysis */}
      <div className="py-4">
        <Card className="p-4">
          <Tabs defaultValue="branded">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Keyword Performance</h3>
              <TabsList>
                <TabsTrigger value="branded">Branded</TabsTrigger>
                <TabsTrigger value="nonBranded">Non-Branded</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="branded">
              {/* Branded Keywords Table */}
              <div className="rounded-md border">
                {/* Add table component here */}
              </div>
            </TabsContent>
            <TabsContent value="nonBranded">
              {/* Non-Branded Keywords Table */}
              <div className="rounded-md border">
                {/* Add table component here */}
              </div>
            </TabsContent>
          </Tabs>
        </Card>

      </div>

      {/* Geographic Distribution */}
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
        <div className="h-[400px]">
          {/* Add map or chart component here */}
        </div>
      </Card>

      {/* AI Platform Performance */}
      <div className="pt-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">AI Platform Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data?.aiPlatforms.map(platform => (
              <Card key={platform.platform} className="p-4">
                <h4 className="font-medium text-sm text-muted-foreground">{platform.platform}</h4>
                <div className="mt-2 space-y-1">
                  <p className="text-2xl font-bold">{platform.traffic}</p>
                  <p className="text-sm text-muted-foreground">
                    Conv: {platform.conversions}% | Eng: {platform.engagement}%
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>
    </div >
  );
}
