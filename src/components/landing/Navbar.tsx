
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Fetch custom logo
    const fetchLogo = async () => {
      try {
        // Fetch custom logo if it exists
        const { data: logoData } = await supabase.storage
          .from('branding')
          .getPublicUrl('logo.png');
          
        if (logoData?.publicUrl) {
          setLogoUrl(`${logoData.publicUrl}?t=${Date.now()}`);
        } else {
          // Fallback to default logo
          setLogoUrl("/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png");
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
        setLogoUrl("/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png");
      }
    };
    
    fetchLogo();
  }, []);

  // Navigation functions
  const goToLogin = () => navigate('/login');
  const goToPricing = () => navigate('/pricing');
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={logoUrl || "/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png"} 
              alt="App Logo" 
              className="h-8 md:h-10 w-auto object-contain" 
            />
          </Link>
          
          {/* Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-6">
            
            
            
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button onClick={goToLogin} variant="outline" size={isMobile ? "sm" : "default"} className={`transition-all hover:scale-[1.03] ${isMobile ? "px-2" : ""}`}>
            {t('auth.login')}
          </Button>
          <Button onClick={goToPricing} size={isMobile ? "sm" : "default"} className={`border border-[#28e57d] bg-white text-black dark:bg-transparent dark:text-white hover:bg-[#28e57d]/10 hover:scale-[1.03] transition-all font-medium ${isMobile ? "px-2" : ""}`}>
            {t('auth.signup')}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
