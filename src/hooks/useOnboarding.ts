
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
      setNeedsOnboarding(shouldShowOnboarding);
    } catch (error) {
      console.error('Error in checkOnboardingStatus:', error);
      setNeedsOnboarding(false);
    } finally {
      setLoading(false);
    }
  };

  const markOnboardingComplete = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (error) {
        console.error('Error marking onboarding complete:', error);
        return;
      }

      setNeedsOnboarding(false);
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
    }
  };

  const restartOnboarding = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: false })
        .eq('id', user.id);

      if (error) {
        console.error('Error restarting onboarding:', error);
        return;
      }

      setNeedsOnboarding(true);
    } catch (error) {
      console.error('Error restarting onboarding:', error);
    }
  };

  return {
    needsOnboarding,
    loading,
    markOnboardingComplete,
    restartOnboarding,
  };
};
