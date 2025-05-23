'use client';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle, Key, UserCheck, Users, RefreshCw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardData, type AccessLog, type Alert } from "@/hooks/useDashboardData";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import SystemAlerts from './system-alerts/component';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

export default function DashboardPage() {
  const { dashboardData, loading, error, refreshData } = useDashboardData();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setTimeout(() => setRefreshing(false), 500);
  };

  if (loading && !dashboardData) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin h-8 w-8 border-t-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Security system overview and metrics.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Access Attempts" 
          value={dashboardData?.metrics.totalAttempts.toString() || "0"} 
          description="Last 30 days"
          icon={<Key className="h-5 w-5 text-muted-foreground" />}
        />
        <MetricCard 
          title="Successful Logins" 
          value={dashboardData?.metrics.successfulAttempts.toString() || "0"}
          description="Last 30 days" 
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
        />
        <MetricCard 
          title="Failed Attempts" 
          value={dashboardData?.metrics.failedAttempts.toString() || "0"}
          description="Last 30 days" 
          icon={<AlertCircle className="h-5 w-5 text-red-500" />}
        />
        <MetricCard 
          title="Registered Users" 
          value={dashboardData?.metrics.totalUsersCount.toString() || "0"}
          description="Total users" 
          icon={<Users className="h-5 w-5 text-muted-foreground" />}
        />
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="recent-activity">Access Logs</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Access Summary</CardTitle>
                <CardDescription>
                  System access statistics for the last 7 days.
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dashboardData?.chartData || []}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Access Count" fill="#2563eb" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Method Distribution</CardTitle>
                <CardDescription>
                  Breakdown of access methods used.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px] flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dashboardData?.accessMethodsData || []}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dashboardData?.accessMethodsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent-activity">
          <Card>
            <CardHeader>
              <CardTitle>Latest Access Events</CardTitle>
              <CardDescription>
                Recent lock/unlock events from the security system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dashboardData && dashboardData.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((log) => (
                    <ActivityItem
                      key={log.id}
                      method={log.using}
                      details={log.output === 'TRUE' ? 'Access Granted' : log.output === 'FALSE' ? 'Access Denied' : log.output || 'No details'}
                      time={log.formattedTime || 'Unknown time'}
                      status={
                        log.output === 'TRUE' ? 'success' : 
                        log.output === 'FALSE' ? 'failed' : 'info'
                      }
                    />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <p>No recent activity found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts">
          <SystemAlerts />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricCard({ title, value, description, icon }: { 
  title: string; 
  value: string; 
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ method, details, time, status }: { 
  method: string; 
  details: string;
  time: string;
  status: "success" | "failed" | "info"; 
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-800 pb-3">
      <div className="flex items-center gap-3">
        <div className={`rounded-full w-2 h-2 ${
          status === 'success' ? 'bg-green-500' : 
          status === 'failed' ? 'bg-red-500' : 
          'bg-blue-500'
        }`} />
        <div>
          <p className="font-medium">{method}</p>
          <p className="text-sm text-muted-foreground">{details}</p>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">{time}</div>
    </div>
  );
}

function AlertItem({ type, message, time, severity }: { 
  type: string; 
  message: string;
  time: string;
  severity: "info" | "warning" | "error"; 
}) {
  const severityColors = {
    info: "bg-blue-500",
    warning: "bg-yellow-500",
    error: "bg-red-500"
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-800 pb-3">
      <div className="flex items-center gap-3">
        <div className={`rounded-full w-2 h-2 ${severityColors[severity]}`} />
        <div>
          <p className="font-medium">{type}</p>
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">{time}</div>
    </div>
  );
} 