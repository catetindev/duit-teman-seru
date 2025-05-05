
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { Button } from '@/components/ui/button';
import { User, Bell } from 'lucide-react';
import { useBrandingAssets } from '@/hooks/useBrandingAssets';

const Header = ({ isPremium = false, isAdmin = false }) => {
  const { t } = useLanguage();
  const { logoUrl } = useBrandingAssets();
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm py-4">
      <div className="container px-4 mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png" 
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
