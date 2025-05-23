import { useCallback, useEffect, useState } from 'react';
import supabase, { supabaseAnonKey } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';

interface Face {
  id: string;
  image_url: string | null;
  matched: boolean | null;
}

export function useFaceRecognition() {
  const [faces, setFaces] = useState<Face[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all faces
  const fetchFaces = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faces')
        .select('*')
        .order('id');

      if (error) throw error;
      setFaces(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching faces:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Upload a reference face image
  const uploadReferenceFace = async (imageFile: File) => {
    try {
      setLoading(true);
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('img')
        .upload('ref.jpg', imageFile, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;
      
      // Create public URL
      const { data: publicUrlData } = supabase.storage
        .from('img')
        .getPublicUrl('ref.jpg');
      
      // Add alert for reference face update
      await supabase.from('alerts').insert({
        type: 'FACE_RECOGNITION',
        message: 'Reference face updated',
        severity: 'info'
      });
      
      return publicUrlData.publicUrl;
    } catch (err: any) {
      setError(err.message);
      console.error('Error uploading reference face:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Upload a new face for comparison
  const uploadFaceForComparison = async (imageFile: File) => {
    try {
      setLoading(true);
      const faceId = uuidv4();
      
      // Upload to storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('img')
        .upload(`faces/${faceId}.jpg`, imageFile, {
          cacheControl: '3600',
        });

      if (uploadError) throw uploadError;
      
      // Create public URL
      const { data: publicUrlData } = supabase.storage
        .from('img')
        .getPublicUrl(`faces/${faceId}.jpg`);
      
      const publicUrl = publicUrlData.publicUrl;
      
      // Insert the face into the database
      const { error: insertError } = await supabase
        .from('faces')
        .insert({
          id: faceId,
          image_url: publicUrl,
          matched: null,
        });
        
      if (insertError) throw insertError;
      
      // Call edge function to compare faces
      const response = await fetch('https://qeyedottjtnszzeuvbjz.supabase.co/functions/v1/face-compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          image_url: publicUrl,
          image_id: faceId,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to compare faces');
      }
      
      // Add alert for face comparison
      await supabase.from('alerts').insert({
        type: 'FACE_RECOGNITION',
        message: 'New face compared with reference',
        severity: 'info'
      });
      
      // Refresh faces list
      await fetchFaces();
      
      return faceId;
    } catch (err: any) {
      setError(err.message);
      console.error('Error uploading face for comparison:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchFaces();
  }, [fetchFaces]);

  return { 
    faces, 
    loading, 
    error, 
    uploadReferenceFace, 
    uploadFaceForComparison,
    refreshFaces: fetchFaces
  };
} 