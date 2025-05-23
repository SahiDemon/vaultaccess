import { useCallback, useEffect, useState } from 'react';
import supabase from '@/lib/supabase';

interface EditData {
  RFID: boolean;
  FINGERPRINT: boolean;
}

export function useAccessControl() {
  const [editData, setEditData] = useState<EditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch current access control settings
  const fetchAccessControl = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('edit_data')
        .select('*')
        .single();

      if (error) throw error;
      setEditData(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching access control data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update RFID status
  const updateRFIDStatus = async (enabled: boolean) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('edit_data')
        .update({ RFID: enabled })
        .eq('FINGERPRINT', editData?.FINGERPRINT ?? false);

      if (error) throw error;
      
      // Log the action to alerts table
      await supabase.from('alerts').insert({
        type: 'ACCESS_CONTROL',
        message: `RFID access ${enabled ? 'enabled' : 'disabled'}`,
        severity: 'info'
      });
      
      // Refresh data
      await fetchAccessControl();
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating RFID status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update Fingerprint status
  const updateFingerprintStatus = async (enabled: boolean) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('edit_data')
        .update({ FINGERPRINT: enabled })
        .eq('RFID', editData?.RFID ?? false);

      if (error) throw error;
      
      // Log the action to alerts table
      await supabase.from('alerts').insert({
        type: 'ACCESS_CONTROL',
        message: `Fingerprint access ${enabled ? 'enabled' : 'disabled'}`,
        severity: 'info'
      });
      
      // Refresh data
      await fetchAccessControl();
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating fingerprint status:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchAccessControl();
  }, [fetchAccessControl]);

  return { 
    editData, 
    loading, 
    error, 
    updateRFIDStatus, 
    updateFingerprintStatus,
    refreshData: fetchAccessControl
  };
} 