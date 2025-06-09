
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { trackSecurityEvent, detectSuspiciousActivity, generateSessionFingerprint } from '@/utils/enhancedSecurityUtils';

const SecurityMonitor: React.FC = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    let requestCount = 0;
    let lastRequestTime = Date.now();
    const sessionFingerprint = generateSessionFingerprint();

    // Monitor for rapid requests
    const monitorRequests = () => {
      requestCount++;
      const now = Date.now();
      const timeWindow = now - lastRequestTime;
      
      if (requestCount > 1) {
        detectSuspiciousActivity('rapid_requests', {
          requestCount,
          timeWindow,
          userId: user.id,
          sessionFingerprint
        });
      }
      
      // Reset counter every minute
      if (timeWindow > 60000) {
        requestCount = 1;
        lastRequestTime = now;
      }
    };

    // Monitor for tab visibility changes (potential session hijacking)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackSecurityEvent('session_hidden', {
          userId: user.id,
          sessionFingerprint
        });
      } else {
        trackSecurityEvent('session_visible', {
          userId: user.id,
          sessionFingerprint
        });
      }
    };

    // Monitor for unusual keyboard patterns
    const handleKeyDown = () => {
      monitorRequests();
    };

    // Monitor for paste events (potential credential stuffing)
    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'password') {
        trackSecurityEvent('password_paste_detected', {
          userId: user.id,
          elementId: target.id,
          sessionFingerprint
        });
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('paste', handlePaste);

    // Initial session tracking
    trackSecurityEvent('security_monitor_initialized', {
      userId: user.id,
      sessionFingerprint,
      userAgent: navigator.userAgent,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    return () => {
      // Cleanup
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('paste', handlePaste);
      
      trackSecurityEvent('security_monitor_cleanup', {
        userId: user.id,
        sessionFingerprint
      });
    };
  }, [user]);

  return null; // This component doesn't render anything
};

export default SecurityMonitor;
