
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BrandingAssets {
  logoUrl: string | null;
  backgroundUrl: string | null;
  isLoading: boolean;
}

export const useBrandingAssets = (
  defaultLogoUrl = "/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png",
  defaultBackgroundUrl = "/lovable-uploads/9990595e-be96-4dac-9fce-6ee0303ee188.png"
): BrandingAssets => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // This key will change to force a reload of assets
  const [cacheKey, setCacheKey] = useState<string>(Date.now().toString());

  // Function to force refresh the assets
  const refreshAssets = () => {
    setCacheKey(Date.now().toString());
  };

  useEffect(() => {
    const fetchBrandingAssets = async () => {
      try {
        setIsLoading(true);
        
        // Fetch custom logo if it exists
        const { data: logoData } = await supabase.storage
          .from('branding')
          .getPublicUrl('logo.png');
          
        if (logoData?.publicUrl) {
          setLogoUrl(`${logoData.publicUrl}?t=${cacheKey}`);
        } else {
          // Fallback to default logo
          setLogoUrl(defaultLogoUrl);
        }
        
        // Fetch custom background if it exists
        const { data: bgData } = await supabase.storage
          .from('branding')
          .getPublicUrl('background.jpg');
          
        if (bgData?.publicUrl) {
          setBackgroundUrl(`${bgData.publicUrl}?t=${cacheKey}`);
        } else {
          // Fallback to default background
          setBackgroundUrl(defaultBackgroundUrl);
        }
      } catch (error) {
        console.error('Error fetching branding assets:', error);
        // Set fallbacks if error occurs
        setLogoUrl(defaultLogoUrl);
        setBackgroundUrl(defaultBackgroundUrl);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBrandingAssets();
    
    // Set up a listener for branding-updated events
    window.addEventListener('branding-updated', refreshAssets);
    
    return () => {
      window.removeEventListener('branding-updated', refreshAssets);
    };
  }, [defaultLogoUrl, defaultBackgroundUrl, cacheKey]);

  return { logoUrl, backgroundUrl, isLoading };
};
