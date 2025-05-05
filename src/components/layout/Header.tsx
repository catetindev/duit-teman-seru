
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { Button } from '@/components/ui/button';
import { User, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Header = ({ isPremium = false, isAdmin = false }) => {
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
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm py-4">
      <div className="container px-4 mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img 
              src={logoUrl || "/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png"} 
              alt="App Logo" 
              className="h-9 md:h-10 object-contain" 
            />
          </Link>
          {isPremium && (
            <span className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs px-2 py-1 rounded-full">
              Premium
            </span>
          )}
          {isAdmin && (
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
              Admin
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button variant="ghost" size="icon" className="relative rounded-full">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <User size={20} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
