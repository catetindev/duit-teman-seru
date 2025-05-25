
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useOnboarding = () => {
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading) {
      checkOnboardingStatus();
    }
  }, [user, authLoading]);

  const checkOnboardingStatus = async () => {
    if (!user) {
      setNeedsOnboarding(false);
      setLoading(false);
      return;
    }

    try {
      console.log('useOnboarding: Checking status for user:', user.id);
      
      // First check localStorage as a fallback
      const localStorageFlag = localStorage.getItem('onboardingCompleted');
      if (localStorageFlag === 'true') {
        console.log('useOnboarding: Found completed flag in localStorage');
        setNeedsOnboarding(false);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking onboarding status:', error);
        // Fallback to localStorage if Supabase fails
        const shouldShowOnboarding = localStorageFlag !== 'true';
        setNeedsOnboarding(shouldShowOnboarding);
        setLoading(false);
        return;
      }

      // If no profile exists or onboarding not completed, show onboarding
      const shouldShowOnboarding = !data || !data.onboarding_completed;
      console.log('useOnboarding: Should show onboarding:', shouldShowOnboarding);
      
      setNeedsOnboarding(shouldShowOnboarding);
    } catch (error) {
      console.error('Error in checkOnboardingStatus:', error);
      // Fallback to localStorage
      const localStorageFlag = localStorage.getItem('onboardingCompleted');
      setNeedsOnboarding(localStorageFlag !== 'true');
    } finally {
      setLoading(false);
    }
  };

  const markOnboardingComplete = async () => {
    if (!user) {
      console.error('No user found when trying to mark onboarding complete');
      return false;
    }

    try {
      console.log('useOnboarding: Marking onboarding complete for user:', user.id);
      
      // Save to localStorage immediately as backup
      localStorage.setItem('onboardingCompleted', 'true');
      console.log('useOnboarding: Saved to localStorage successfully');
      
      // Try to save to Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (error) {
        console.error('Failed to save onboarding progress to Supabase:', error);
        // Even if Supabase fails, we have localStorage backup
        setNeedsOnboarding(false);
        return true; // Return true because localStorage saved successfully
      }

      console.log('useOnboarding: Successfully saved to Supabase');
      setNeedsOnboarding(false);
      return true;
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
      // Still try to save to localStorage
      try {
        localStorage.setItem('onboardingCompleted', 'true');
        setNeedsOnboarding(false);
        return true;
      } catch (localError) {
        console.error('Failed to save to localStorage as well:', localError);
        return false;
      }
    }
  };

  const restartOnboarding = async () => {
    if (!user) {
      console.error('No user found when trying to restart onboarding');
      return false;
    }

    try {
      console.log('useOnboarding: Restarting onboarding for user:', user.id);
      
      // Clear localStorage flag
      localStorage.removeItem('onboardingCompleted');
      
      // Try to update Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: false })
        .eq('id', user.id);

      if (error) {
        console.error('Error restarting onboarding in Supabase:', error);
        // Continue anyway since localStorage is cleared
      }

      setNeedsOnboarding(true);
      return true;
    } catch (error) {
      console.error('Error restarting onboarding:', error);
      // Clear localStorage anyway
      localStorage.removeItem('onboardingCompleted');
      setNeedsOnboarding(true);
      return true;
    }
  };

  return {
    needsOnboarding,
    loading,
    markOnboardingComplete,
    restartOnboarding,
    refreshStatus: checkOnboardingStatus,
  };
};
