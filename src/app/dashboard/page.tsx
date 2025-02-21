"use client";

import { useEffect } from "react";
import { KeywordTable } from "@/components/dashboard/keywords/keyword-table";
import { DashboardPanel } from "@/components/dashboard/dashboard-panel";
import { GeoDistribution } from "@/components/dashboard/geo/geo-distribution";
import { useDashboardStore } from "@/store/dashboard";
import { TrafficSourcesChart } from "@/components/dashboard/trends/traffic-sources-chart";
import { SearchPerformanceChart } from "@/components/dashboard/trends/search-performance-chart";

export default function Page() {
  const { data, loading, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <div className="space-y-4">
      {/* Overview Panels */}
      <DashboardPanel loading={loading} data={data?.overview} />

      {/* Traffic Sources and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TrafficSourcesChart data={data?.trafficSources} loading={loading} />
        <SearchPerformanceChart data={data?.searchPerformance} loading={loading} />
      </div>

      {/* Keywords and Geographic Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <KeywordTable data={data?.keywords} loading={loading} />
        <GeoDistribution data={data?.geoDistribution || []} loading={loading} />
      </div>
    </div>
  );
}
