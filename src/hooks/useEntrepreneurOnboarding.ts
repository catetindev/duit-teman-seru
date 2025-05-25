
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useEntrepreneurOnboarding = () => {
  const [needsEntrepreneurOnboarding, setNeedsEntrepreneurOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      checkEntrepreneurOnboardingStatus();
    }
  }, [user, authLoading]);

  const checkEntrepreneurOnboardingStatus = async () => {
    if (!user) {
      setNeedsEntrepreneurOnboarding(false);
      setLoading(false);
      return;
    }

    try {
      console.log('useEntrepreneurOnboarding: Checking status for user:', user.id);
      
      // First check localStorage as a fallback
      const localStorageFlag = localStorage.getItem('entrepreneurOnboardingCompleted');
      if (localStorageFlag === 'true') {
        console.log('useEntrepreneurOnboarding: Found completed flag in localStorage');
        setNeedsEntrepreneurOnboarding(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('entrepreneur_onboarding_completed')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking entrepreneur onboarding status:', error);
        // Fallback to localStorage if Supabase fails
        const shouldShowOnboarding = localStorageFlag !== 'true';
        setNeedsEntrepreneurOnboarding(shouldShowOnboarding);
        setLoading(false);
        return;
      }

      // If no profile exists or entrepreneur onboarding not completed, show onboarding
      const shouldShowOnboarding = !data || !data.entrepreneur_onboarding_completed;
      console.log('useEntrepreneurOnboarding: Should show onboarding:', shouldShowOnboarding);
      
      setNeedsEntrepreneurOnboarding(shouldShowOnboarding);
    } catch (error) {
      console.error('Error in checkEntrepreneurOnboardingStatus:', error);
      // Fallback to localStorage
      const localStorageFlag = localStorage.getItem('entrepreneurOnboardingCompleted');
      setNeedsEntrepreneurOnboarding(localStorageFlag !== 'true');
    } finally {
      setLoading(false);
    }
  };

  const markEntrepreneurOnboardingComplete = async () => {
    if (!user) {
      console.error('No user found when trying to mark entrepreneur onboarding complete');
      return false;
    }

    try {
      console.log('useEntrepreneurOnboarding: Marking onboarding complete for user:', user.id);
      
      // Save to localStorage immediately as backup
      localStorage.setItem('entrepreneurOnboardingCompleted', 'true');
      console.log('useEntrepreneurOnboarding: Saved to localStorage successfully');
      
      // Try to save to Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ entrepreneur_onboarding_completed: true })
        .eq('id', user.id);

      if (error) {
        console.error('Failed to save entrepreneur onboarding progress to Supabase:', error);
        // Even if Supabase fails, we have localStorage backup
        setNeedsEntrepreneurOnboarding(false);
        return true; // Return true because localStorage saved successfully
      }

      console.log('useEntrepreneurOnboarding: Successfully saved to Supabase');
      setNeedsEntrepreneurOnboarding(false);
      return true;
    } catch (error) {
      console.error('Error marking entrepreneur onboarding complete:', error);
      // Still try to save to localStorage
      try {
        localStorage.setItem('entrepreneurOnboardingCompleted', 'true');
        setNeedsEntrepreneurOnboarding(false);
        return true;
      } catch (localError) {
        console.error('Failed to save to localStorage as well:', localError);
        return false;
      }
    }
  };

  const restartEntrepreneurOnboarding = async () => {
    if (!user) {
      console.error('No user found when trying to restart entrepreneur onboarding');
      return false;
    }

    try {
      console.log('useEntrepreneurOnboarding: Restarting onboarding for user:', user.id);
      
      // Clear localStorage flag
      localStorage.removeItem('entrepreneurOnboardingCompleted');
      
      // Try to update Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ entrepreneur_onboarding_completed: false })
        .eq('id', user.id);

      if (error) {
        console.error('Error restarting entrepreneur onboarding in Supabase:', error);
        // Continue anyway since localStorage is cleared
      }

      setNeedsEntrepreneurOnboarding(true);
      return true;
    } catch (error) {
      console.error('Error restarting entrepreneur onboarding:', error);
      // Clear localStorage anyway
      localStorage.removeItem('entrepreneurOnboardingCompleted');
      setNeedsEntrepreneurOnboarding(true);
      return true;
    }
  };

  return {
    needsEntrepreneurOnboarding,
    loading,
    markEntrepreneurOnboardingComplete,
    restartEntrepreneurOnboarding,
    refreshStatus: checkEntrepreneurOnboardingStatus,
  };
};
