
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface SecureAuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
}

interface LoginAttempt {
  timestamp: number;
  count: number;
}

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const useSecureAuth = () => {
  const [authState, setAuthState] = useState<SecureAuthState>({
    user: null,
    session: null,
    isLoading: true,
    isInitialized: false
  });

  // Rate limiting for login attempts
  const checkRateLimit = useCallback((email: string): boolean => {
    const storageKey = `login_attempts_${email}`;
    const stored = localStorage.getItem(storageKey);
    
    if (!stored) return true;
    
    try {
      const attempt: LoginAttempt = JSON.parse(stored);
      const now = Date.now();
      
      if (now - attempt.timestamp > LOCKOUT_DURATION) {
        localStorage.removeItem(storageKey);
        return true;
      }
      
      if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - (now - attempt.timestamp)) / 60000);
        toast.error(`Too many failed attempts. Try again in ${remainingTime} minutes.`);
        return false;
      }
      
      return true;
    } catch {
      localStorage.removeItem(storageKey);
      return true;
    }
  }, []);

  const recordFailedAttempt = useCallback((email: string) => {
    const storageKey = `login_attempts_${email}`;
    const stored = localStorage.getItem(storageKey);
    
    try {
      const attempt: LoginAttempt = stored 
        ? JSON.parse(stored) 
        : { timestamp: Date.now(), count: 0 };
      
      attempt.count += 1;
      attempt.timestamp = Date.now();
      
      localStorage.setItem(storageKey, JSON.stringify(attempt));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const clearFailedAttempts = useCallback((email: string) => {
    const storageKey = `login_attempts_${email}`;
    localStorage.removeItem(storageKey);
  }, []);

  // Secure login with rate limiting and validation
  const secureLogin = useCallback(async (email: string, password: string) => {
    // Input validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }

    // Rate limiting check
    if (!checkRateLimit(email)) {
      throw new Error('Too many failed attempts. Please try again later.');
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password
      });

      if (error) {
        recordFailedAttempt(email);
        
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and click the confirmation link before signing in.');
        } else {
          throw new Error(error.message);
        }
      }

      if (data.session) {
        clearFailedAttempts(email);
        console.log('Login successful:', data.user?.id);
      }

      return { data, error: null };
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }, [checkRateLimit, recordFailedAttempt, clearFailedAttempts]);

  // Secure logout with cleanup
  const secureLogout = useCallback(async () => {
    try {
      console.log('Starting secure logout process...');
      
      // Clear any sensitive data from localStorage
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('catatyo_') || 
        key.startsWith('supabase') ||
        key.includes('session') ||
        key.includes('token')
      );
      
      keysToRemove.forEach(key => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.warn(`Failed to remove localStorage key: ${key}`, error);
        }
      });

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }

      console.log('Logout successful');
      return { error: null };
    } catch (error: any) {
      console.error('Secure logout failed:', error);
      throw error;
    }
  }, []);

  // Session validation
  const validateSession = useCallback(async (session: Session | null): Promise<boolean> => {
    if (!session) return false;
    
    try {
      // Check if token is still valid
      const { data, error } = await supabase.auth.getUser();
      
      if (error || !data.user) {
        console.warn('Session validation failed:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        // Set up auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            
            console.log('Auth state changed:', event);
            
            if (event === 'SIGNED_OUT' || !session) {
              setAuthState({
                user: null,
                session: null,
                isLoading: false,
                isInitialized: true
              });
            } else {
              // Validate session before accepting it
              const isValid = await validateSession(session);
              
              if (isValid) {
                setAuthState({
                  user: session.user,
                  session,
                  isLoading: false,
                  isInitialized: true
                });
              } else {
                // Invalid session, sign out
                await supabase.auth.signOut();
              }
            }
          }
        );

        // Get initial session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
          setAuthState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
          return;
        }

        if (session) {
          const isValid = await validateSession(session);
          
          if (isValid) {
            setAuthState({
              user: session.user,
              session,
              isLoading: false,
              isInitialized: true
            });
          } else {
            await supabase.auth.signOut();
          }
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
        }

        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setAuthState(prev => ({ ...prev, isLoading: false, isInitialized: true }));
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [validateSession]);

  return {
    ...authState,
    secureLogin,
    secureLogout,
    validateSession
  };
};
