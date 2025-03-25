// @app/dashboard/analytics/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { apiFetch } from "@/utils/api"; // Adjust the import path as needed
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const [overviewData, setOverviewData] = useState(null);
  const [trendsData, setTrendsData] = useState(null);
  const [topCampaigns, setTopCampaigns] = useState([]);
  const [campaignPerformance, setCampaignPerformance] = useState([]);
  const [adPerformance, setAdPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [overview, trends, top, campaigns, ads] = await Promise.all([
          apiFetch("/api/analytics/overview"),
          apiFetch("/api/analytics/trends"),
          apiFetch("/api/analytics/top-campaigns"),
          apiFetch("/api/analytics/campaigns"),
          apiFetch("/api/analytics/ads"),
        ]);
        setOverviewData(overview);
        setTrendsData(trends);
        setTopCampaigns(top);
        setCampaignPerformance(campaigns);
        setAdPerformance(ads);
      } catch (err) {
        setError("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-muted-foreground">Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  // Extract trends or default to placeholders
  const impressionsTrend = overviewData?.impressionsTrend || "up";
  const clicksTrend = overviewData?.clicksTrend || "up";
  const conversionRateTrend = overviewData?.conversionRateTrend || "down";
  const spendTrend = overviewData?.spendTrend || "up";

  // Chart data for Performance Trends
  const chartData = {
    labels: trendsData?.dates || [],
    datasets: [
      {
        label: "Impressions",
        data: trendsData?.impressions || [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Clicks",
        data: trendsData?.clicks || [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-medium tracking-tight">
          Analytics
        </h1>
        <p className="text-muted-foreground">
          Track your advertising performance metrics.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-md rounded-none border-b border-black/10 bg-transparent p-0">
          <TabsTrigger
            value="overview"
            className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="campaigns"
            className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Campaigns
          </TabsTrigger>
          <TabsTrigger
            value="ads"
            className="rounded-none border-b-2 border-transparent py-2.5 data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            Ads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Impressions"
              value={overviewData?.totalImpressions?.toLocaleString() || "0"}
              description="+12.3% from last month" // Replace with real trend data if API provides it
              icon={<BarChart3 className="h-4 w-4" />}
              trend={impressionsTrend}
            />
            <MetricCard
              title="Total Clicks"
              value={overviewData?.totalClicks?.toLocaleString() || "0"}
              description="+5.7% from last month"
              icon={<TrendingUp className="h-4 w-4" />}
              trend={clicksTrend}
            />
            <MetricCard
              title="Conversion Rate"
              value={
                overviewData?.conversionRate
                  ? `${overviewData.conversionRate}%`
                  : "0%"
              }
              description="-0.5% from last month"
              icon={<Users className="h-4 w-4" />}
              trend={conversionRateTrend}
            />
            <MetricCard
              title="Total Spend"
              value={
                overviewData?.totalSpend
                  ? `$${overviewData.totalSpend.toLocaleString()}`
                  : "$0"
              }
              description="+8.1% from last month"
              icon={<DollarSign className="h-4 w-4" />}
              trend={spendTrend}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-black/10 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-lg font-medium">
                  Performance Trends
                </CardTitle>
                <CardDescription>
                  Daily impressions and clicks over time
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {trendsData ? (
                  <Line data={chartData} />
                ) : (
                  <div className="h-[300px] flex items-center justify-center border border-dashed border-black/10 bg-muted/20">
                    <p className="text-muted-foreground text-sm">
                      Loading chart...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-black/10 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-lg font-medium">
                  Top Performing Campaigns
                </CardTitle>
                <CardDescription>Based on click-through rate</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {topCampaigns.map((campaign, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{campaign.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {campaign.impressions.toLocaleString()} impressions
                        </p>
                      </div>
                      <p className="font-medium">{campaign.ctr.toFixed(2)}%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg font-medium">
                Campaign Performance
              </CardTitle>
              <CardDescription>
                Detailed metrics for all campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-muted-foreground text-sm">
                    <th className="pb-2">Campaign</th>
                    <th className="pb-2">Impressions</th>
                    <th className="pb-2">Clicks</th>
                    <th className="pb-2">CTR</th>
                    <th className="pb-2">Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {campaignPerformance.map((campaign, index) => (
                    <tr key={index}>
                      <td className="py-2">{campaign.name}</td>
                      <td className="py-2">
                        {campaign.impressions.toLocaleString()}
                      </td>
                      <td className="py-2">
                        {campaign.clicks.toLocaleString()}
                      </td>
                      <td className="py-2">{campaign.ctr.toFixed(2)}%</td>
                      <td className="py-2">
                        ${campaign.spend.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ads" className="space-y-4">
          <Card className="border-black/10 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="font-heading text-lg font-medium">
                Ad Performance
              </CardTitle>
              <CardDescription>Detailed metrics for all ads</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-muted-foreground text-sm">
                    <th className="pb-2">Ad</th>
                    <th className="pb-2">Impressions</th>
                    <th className="pb-2">Clicks</th>
                    <th className="pb-2">CTR</th>
                    <th className="pb-2">Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {adPerformance.map((ad, index) => (
                    <tr key={index}>
                      <td className="py-2">{ad.title}</td>
                      <td className="py-2">
                        {ad.impressions.toLocaleString()}
                      </td>
                      <td className="py-2">{ad.clicks.toLocaleString()}</td>
                      <td className="py-2">{ad.ctr.toFixed(2)}%</td>
                      <td className="py-2">${ad.spend.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
}

function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
}: MetricCardProps) {
  return (
    <Card className="border-black/10 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-none bg-muted/20 p-1.5">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center mt-1">
          {trend === "up" ? (
            <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
          ) : trend === "down" ? (
            <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
          ) : null}
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
