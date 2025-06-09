
import { useEffect } from 'react';

export const SecurityHeaders = () => {
  useEffect(() => {
    // Set Content Security Policy via meta tag for additional protection
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co wss://*.supabase.co;";
    
    // Check if CSP meta tag already exists
    const existingCsp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!existingCsp) {
      document.head.appendChild(cspMeta);
    }

    // Add additional security headers via meta tags where possible
    const referrerMeta = document.createElement('meta');
    referrerMeta.name = 'referrer';
    referrerMeta.content = 'strict-origin-when-cross-origin';
    
    const existingReferrer = document.querySelector('meta[name="referrer"]');
    if (!existingReferrer) {
      document.head.appendChild(referrerMeta);
    }

    return () => {
      // Cleanup on unmount
      if (document.head.contains(cspMeta)) {
        document.head.removeChild(cspMeta);
      }
      if (document.head.contains(referrerMeta)) {
        document.head.removeChild(referrerMeta);
      }
    };
  }, []);

  return null; // This component doesn't render anything
};
