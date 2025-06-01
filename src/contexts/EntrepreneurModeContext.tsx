import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface EntrepreneurModeContextType {
  isEntrepreneurMode: boolean;
  toggleEntrepreneurMode: () => void;
  isLoading: boolean;
  isPremiumRequired: boolean;
}

const EntrepreneurModeContext = createContext<EntrepreneurModeContextType | undefined>(undefined);

interface EntrepreneurModeProviderProps {
  children: ReactNode;
}

export function EntrepreneurModeProvider({ children }: EntrepreneurModeProviderProps) {
  const [isEntrepreneurMode, setIsEntrepreneurMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Load the entrepreneur mode preference from local storage
  useEffect(() => {
    const storedMode = localStorage.getItem('entrepreneurMode');
    
    if (storedMode !== null) {
      setIsEntrepreneurMode(storedMode === 'true');
    }
    
    setIsLoading(false);
  }, []);
  
  // Add or remove entrepreneur-mode class on <body>
  useEffect(() => {
    if (isEntrepreneurMode) {
      document.body.classList.add('entrepreneur-mode');
    } else {
      document.body.classList.remove('entrepreneur-mode');
    }
  }, [isEntrepreneurMode]);
  
  // Function to toggle entrepreneur mode
  const toggleEntrepreneurMode = () => {
    if (!isPremium) {
      // Show premium upgrade prompt for free users
      toast({
        title: "Premium Feature",
        description: "Entrepreneur Mode is only available for premium users.",
        variant: "destructive",
        action: (
          <div 
            className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded cursor-pointer text-xs font-medium"
            onClick={() => navigate('/pricing')}
          >
            Upgrade
          </div>
        )
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

  const value = {
    isEntrepreneurMode,
    toggleEntrepreneurMode,
    isLoading,
    isPremiumRequired: !isPremium
  };

  return (
    <EntrepreneurModeContext.Provider value={value}>
      {children}
    </EntrepreneurModeContext.Provider>
  );
}

export function useEntrepreneurMode() {
  const context = useContext(EntrepreneurModeContext);
  if (context === undefined) {
    throw new Error('useEntrepreneurMode must be used within an EntrepreneurModeProvider');
  }
  return context;
}
