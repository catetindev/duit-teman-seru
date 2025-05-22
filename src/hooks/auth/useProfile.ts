
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useProfile = () => {
  const [profile, setProfile] = useState<any>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<'free' | 'premium' | 'admin' | null>(null);

  // Helper function to update user state based on profile
  const updateUserState = useCallback((profileData: any) => {
    if (!profileData) {
      setProfile(null);
      setUserRole(null);
      setIsAdmin(false);
      setIsPremium(false);
      return;
    }
    
    setProfile(profileData);
    setUserRole(profileData.role || 'free');
    setIsAdmin(profileData.role === 'admin');
    setIsPremium(profileData.role === 'premium' || profileData.role === 'admin');
  }, []);

  const clearProfileData = useCallback(() => {
    setProfile(null);
    setIsPremium(false);
    setIsAdmin(false);
    setUserRole(null);
  }, []);

  // Fetch user profile from Supabase
  const fetchUserProfile = useCallback(async (userIdToFetch: string) => {
    if (!userIdToFetch) {
      console.warn("fetchUserProfile called without userId.");
      clearProfileData();
      return null;
    }
    try {
      console.log('Fetching user profile for:', userIdToFetch);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userIdToFetch)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        // If profile not found (e.g., new user before profile auto-creation), don't throw, just clear.
        if (profileError.code === 'PGRST116') { // "PGRST116" is "Not Found"
            console.warn('Profile not found for user:', userIdToFetch);
            clearProfileData();
            return null;
        }
        throw profileError; // For other errors, re-throw
      }

      console.log('User profile data:', profileData);
      updateUserState(profileData);
      
      // Set up real-time subscription to profile changes
      const channel = supabase
        .channel(`profile-${userIdToFetch}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${userIdToFetch}`,
          },
          (payload) => {
            console.log('Profile updated in real-time:', payload);
            const updatedProfile = payload.new;
            
            if (updatedProfile.role !== profile?.role) {
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
            updateUserState(updatedProfile);
          }
        )
        .subscribe();

      return { profile: profileData, channel };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      clearProfileData(); // Clear profile on error
      return null;
    }
  }, [updateUserState, clearProfileData, profile?.role]);

  // Update user profile
  const updateUserProfile = useCallback(async (userId: string, updates: any) => {
    try {
      // Use service role for operations that might be blocked by RLS
      const { data: profileData, error: profileError } = await supabase
        .rpc('update_user_profile', {
          user_id: userId,
          profile_updates: updates
        });

      if (profileError) {
        console.error('Error updating user profile:', profileError);
        toast.error('Failed to update profile: ' + profileError.message);
        return null;
      }

      toast.success('Profile updated successfully!');
      return profileData;
    } catch (error: any) {
      console.error('Error in updateUserProfile:', error);
      toast.error('An error occurred while updating your profile');
      return null;
    }
  }, []);

  return {
    profile,
    isPremium,
    isAdmin,
    userRole,
    updateUserState,
    fetchUserProfile,
    updateUserProfile, // Export the new update function
    clearProfileData
  };
};
