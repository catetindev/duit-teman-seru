
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { logSecurityEvent, checkRateLimit, getSessionInfo } from '@/utils/securityUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SecureAuthState {
  loginAttempts: number;
  isBlocked: boolean;
  blockUntil: number | null;
  lastActivity: number;
}

const MAX_LOGIN_ATTEMPTS = 5;
const BLOCK_DURATION = 15 * 60 * 1000; // 15 minutes
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const useSecureAuth = () => {
  const { user } = useAuth();
  const [authState, setAuthState] = useState<SecureAuthState>({
    loginAttempts: 0,
    isBlocked: false,
    blockUntil: null,
    lastActivity: Date.now()
  });

  // Session timeout management
  const updateActivity = useCallback(() => {
    setAuthState(prev => ({ ...prev, lastActivity: Date.now() }));
  }, []);

  // Check for session timeout
  useEffect(() => {
    if (!user) return;

    const checkSessionTimeout = () => {
      const now = Date.now();
      const timeSinceLastActivity = now - authState.lastActivity;
      
      if (timeSinceLastActivity > SESSION_TIMEOUT) {
        handleSessionTimeout();
      }
    };

    const interval = setInterval(checkSessionTimeout, 60000); // Check every minute
    
    // Add activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      clearInterval(interval);
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [user, authState.lastActivity, updateActivity]);

  const handleSessionTimeout = useCallback(async () => {
    console.log('Session timeout detected');
    await logSecurityEvent('session_timeout', getSessionInfo());
    
    toast.warning('Your session has expired for security reasons. Please log in again.');
    
    // Sign out user
    await supabase.auth.signOut();
  }, []);

  const handleFailedLogin = useCallback(async (error: any) => {
    const newAttempts = authState.loginAttempts + 1;
    
    // Log the failed attempt
    await logSecurityEvent('failed_login_attempt', {
      attempts: newAttempts,
      error: error.message,
      ...getSessionInfo()
    });

    setAuthState(prev => ({
      ...prev,
      loginAttempts: newAttempts,
      isBlocked: newAttempts >= MAX_LOGIN_ATTEMPTS,
      blockUntil: newAttempts >= MAX_LOGIN_ATTEMPTS ? Date.now() + BLOCK_DURATION : null
    }));

    if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
      toast.error(`Too many failed login attempts. Please try again in 15 minutes.`);
    } else {
      toast.error(`Login failed. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempts remaining.`);
    }
  }, [authState.loginAttempts]);

  const handleSuccessfulLogin = useCallback(async () => {
    // Reset login attempts on successful login
    setAuthState(prev => ({
      ...prev,
      loginAttempts: 0,
      isBlocked: false,
      blockUntil: null,
      lastActivity: Date.now()
    }));

    // Log successful login
    await logSecurityEvent('successful_login', getSessionInfo());
  }, []);

  const checkLoginAllowed = useCallback(async (): Promise<boolean> => {
    // Check if currently blocked
    if (authState.isBlocked && authState.blockUntil) {
      if (Date.now() < authState.blockUntil) {
        const remainingTime = Math.ceil((authState.blockUntil - Date.now()) / 60000);
        toast.error(`Login blocked. Try again in ${remainingTime} minutes.`);
        return false;
      } else {
        // Block expired, reset state
        setAuthState(prev => ({
          ...prev,
          isBlocked: false,
          blockUntil: null,
          loginAttempts: 0
        }));
      }
    }

    // Check rate limiting
    const isAllowed = await checkRateLimit('login_attempt', 10, 15);
    if (!isAllowed) {
      toast.error('Too many login attempts. Please try again later.');
      await logSecurityEvent('rate_limit_exceeded', {
        action: 'login_attempt',
        ...getSessionInfo()
      });
      return false;
    }

    return true;
  }, [authState.isBlocked, authState.blockUntil]);

  const secureSignOut = useCallback(async () => {
    try {
      // Log the sign out
      await logSecurityEvent('user_signout', getSessionInfo());
      
      // Clear any stored session data
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      // Sign out from Supabase
      await supabase.auth.signOut();
      
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error during secure sign out:', error);
      toast.error('Error signing out');
    }
  }, []);

  return {
    authState,
    handleFailedLogin,
    handleSuccessfulLogin,
    checkLoginAllowed,
    secureSignOut,
    updateActivity
  };
};
