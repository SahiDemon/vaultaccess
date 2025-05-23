'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Face {
  id: string;
  image_url?: string;
  matched?: boolean;
}

export function useFaces() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const getFaces = async (): Promise<Face[]> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('faces')
        .select('*');
      
      if (error) throw error;
      
      return data || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const getFaceById = async (id: string): Promise<Face | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('faces')
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
  
  const addFace = async (face: Omit<Face, 'id'>): Promise<Face | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const id = crypto.randomUUID();
      
      const { data, error } = await supabase
        .from('faces')
        .insert([{ id, ...face }])
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
  
  const updateFace = async (id: string, updates: Partial<Face>): Promise<Face | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('faces')
        .update(updates)
        .eq('id', id)
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
  
  const deleteFace = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase
        .from('faces')
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
    getFaces,
    getFaceById,
    addFace,
    updateFace,
    deleteFace
  };
} 