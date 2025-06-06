
import { supabase } from '@/integrations/supabase/client';

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .trim();
};

export const sanitizeEmail = (email: string): string => {
  if (!email) return '';
  
  // Basic email validation and sanitization
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const sanitized = sanitizeInput(email.toLowerCase());
  
  return emailRegex.test(sanitized) ? sanitized : '';
};

export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  // Remove all HTML tags and decode entities
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'");
};

// Rate limiting check
export const checkRateLimit = async (action: string, limitCount: number = 5, timeWindowMinutes: number = 15): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('check_rate_limit', {
      _action: action,
      _limit_count: limitCount,
      _time_window: `${timeWindowMinutes} minutes`
    });
    
    if (error) {
      console.error('Rate limit check failed:', error);
      return false; // Fail safe - deny if we can't check
    }
    
    return data === true;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return false;
  }
};

// Security event logging
export const logSecurityEvent = async (eventType: string, details?: any): Promise<void> => {
  try {
    await supabase.rpc('log_security_event', {
      _event_type: eventType,
      _details: details ? JSON.stringify(details) : null
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Secure localStorage wrapper
export const secureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      // Add timestamp for expiration checks
      const item = {
        value,
        timestamp: Date.now(),
        // Add basic obfuscation (not encryption, just basic protection)
        checksum: btoa(value).slice(0, 8)
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Failed to store item:', error);
    }
  },
  
  getItem: (key: string, maxAgeMinutes: number = 60): string | null => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      
      const item = JSON.parse(stored);
      const age = Date.now() - item.timestamp;
      const maxAge = maxAgeMinutes * 60 * 1000;
      
      // Check if expired
      if (age > maxAge) {
        localStorage.removeItem(key);
        return null;
      }
      
      // Basic integrity check
      if (btoa(item.value).slice(0, 8) !== item.checksum) {
        localStorage.removeItem(key);
        return null;
      }
      
      return item.value;
    } catch (error) {
      console.error('Failed to retrieve item:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  },
  
  clear: (): void => {
    localStorage.clear();
  }
};

// Password strength validation
export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters long');
  }
  
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain lowercase letters');
  }
  
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain uppercase letters');
  }
  
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain numbers');
  }
  
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Password must contain special characters');
  }
  
  const isValid = score >= 4;
  
  return { isValid, score, feedback };
};

// Session security utilities
export const getSessionInfo = () => {
  return {
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: navigator.language
  };
};
