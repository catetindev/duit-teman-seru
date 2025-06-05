
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  role: 'free' | 'premium' | 'admin';
  created_at: string;
  onboarding_completed: boolean;
  entrepreneur_onboarding_completed: boolean;
}

export const useSecureProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async (userId: string) => {
    if (!userId) return null;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Profile not found for user:', userId);
          return null;
        }
        throw error;
      }

      setProfile(data);
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load user profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (userId: string, updates: Partial<ProfileData>) => {
    if (!userId) {
      throw new Error('User ID is required');
    }

    // Validate updates to prevent unauthorized modifications
    const allowedFields = ['full_name', 'onboarding_completed', 'entrepreneur_onboarding_completed'];
    const sanitizedUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key as keyof ProfileData];
        return obj;
      }, {} as any);

    if (Object.keys(sanitizedUpdates).length === 0) {
      throw new Error('No valid fields to update');
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(sanitizedUpdates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast.success('Profile updated successfully');
      return data;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
  }, []);

  return {
    profile,
    loading,
    fetchProfile,
    updateProfile,
    clearProfile
  };
};
