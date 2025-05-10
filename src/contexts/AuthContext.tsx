
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/auth/useProfile';
import { useAuthMethods } from '@/hooks/auth/useAuthMethods';

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
  const [isLoading, setIsLoading] = useState(true);
  
  // Use our custom hooks
  const { 
    profile, isPremium, isAdmin, userRole, fetchUserProfile 
  } = useProfile(user?.id);
  
  const { login, signup, logout, signOut } = useAuthMethods();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only fetch profile after session change
        if (session?.user) {
          fetchUserProfile(session.user.id);
        } else {
          // Clear user state on logout
        }
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting auth session:', error);
          return;
        }
        
        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
          fetchUserProfile(data.session.user.id);
        }
      } catch (error) {
        console.error('Error in auth initialization:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUserProfile]);

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
