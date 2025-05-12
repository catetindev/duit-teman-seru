
import { useEntrepreneurMode } from './useEntrepreneurMode';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'react-router-dom';

export function useEntrepreneurModeSwitcher() {
  const { 
    isEntrepreneurMode, 
    toggleEntrepreneurMode: originalToggle, 
    isPremiumRequired 
  } = useEntrepreneurMode();
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  // Enhanced toggle that will trigger a page refresh
  const toggleEntrepreneurMode = () => {
    if (isPremiumRequired) {
      toast({
        title: "Fitur Premium",
        description: "Mode pengusaha hanya tersedia untuk pengguna premium.",
        variant: "destructive"
      });
      return;
    }
    
    // First toggle the mode
    originalToggle();
    
    // Then set the flag to refresh
    setShouldRefresh(true);
  };

  // Effect to handle the refresh
  useEffect(() => {
    if (shouldRefresh) {
      // Save current path to localStorage to restore after refresh
      localStorage.setItem('lastPath', location.pathname);
      
      // Show toast notification
      toast({
        title: isEntrepreneurMode ? "Mode Personal Aktif" : "Mode Pengusaha Aktif",
        description: isEntrepreneurMode 
          ? "Beralih ke tampilan keuangan personal" 
          : "Beralih ke tampilan bisnis dan alat pengusaha",
      });
      
      // Short delay before refreshing to allow state to be saved
      setTimeout(() => {
        window.location.reload();
      }, 300);
      
      setShouldRefresh(false);
    }
  }, [shouldRefresh, isEntrepreneurMode, location.pathname, toast]);

  return {
    isEntrepreneurMode,
    toggleEntrepreneurMode,
    isPremiumRequired
  };
}
