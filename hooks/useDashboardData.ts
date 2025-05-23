import { useCallback, useEffect, useState } from 'react';
import supabase from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

export interface AccessLog {
  id: number;
  using: string;
  output: string | null;
  date: string | null;
  formattedTime?: string;
}

export interface Alert {
  id: number;
  type: string;
  message: string;
  date: string | null;
  severity: 'info' | 'warning' | 'error';
  formattedTime?: string;
}

export interface DashboardMetrics {
  totalAttempts: number;
  successfulAttempts: number;
  failedAttempts: number;
  totalUsersCount: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  recentActivity: AccessLog[];
  recentAlerts: Alert[];
  chartData: {
    date: string;
    count: number;
    type: string;
  }[];
  accessMethodsData: {
    name: string;
    value: number;
  }[];
}

export function useDashboardData() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get access logs (lock/unlock events)
      const { data: logs, error: logsError } = await supabase
        .from('_history')
        .select('*')
        .order('date', { ascending: false });

      if (logsError) throw logsError;
      
      // Get system alerts
      const { data: alertsData, error: alertsError } = await supabase
        .from('alerts')
        .select('*')
        .order('date', { ascending: false });
        
      if (alertsError) throw alertsError;

      // Calculate metrics
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentLogs = logs?.filter(log => {
        if (!log.date) return false;
        return new Date(log.date) > thirtyDaysAgo;
      }) || [];
      
      // Get unique users count (approximation based on using field)
      const uniqueUsers = new Set();
      logs?.forEach(log => {
        if (log.using && log.using !== 'System') {
          uniqueUsers.add(log.using);
        }
      });
      
      // Determine success/failure based on 'output' field and TRUE/FALSE values
      const successfulLogs = recentLogs.filter(log => 
        log.output === 'TRUE' || 
        (log.output && log.output.toLowerCase().includes('success'))
      );
      
      // Failed attempts count
      const failedLogs = recentLogs.filter(log => 
        log.output === 'FALSE' || 
        (log.output && log.output.toLowerCase().includes('fail'))
      );
      
      // Process data for chart visualization
      const lastWeekData: { [key: string]: { [key: string]: number } } = {};
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();
      
      // Initialize data structure
      last7Days.forEach(day => {
        lastWeekData[day] = {
          'ADMIN': 0,
          'CLIENT': 0
        };
      });
      
      // Populate data
      recentLogs.forEach(log => {
        if (!log.date) return;
        
        const day = new Date(log.date).toISOString().split('T')[0];
        if (last7Days.includes(day)) {
          const category = log.using === 'ADMIN' ? 'ADMIN' : 'CLIENT';
          lastWeekData[day][category] = (lastWeekData[day][category] || 0) + 1;
        }
      });
      
      // Format chart data
      const chartData = Object.entries(lastWeekData).flatMap(([date, counts]) => 
        Object.entries(counts).map(([type, count]) => ({
          date,
          type,
          count
        }))
      );
      
      // Calculate access methods distribution
      const admin = logs?.filter(log => log.using === 'ADMIN').length || 0;
      const client = logs?.filter(log => log.using === 'CLIENT').length || 0;
      
      const accessMethodsData = [
        { name: 'Admin (RFID)', value: admin },
        { name: 'Client (Face+Fingerprint)', value: client }
      ];
      
      // Process recent activity for display
      const recentActivity = (logs || []).slice(0, 5).map(log => ({
        ...log,
        formattedTime: log.date 
          ? formatDistanceToNow(new Date(log.date), { addSuffix: true }) 
          : 'Unknown time'
      }));
      
      // Process recent alerts
      const recentAlerts = (alertsData || []).slice(0, 5).map(alert => ({
        ...alert,
        formattedTime: alert.date 
          ? formatDistanceToNow(new Date(alert.date), { addSuffix: true }) 
          : 'Unknown time'
      }));
      
      setDashboardData({
        metrics: {
          totalAttempts: recentLogs.length,
          successfulAttempts: successfulLogs.length,
          failedAttempts: failedLogs.length,
          totalUsersCount: uniqueUsers.size
        },
        recentActivity,
        recentAlerts,
        chartData,
        accessMethodsData
      });
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up real-time subscriptions
  useEffect(() => {
    fetchDashboardData();

    // Subscribe to changes in the alerts table
    const alertsSubscription = supabase
      .channel('dashboard-alerts-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'alerts' 
        }, 
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    // Subscribe to changes in the access logs table
    const logsSubscription = supabase
      .channel('dashboard-logs-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: '_history' 
        }, 
        () => {
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      alertsSubscription.unsubscribe();
      logsSubscription.unsubscribe();
    };
  }, [fetchDashboardData]);

  return { 
    dashboardData, 
    loading, 
    error,
    refreshData: fetchDashboardData
  };
} 