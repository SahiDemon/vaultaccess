'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface EditData {
  RFID: boolean;
  FINGERPRINT: boolean;
}

export function useEditData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const getEditData = async (): Promise<EditData | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('edit_data')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const updateEditData = async (updates: EditData): Promise<EditData | null> => {
    try {
      setLoading(true);
      setError(null);
      
      // First check if there is any data
      const { data: existingData } = await supabase
        .from('edit_data')
        .select('*')
        .limit(1);
      
      let result;
      
      if (existingData && existingData.length > 0) {
        // Update existing record
        const { data, error } = await supabase
          .from('edit_data')
          .update(updates)
          .eq('RFID', existingData[0].RFID)
          .eq('FINGERPRINT', existingData[0].FINGERPRINT)
          .select()
          .single();
        
        if (error) throw error;
        
        result = data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('edit_data')
          .insert([updates])
          .select()
          .single();
        
        if (error) throw error;
        
        result = data;
      }
      
      return result;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    getEditData,
    updateEditData
  };
} 