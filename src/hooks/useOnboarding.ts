
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
      
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking onboarding status:', error);
        setNeedsOnboarding(false);
        setLoading(false);
        return;
      }

      // If no profile exists or onboarding not completed, show onboarding
      const shouldShowOnboarding = !data || !data.onboarding_completed;
      console.log('useOnboarding: Should show onboarding:', shouldShowOnboarding);
      
      setNeedsOnboarding(shouldShowOnboarding);
    } catch (error) {
      console.error('Error in checkOnboardingStatus:', error);
      setNeedsOnboarding(false);
    } finally {
      setLoading(false);
    }
  };

  const markOnboardingComplete = async () => {
    if (!user) return false;

    try {
      console.log('useOnboarding: Marking onboarding complete for user:', user.id);
      
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (error) {
        console.error('Error marking onboarding complete:', error);
        return false;
      }

      setNeedsOnboarding(false);
      return true;
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
      return false;
    }
  };

  const restartOnboarding = async () => {
    if (!user) return false;

    try {
      console.log('useOnboarding: Restarting onboarding for user:', user.id);
      
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: false })
        .eq('id', user.id);

      if (error) {
        console.error('Error restarting onboarding:', error);
        return false;
      }

      setNeedsOnboarding(true);
      return true;
    } catch (error) {
      console.error('Error restarting onboarding:', error);
      return false;
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
