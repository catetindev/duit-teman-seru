
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

/**
 * Custom hook to manage Entrepreneur Mode state
 * Premium users can toggle between personal and business finance views
 */
export function useEntrepreneurMode() {
  const [isEntrepreneurMode, setIsEntrepreneurMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isPremium } = useAuth();
  const { toast } = useToast();

  // Load the entrepreneur mode preference from local storage
  useEffect(() => {
    // First check local storage
    const storedMode = localStorage.getItem('entrepreneurMode');
    
    if (storedMode !== null) {
      setIsEntrepreneurMode(storedMode === 'true');
    }
    
    setIsLoading(false);
  }, []);
  
  // Function to toggle entrepreneur mode
  const toggleEntrepreneurMode = () => {
    if (!isPremium) {
      toast({
        title: "Premium Feature",
        description: "Entrepreneur Mode is only available for premium users.",
        variant: "destructive"
      });
      return;
    }
    
    const newValue = !isEntrepreneurMode;
    
    // Update local state
    setIsEntrepreneurMode(newValue);
    
    // Persist to local storage
    localStorage.setItem('entrepreneurMode', String(newValue));
    
    // Optional: Store in user metadata if logged in
    if (user?.id) {
      // We could save this to user metadata in Supabase, but for now
      // local storage should be sufficient
    }
    
    toast({
      title: newValue ? "Entrepreneur Mode Activated" : "Personal Mode Activated",
      description: newValue 
        ? "Now viewing your business finances" 
        : "Switched back to personal finance view",
    });
  };
  
  return {
    isEntrepreneurMode,
    toggleEntrepreneurMode,
    isLoading,
    isPremiumRequired: !isPremium
  };
}
