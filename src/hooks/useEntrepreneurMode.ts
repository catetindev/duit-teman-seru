
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to manage Entrepreneur Mode state
 * Premium users can toggle between personal and business finance views
 */
export function useEntrepreneurMode() {
  const [isEntrepreneurMode, setIsEntrepreneurMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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
      // Show premium upgrade prompt for free users
      toast({
        title: "Premium Feature",
        description: "Entrepreneur Mode is only available for premium users.",
        variant: "destructive",
        action: {
          label: "Upgrade",
          onClick: () => navigate('/pricing')
        }
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
      title: newValue ? "Business Mode Activated" : "Personal Mode Activated",
      description: newValue 
        ? "Now viewing your business finances and tools" 
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
