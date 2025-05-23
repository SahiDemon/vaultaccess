import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow, format } from 'date-fns';

export interface AccessLog {
  id: number;
  using: string;
  output: string | null;
  date: string | null;
  formattedTime?: string;
  formattedDate?: string;
  formattedStatus?: string;
  statusType?: 'success' | 'failed' | 'info';
}

export function useAccessLogs() {
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch access logs
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('_history')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      
      // Process the logs to add formatted time and status
      const processedLogs = (data || []).map(log => {
        // Determine the status based on the output
        let formattedStatus = log.output;
        let statusType: 'success' | 'failed' | 'info' = 'info';
        
        if (log.output === 'TRUE') {
          formattedStatus = 'Access Granted';
          statusType = 'success';
        } else if (log.output === 'FALSE') {
          formattedStatus = 'Access Denied';
          statusType = 'failed';
        }
        
        return {
          ...log,
          formattedTime: log.date 
            ? formatDistanceToNow(new Date(log.date), { addSuffix: true })
            : 'Unknown time',
          formattedDate: log.date 
            ? format(new Date(log.date), 'PPP p')
            : 'Unknown date',
          formattedStatus,
          statusType
        };
      });
      
      setLogs(processedLogs);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching access logs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new log entry
  const addLogEntry = async (using: string, output: string) => {
    try {
      const { error } = await supabase
        .from('_history')
        .insert({
          using,
          output,
          // date will be automatically set by the database trigger
        });

      if (error) throw error;
      fetchLogs();
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding log entry:', err);
    }
  };

  // Set up real-time subscription for _history table
  useEffect(() => {
    fetchLogs();

    // Set up subscription to the _history table
    const subscription = supabase
      .channel('access-logs-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: '_history' 
        }, 
        () => {
          fetchLogs();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchLogs]);

  return { logs, loading, error, addLogEntry, refreshLogs: fetchLogs };
} 