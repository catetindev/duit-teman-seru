
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/auth/useProfile';
import { useAuthMethods } from '@/hooks/auth/useAuthMethods';
import { toast } from 'sonner';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isPremium: boolean;
  isAdmin: boolean;
  userRole: 'free' | 'premium' | 'admin' | null;
  isLoading: boolean;
  profile: any;
  login: (email: string, password?: string) => Promise<any>;
  signup: (email: string, password?: string, fullName?: string) => Promise<any>;
  logout: () => Promise<void>;
  signOut: () => Promise<void>; // Alias for logout for compatibility
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true
  
  const { 
    profile, isPremium, isAdmin, userRole, fetchUserProfile, clearProfileData 
  } = useProfile(); // Added clearProfileData from useProfile
  
  const { login, signup, logout, signOut } = useAuthMethods();

  const handleAuthStateChange = useCallback(async (event: string, currentSession: Session | null) => {
    console.log('Auth state changed:', event, currentSession?.user?.id);
    
    if (event === 'SIGNED_OUT') {
      console.log('User signed out. Clearing auth state.');
      setSession(null);
      setUser(null);
      clearProfileData();
    } else {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
  
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
      } else {
        clearProfileData();
      }
    }
    
    // Always set loading to false after processing
    setIsLoading(false);
  }, [fetchUserProfile, clearProfileData]);

  useEffect(() => {
    console.log('Setting up auth state management');
    setIsLoading(true); // Set loading true when effect runs
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, sessionUpdate) => {
        // When onAuthStateChange triggers, it might be due to token refresh, sign in, sign out etc.
        console.log('Auth state change detected:', event);
        // We always want to re-evaluate the session and profile.
        setIsLoading(true); // Set loading true before processing new auth state
        handleAuthStateChange(event, sessionUpdate);
      }
    );

    // THEN get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (initialSession) {
        console.log('Initial session found:', initialSession.user?.id);
        handleAuthStateChange('INITIAL_SESSION', initialSession);
      } else {
        console.log('No initial session found.');
        handleAuthStateChange('NO_INITIAL_SESSION', null); // Explicitly handle no session
      }
    }).catch(error => {
      console.error("Error getting initial session:", error);
      handleAuthStateChange('SESSION_ERROR', null); // Handle error case
      toast.error("Error initializing auth session");
    });

    return () => {
      console.log('Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, [handleAuthStateChange]);

  const authValue = {
    user,
    session,
    isPremium,
    isAdmin,
    userRole,
    isLoading,
    profile,
    login,
    logout,
    signOut,
    signup,
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
