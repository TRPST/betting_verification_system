"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowUpRight,
  Users,
  Clock,
  AlertTriangle,
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Laptop,
  Tablet,
  RefreshCw,
  Eye,
  Flag,
  Ban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Chart colors
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// Format date for charts
const formatDate = (date: string) => {
  return format(new Date(date), "MMM dd");
};

// Get device icon based on type
const getDeviceIcon = (device: string) => {
  if (device.includes("Mobile")) return <Smartphone className="h-4 w-4" />;
  if (device.includes("Desktop")) return <Laptop className="h-4 w-4" />;
  if (device.includes("Tablet")) return <Tablet className="h-4 w-4" />;
  return <Smartphone className="h-4 w-4" />;
};

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("week");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Introduce a small delay to allow the UI to render first
      await new Promise((resolve) => setTimeout(resolve, 10));

      try {
        const response = await fetch(`/api/admin-data?timeRange=${timeRange}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const toggleActivityExpand = (id: string) => {
    setExpandedActivity(expandedActivity === id ? null : id);
  };

  const handleAction = (action: string, id: string) => {
    toast.success(`${action} action taken for verification ${id}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage verification activities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTimeRange(timeRange);
                toast.success("Dashboard refreshed");
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-md">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center py-24"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading dashboard data...
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Verified
                      </CardTitle>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {data?.stats.totalVerified}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {data?.stats.growthRate > 0 ? "+" : ""}
                        {data?.stats.growthRate}% from previous period
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Pending Review
                      </CardTitle>
                      <Clock className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {data?.stats.pendingVerifications}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Avg. wait time: {data?.stats.averageTime} minutes
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Flagged for Review
                      </CardTitle>
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {data?.stats.flaggedForReview}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {data?.stats.rejectionRate}% rejection rate
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Fraud Alerts
                      </CardTitle>
                      <ShieldAlert className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {data?.stats.fraudAlerts}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {(
                          (data?.stats.fraudAlerts /
                            data?.stats.totalProcessed) *
                          100
                        ).toFixed(1)}
                        % of total
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Verification Trend
                      </h2>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={data?.trendData}>
                            <defs>
                              <linearGradient
                                id="colorVerified"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="hsl(var(--chart-1))"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="hsl(var(--chart-1))"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                              <linearGradient
                                id="colorPending"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="hsl(var(--chart-2))"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="hsl(var(--chart-2))"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              className="stroke-muted"
                            />
                            <XAxis
                              dataKey="date"
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={formatDate}
                            />
                            <YAxis
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                              }}
                              formatter={(value: any) => [
                                value,
                                "Verifications",
                              ]}
                              labelFormatter={(label) => formatDate(label)}
                            />
                            <Area
                              type="monotone"
                              dataKey="verified"
                              name="Verified"
                              stroke="hsl(var(--chart-1))"
                              fillOpacity={1}
                              fill="url(#colorVerified)"
                            />
                            <Area
                              type="monotone"
                              dataKey="pending"
                              name="Pending"
                              stroke="hsl(var(--chart-2))"
                              fillOpacity={1}
                              fill="url(#colorPending)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Recent Activity
                      </h2>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                        {data?.recentActivity
                          .slice(0, 5)
                          .map((activity: any) => (
                            <div
                              key={activity.id}
                              className="border rounded-lg p-3 transition-all hover:bg-muted/50"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">
                                    {activity.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {activity.type} • {activity.location}
                                  </div>
                                </div>
                                <Badge
                                  variant={
                                    activity.status.includes("✅")
                                      ? "default"
                                      : activity.status.includes("⏳")
                                      ? "secondary"
                                      : activity.status.includes("⚠️")
                                      ? "outline"
                                      : "destructive"
                                  }
                                  className={
                                    activity.status.includes("✅")
                                      ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                      : activity.status.includes("⏳")
                                      ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                                      : activity.status.includes("⚠️")
                                      ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                                      : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                  }
                                >
                                  {activity.status}
                                </Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(activity.timestamp).toLocaleString()}
                              </div>
                            </div>
                          ))}
                      </div>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Status Distribution
                      </h2>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                {
                                  name: "Verified",
                                  value: data?.stats.totalVerified,
                                },
                                {
                                  name: "Pending",
                                  value: data?.stats.pendingVerifications,
                                },
                                {
                                  name: "Flagged",
                                  value: data?.stats.flaggedForReview,
                                },
                                {
                                  name: "Fraud",
                                  value: data?.stats.fraudAlerts,
                                },
                              ]}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              <Cell fill={COLORS[0]} />
                              <Cell fill={COLORS[1]} />
                              <Cell fill={COLORS[2]} />
                              <Cell fill={COLORS[3]} />
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Hourly Distribution
                      </h2>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data?.hourlyDistribution}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              className="stroke-muted"
                            />
                            <XAxis
                              dataKey="hour"
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                              }}
                              formatter={(value: any) => [
                                `${value} verifications`,
                                "Count",
                              ]}
                            />
                            <Bar
                              dataKey="count"
                              fill="hsl(var(--chart-1))"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Rejection Reasons
                      </h2>
                      <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={data?.rejectionStats}
                            layout="vertical"
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              className="stroke-muted"
                            />
                            <XAxis
                              type="number"
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              dataKey="reason"
                              type="category"
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                              width={150}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                              }}
                              formatter={(value: any) => [
                                `${value} cases`,
                                "Count",
                              ]}
                            />
                            <Bar
                              dataKey="count"
                              fill="hsl(var(--chart-4))"
                              radius={[0, 4, 4, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Recent Verifications
                    </h2>
                    <div className="space-y-4">
                      {data?.recentActivity
                        .slice(0, 10)
                        .map((activity: any) => (
                          <div
                            key={activity.id}
                            className="border rounded-lg p-4 transition-all hover:bg-muted/50"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">
                                  {activity.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {activity.type} • {activity.location}
                                </div>
                              </div>
                              <Badge
                                variant={
                                  activity.status.includes("✅")
                                    ? "default"
                                    : activity.status.includes("⏳")
                                    ? "secondary"
                                    : activity.status.includes("⚠️")
                                    ? "outline"
                                    : "destructive"
                                }
                                className={
                                  activity.status.includes("✅")
                                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                    : activity.status.includes("⏳")
                                    ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                                    : activity.status.includes("⚠️")
                                    ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                                    : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                }
                              >
                                {activity.status}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(activity.timestamp).toLocaleString()}
                            </div>

                            <div className="flex items-center mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs h-8 px-2"
                                onClick={() =>
                                  toggleActivityExpand(activity.id)
                                }
                              >
                                {expandedActivity === activity.id ? (
                                  <>
                                    <ChevronUp className="h-4 w-4 mr-1" />
                                    Hide Details
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="h-4 w-4 mr-1" />
                                    View Details
                                  </>
                                )}
                              </Button>

                              {(activity.status.includes("⏳") ||
                                activity.status.includes("⚠️")) && (
                                <div className="ml-auto space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-8"
                                    onClick={() =>
                                      handleAction("View", activity.id)
                                    }
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-8"
                                    onClick={() =>
                                      handleAction("Approve", activity.id)
                                    }
                                  >
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Approve
                                  </Button>
                                  {activity.status.includes("⚠️") && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-xs h-8"
                                      onClick={() =>
                                        handleAction("Flag", activity.id)
                                      }
                                    >
                                      <Flag className="h-3 w-3 mr-1" />
                                      Flag
                                    </Button>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-8"
                                    onClick={() =>
                                      handleAction("Reject", activity.id)
                                    }
                                  >
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              )}

                              {activity.status.includes("🚨") && (
                                <div className="ml-auto space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-8"
                                    onClick={() =>
                                      handleAction("View", activity.id)
                                    }
                                  >
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="text-xs h-8"
                                    onClick={() =>
                                      handleAction("Block", activity.id)
                                    }
                                  >
                                    <Ban className="h-3 w-3 mr-1" />
                                    Block
                                  </Button>
                                </div>
                              )}
                            </div>

                            {expandedActivity === activity.id && (
                              <div className="mt-4 pt-4 border-t text-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-muted-foreground">
                                      ID Number:
                                    </p>
                                    <p className="font-mono">
                                      {activity.idNumber}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Account Type:
                                    </p>
                                    <p>{activity.details.accountType}</p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Device:
                                    </p>
                                    <p className="flex items-center">
                                      {getDeviceIcon(
                                        activity.details.deviceType
                                      )}
                                      <span className="ml-1">
                                        {activity.details.deviceType} /{" "}
                                        {activity.details.browser}
                                      </span>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      IP Address:
                                    </p>
                                    <p className="font-mono">
                                      {activity.details.ipAddress}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-muted-foreground">
                                      Verification Time:
                                    </p>
                                    <p>
                                      {activity.details.verificationTime}{" "}
                                      minutes
                                    </p>
                                  </div>
                                  {activity.details.rejectionReason && (
                                    <div>
                                      <p className="text-muted-foreground">
                                        Rejection Reason:
                                      </p>
                                      <p className="text-red-500">
                                        {activity.details.rejectionReason}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Hourly Distribution
                      </h2>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data?.hourlyDistribution}>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              className="stroke-muted"
                            />
                            <XAxis
                              dataKey="hour"
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                              }}
                              formatter={(value: any) => [
                                `${value} verifications`,
                                "Count",
                              ]}
                            />
                            <Bar
                              dataKey="count"
                              fill="hsl(var(--chart-1))"
                              radius={[4, 4, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Rejection Reasons
                      </h2>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={data?.rejectionStats}
                            layout="vertical"
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              className="stroke-muted"
                            />
                            <XAxis
                              type="number"
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              dataKey="reason"
                              type="category"
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                              width={150}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                              }}
                              formatter={(value: any) => [
                                `${value} cases`,
                                "Count",
                              ]}
                            />
                            <Bar
                              dataKey="count"
                              fill="hsl(var(--chart-4))"
                              radius={[0, 4, 4, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Device Distribution
                      </h2>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={data?.deviceStats}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="total"
                              nameKey="device"
                              label={({ device, percent }) =>
                                `${device} ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {data?.deviceStats.map(
                                (entry: any, index: number) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                )
                              )}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                              }}
                            />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Verification Time Trends
                      </h2>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={data?.trendData}>
                            <defs>
                              <linearGradient
                                id="colorTotal"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="5%"
                                  stopColor="hsl(var(--chart-3))"
                                  stopOpacity={0.8}
                                />
                                <stop
                                  offset="95%"
                                  stopColor="hsl(var(--chart-3))"
                                  stopOpacity={0}
                                />
                              </linearGradient>
                            </defs>
                            <CartesianGrid
                              strokeDasharray="3 3"
                              className="stroke-muted"
                            />
                            <XAxis
                              dataKey="date"
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={formatDate}
                            />
                            <YAxis
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                              }}
                              formatter={(value: any) => [
                                value,
                                "Total Verifications",
                              ]}
                              labelFormatter={(label) => formatDate(label)}
                            />
                            <Area
                              type="monotone"
                              dataKey="total"
                              name="Total Verifications"
                              stroke="hsl(var(--chart-3))"
                              fillOpacity={1}
                              fill="url(#colorTotal)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </div>

                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Verification Performance
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold text-green-500 mb-2">
                          {data?.stats.verificationRate}%
                        </div>
                        <div className="text-sm text-muted-foreground text-center">
                          Approval Rate
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold text-blue-500 mb-2">
                          {data?.stats.averageTime}m
                        </div>
                        <div className="text-sm text-muted-foreground text-center">
                          Average Verification Time
                        </div>
                      </div>
                      <div className="bg-muted/30 p-4 rounded-lg flex flex-col items-center justify-center">
                        <div className="text-4xl font-bold text-purple-500 mb-2">
                          {data?.stats.dailyAverage}
                        </div>
                        <div className="text-sm text-muted-foreground text-center">
                          Daily Average Verifications
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="locations" className="space-y-6">
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      Verification by Location
                    </h2>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">
                              Verified
                            </TableHead>
                            <TableHead className="text-right">
                              Flagged
                            </TableHead>
                            <TableHead className="text-right">Fraud</TableHead>
                            <TableHead className="text-right">
                              Success Rate
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {data?.locationStats.map((location: any) => (
                            <TableRow key={location.location}>
                              <TableCell className="font-medium">
                                {location.location}
                              </TableCell>
                              <TableCell className="text-right">
                                {location.total}
                              </TableCell>
                              <TableCell className="text-right text-green-500">
                                {location.verified}
                              </TableCell>
                              <TableCell className="text-right text-yellow-500">
                                {location.flagged}
                              </TableCell>
                              <TableCell className="text-right text-red-500">
                                {location.fraud}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {location.verificationRate}%
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Top Locations by Volume
                      </h2>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={data?.locationStats.slice(0, 5)}
                            layout="vertical"
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              className="stroke-muted"
                            />
                            <XAxis
                              type="number"
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis
                              dataKey="location"
                              type="category"
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                              width={100}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                              }}
                            />
                            <Bar
                              dataKey="total"
                              name="Total Verifications"
                              fill="hsl(var(--chart-2))"
                              radius={[0, 4, 4, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    <Card className="p-6">
                      <h2 className="text-xl font-semibold mb-4">
                        Success Rate by Location
                      </h2>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={data?.locationStats
                              .slice(0, 5)
                              .sort(
                                (a: any, b: any) =>
                                  b.verificationRate - a.verificationRate
                              )}
                            layout="vertical"
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              className="stroke-muted"
                            />
                            <XAxis
                              type="number"
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                              domain={[0, 100]}
                            />
                            <YAxis
                              dataKey="location"
                              type="category"
                              tick={{ fontSize: 12 }}
                              stroke="currentColor"
                              tickLine={false}
                              axisLine={false}
                              width={100}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "hsl(var(--background))",
                                border: "1px solid hsl(var(--border))",
                              }}
                              formatter={(value: any) => [
                                `${value}%`,
                                "Success Rate",
                              ]}
                            />
                            <Bar
                              dataKey="verificationRate"
                              name="Success Rate"
                              fill="hsl(var(--chart-1))"
                              radius={[0, 4, 4, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}
