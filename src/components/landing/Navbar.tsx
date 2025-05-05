
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/hooks/useLanguage';

const Navbar = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { t } = useLanguage();

  // Navigation functions
  const goToLogin = () => navigate('/login');
  const goToSignup = () => navigate('/signup');

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-slate-100 dark:border-slate-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png" alt="DuitTemanseru Logo" className="h-8 md:h-10 w-auto object-contain" />
        </div>
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button onClick={goToLogin} variant="outline" size={isMobile ? "sm" : "default"} className={`transition-all hover:scale-[1.03] ${isMobile ? "px-2" : ""}`}>
            Masuk
          </Button>
          <Button onClick={goToSignup} size={isMobile ? "sm" : "default"} className={`border border-[#28e57d] bg-white text-black dark:bg-transparent dark:text-white hover:bg-[#28e57d]/10 hover:scale-[1.03] transition-all font-medium ${isMobile ? "px-2" : ""}`}>
            Daftar
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
