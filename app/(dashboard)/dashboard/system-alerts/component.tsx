'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAlerts } from '@/hooks/useAlerts';
import { Loader2, RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SystemAlerts() {
  const { alerts, loading, error, refreshAlerts } = useAlerts();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshAlerts();
    setTimeout(() => setRefreshing(false), 500);
  };

  if (loading && !refreshing) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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

  // Count alerts by type
  const countByType = alerts.reduce((acc, alert) => {
    acc[alert.type] = (acc[alert.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>
            Recent system events and configuration changes.
          </CardDescription>
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
      </CardHeader>
      
      {alerts.length > 0 && (
        <div className="px-6 pb-0 -mt-2 flex gap-2 flex-wrap">
          {Object.entries(countByType).map(([type, count]) => (
            <Badge 
              key={type} 
              variant="outline" 
              className="bg-gray-900 hover:bg-gray-800"
            >
              {type}: {count}
            </Badge>
          ))}
        </div>
      )}
      
      <CardContent>
        {alerts.length > 0 ? (
          <div className="overflow-y-auto max-h-[500px] pr-2 space-y-4 mt-4 custom-scrollbar">
            {alerts.map((alert) => (
              <AlertItem
                key={alert.id}
                type={alert.type}
                message={alert.message}
                time={alert.formattedTime || 'Unknown time'}
                severity={alert.severity}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No alerts found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AlertItem({ type, message, time, severity }: { 
  type: string; 
  message: string;
  time: string;
  severity: "info" | "warning" | "error"; 
}) {
  // Determine if this is an enable/disable message
  const isDisabled = message.toLowerCase().includes('disabled');
  const isEnabled = message.toLowerCase().includes('enabled');
  
  // Set the status color
  let statusColor;
  let statusBgColor;
  let icon;
  
  if (isDisabled) {
    statusColor = "text-red-500";
    statusBgColor = "bg-red-900/20";
    icon = <AlertCircle className="h-4 w-4 text-red-500" />;
  } else if (isEnabled) {
    statusColor = "text-green-500";
    statusBgColor = "bg-green-900/20";
    icon = <CheckCircle className="h-4 w-4 text-green-500" />;
  } else {
    if (severity === 'warning') {
      statusColor = "text-yellow-500";
      statusBgColor = "bg-yellow-900/20";
      icon = <AlertCircle className="h-4 w-4 text-yellow-500" />;
    } else if (severity === 'error') {
      statusColor = "text-red-500";
      statusBgColor = "bg-red-900/20";
      icon = <AlertCircle className="h-4 w-4 text-red-500" />;
    } else {
      statusColor = "text-blue-500";
      statusBgColor = "bg-blue-900/20";
      icon = <Info className="h-4 w-4 text-blue-500" />;
    }
  }

  // Type-specific badge variant
  let typeBadgeVariant = "default";
  if (type === "ACCESS_CONTROL") typeBadgeVariant = "outline";
  if (type === "SYSTEM") typeBadgeVariant = "secondary";
  if (type === "SECURITY") typeBadgeVariant = "destructive";
  if (type === "FACE_RECOGNITION") typeBadgeVariant = "default";

  return (
    <div className={`p-3 rounded-md border border-gray-800 ${statusBgColor}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          {icon}
          <Badge variant={typeBadgeVariant as any}>{type}</Badge>
        </div>
        <div className="text-sm text-muted-foreground whitespace-nowrap ml-4">{time}</div>
      </div>
      <p className={`text-sm pl-6 ${statusColor}`}>{message}</p>
    </div>
  );
} 