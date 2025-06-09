
import { supabase } from '@/integrations/supabase/client';
import { logSecurityEvent } from './securityUtils';

// Enhanced IP-based security tracking
export const trackSecurityEvent = async (eventType: string, details?: any) => {
  try {
    // Get user's IP and location info (where available)
    const userAgent = navigator.userAgent;
    const language = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const platform = navigator.platform;
    
    const enhancedDetails = {
      ...details,
      userAgent,
      language,
      timezone,
      platform,
      timestamp: Date.now(),
      url: window.location.href
    };

    await logSecurityEvent(eventType, enhancedDetails);
  } catch (error) {
    console.error('Failed to track security event:', error);
  }
};

// Enhanced admin login validation
export const validateAdminLogin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return false;

    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const isAdmin = profile?.role === 'admin';
    
    if (isAdmin) {
      // Log admin access
      await trackSecurityEvent('admin_access', {
        userId: user.id,
        email: user.email
      });
    }

    return isAdmin;
  } catch (error) {
    console.error('Admin validation error:', error);
    return false;
  }
};

// Enhanced CSRF protection for sensitive operations
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  if (!token || !storedToken) return false;
  return token === storedToken;
};

// Session fingerprinting for additional security
export const generateSessionFingerprint = (): string => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    navigator.platform
  ];
  
  return btoa(components.join('|'));
};

// Enhanced monitoring for suspicious activities
export const detectSuspiciousActivity = async (activityType: string, details: any) => {
  const suspiciousPatterns = {
    rapidRequests: details.requestCount > 10 && details.timeWindow < 60000, // 10 requests in 1 minute
    adminEscalation: activityType === 'role_change' && details.newRole === 'admin',
    multipleFailedLogins: activityType === 'failed_login' && details.attemptCount > 3,
    unusualLocation: details.timezone && details.timezone !== details.expectedTimezone
  };

  const isSuspicious = Object.values(suspiciousPatterns).some(Boolean);
  
  if (isSuspicious) {
    await trackSecurityEvent('suspicious_activity_detected', {
      activityType,
      patterns: suspiciousPatterns,
      ...details
    });
  }

  return isSuspicious;
};
