
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<'free' | 'premium' | 'admin' | null>(null);

  // Helper function to update user state based on profile
  const updateUserState = useCallback((profileData: any) => {
    if (!profileData) return;
    
    setProfile(profileData);
    setUserRole(profileData.role || 'free');
    setIsAdmin(profileData.role === 'admin');
    setIsPremium(profileData.role === 'premium' || profileData.role === 'admin');
  }, []);

  // Fetch user profile from Supabase
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return null;
      }

      console.log('User profile data:', profile);
      updateUserState(profile);
      
      // Set up real-time subscription to profile changes
      const channel = supabase
        .channel(`profile-${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${userId}`,
          },
          (payload) => {
            console.log('Profile updated in real-time:', payload);
            const updatedProfile = payload.new;
            
            // Check if role has changed
            if (updatedProfile.role !== profile?.role) {
              // Show toast notification with role-specific message
              if (updatedProfile.role === 'premium') {
                toast.success('Congratulations! Your account has been upgraded to Premium!', {
                  duration: 6000,
                  icon: '🎉'
                });
              } else if (updatedProfile.role === 'admin') {
                toast.success('You now have Admin privileges!', {
                  duration: 6000,
                  icon: '✨'
                });
              } else if (updatedProfile.role === 'free' && profile?.role !== 'free') {
                toast.info('Your account status has been updated', {
                  duration: 5000
                });
              }
            }
            
            // Update state with new profile data
            updateUserState(updatedProfile);
          }
        )
        .subscribe();

      return { profile, channel };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, [updateUserState]);

  return {
    profile,
    isPremium,
    isAdmin,
    userRole,
    updateUserState,
    fetchUserProfile
  };
};
