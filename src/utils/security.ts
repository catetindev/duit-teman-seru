
import { supabase } from '@/integrations/supabase/client';

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove basic HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/on\w+=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length
};

export const sanitizeEmail = (email: string): string => {
  if (typeof email !== 'string') return '';
  
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w@.-]/g, '') // Only allow alphanumeric, @, ., and -
    .slice(0, 254); // RFC 5321 limit
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Session security utilities
export const isSessionValid = (session: any): boolean => {
  if (!session || !session.access_token || !session.user) {
    return false;
  }
  
  // Check if token is expired
  const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
  const now = Date.now();
  
  if (expiresAt <= now) {
    return false;
  }
  
  return true;
};

// Admin operation security
export const validateAdminOperation = async (operation: string, targetData?: any): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('Admin operation attempted without authentication:', operation);
      return false;
    }
    
    // Get user profile to check role
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (error || !profile || profile.role !== 'admin') {
      console.warn('Admin operation attempted by non-admin user:', user.id, operation);
      return false;
    }
    
    // Log admin operation
    console.log('Admin operation authorized:', {
      userId: user.id,
      operation,
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Admin validation error:', error);
    return false;
  }
};

// Content Security Policy utilities
export const setupCSP = (): void => {
  // Only run in browser environment
  if (typeof window === 'undefined') return;
  
  // Add security headers via meta tags (as a fallback)
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https: blob:;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co;
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s+/g, ' ').trim();
  
  // Only add if not already present
  if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
    document.head.appendChild(meta);
  }
};

// Rate limiting utility
interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  identifier: string;
}

export const checkRateLimit = (config: RateLimitConfig): boolean => {
  const { maxAttempts, windowMs, identifier } = config;
  const key = `rate_limit_${identifier}`;
  
  try {
    const stored = localStorage.getItem(key);
    const now = Date.now();
    
    if (!stored) {
      localStorage.setItem(key, JSON.stringify({ count: 1, firstAttempt: now }));
      return true;
    }
    
    const data = JSON.parse(stored);
    
    // Reset if window has passed
    if (now - data.firstAttempt > windowMs) {
      localStorage.setItem(key, JSON.stringify({ count: 1, firstAttempt: now }));
      return true;
    }
    
    // Check if limit exceeded
    if (data.count >= maxAttempts) {
      return false;
    }
    
    // Increment counter
    data.count += 1;
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Rate limit check failed:', error);
    return true; // Allow on error to prevent blocking legitimate users
  }
};

// Secure data storage utilities
export const secureLocalStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const serialized = JSON.stringify({
        data: value,
        timestamp: Date.now(),
        checksum: btoa(JSON.stringify(value)).slice(0, 10) // Simple integrity check
      });
      localStorage.setItem(`secure_${key}`, serialized);
    } catch (error) {
      console.error('Secure storage set error:', error);
    }
  },
  
  getItem: (key: string): any => {
    try {
      const stored = localStorage.getItem(`secure_${key}`);
      if (!stored) return null;
      
      const parsed = JSON.parse(stored);
      
      // Verify integrity
      const expectedChecksum = btoa(JSON.stringify(parsed.data)).slice(0, 10);
      if (parsed.checksum !== expectedChecksum) {
        console.warn('Data integrity check failed for:', key);
        localStorage.removeItem(`secure_${key}`);
        return null;
      }
      
      // Check if data is too old (24 hours)
      if (Date.now() - parsed.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(`secure_${key}`);
        return null;
      }
      
      return parsed.data;
    } catch (error) {
      console.error('Secure storage get error:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    localStorage.removeItem(`secure_${key}`);
  }
};
