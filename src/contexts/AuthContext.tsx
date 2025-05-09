
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
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
  const [isPremium, setIsPremium] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userRole, setUserRole] = useState<'free' | 'premium' | 'admin' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Only fetch profile after session change
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setIsPremium(false);
          setIsAdmin(false);
          setUserRole(null);
          setProfile(null);
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
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        return;
      }

      console.log('User profile data:', profile);
      setProfile(profile);
      setUserRole(profile?.role || 'free');
      setIsAdmin(profile?.role === 'admin');
      setIsPremium(profile?.role === 'premium' || profile?.role === 'admin');
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password?: string) => {
    try {
      const { error } = password
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signInWithOtp({ email });

      if (error) {
        console.error('Login error:', error);
        toast.error(error.message || "Failed to login");
        return error;
      }
    } catch (error: any) {
      console.error('Login failed', error);
      toast.error(error.message || "An unexpected error occurred");
      return error;
    }
  };

  const signup = async (email: string, password?: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || '',
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        console.error('Signup error:', error);
        toast.error(error.message || "Failed to sign up");
        return error;
      }
      
      console.log('Signup successful, user data:', data);
    } catch (error: any) {
      console.error('Signup failed', error);
      toast.error(error.message || "An unexpected error occurred");
      return error;
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all state immediately
      setUser(null);
      setSession(null);
      setIsPremium(false);
      setIsAdmin(false);
      setUserRole(null);
      setProfile(null);
      
      // Show success message
      toast.success("Logged out successfully");
      
      // Return success to allow further actions
      return Promise.resolve();
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || "Failed to log out");
      return Promise.reject(error);
    }
  };

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
    signOut: logout, // Alias for compatibility
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
