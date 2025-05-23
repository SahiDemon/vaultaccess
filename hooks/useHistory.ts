'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface HistoryEntry {
  id: number;
  using: string;
  output?: string;
  date?: string;
}

export function useHistory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const getHistory = async (): Promise<HistoryEntry[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('_history')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const getHistoryById = async (id: number): Promise<HistoryEntry | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('_history')
        .select('*')
        .eq('id', id)
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
  
  const addHistoryEntry = async (entry: Omit<HistoryEntry, 'id'>): Promise<HistoryEntry | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('_history')
        .insert([{ ...entry, date: new Date().toISOString() }])
        .select()
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
  
  const deleteHistoryEntry = async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('_history')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    getHistory,
    getHistoryById,
    addHistoryEntry,
    deleteHistoryEntry
  };
} 