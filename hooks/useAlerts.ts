import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';

export interface Alert {
  id: number;
  type: string;
  message: string;
  date: string | null;
  severity: 'info' | 'warning' | 'error';
  formattedTime?: string;
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch alerts
  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      const processedAlerts = (data || []).map(alert => ({
        ...alert,
        formattedTime: alert.date 
          ? formatDistanceToNow(new Date(alert.date), { addSuffix: true }) 
          : 'Unknown time'
      }));
      
      setAlerts(processedAlerts);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new alert
  const addAlert = async (type: string, message: string, severity: 'info' | 'warning' | 'error' = 'info') => {
    try {
      const { error } = await supabase
        .from('alerts')
        .insert({
          type,
          message,
          severity,
          date: new Date().toISOString(),
        });

      if (error) throw error;
      fetchAlerts();
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding alert:', err);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchAlerts();

    const subscription = supabase
      .channel('alerts-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'alerts' 
        }, 
        () => {
          fetchAlerts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchAlerts]);

  return { alerts, loading, error, addAlert, refreshAlerts: fetchAlerts };
} 