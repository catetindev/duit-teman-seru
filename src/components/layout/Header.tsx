
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { Button } from '@/components/ui/button';
import { User, Bell } from 'lucide-react';

const Header = ({ isPremium = false, isAdmin = false }) => {
  const { t } = useLanguage();
  
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm py-4">
      <div className="container px-4 mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <div className="bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg w-8 h-8 flex items-center justify-center text-white font-bold mr-2">
              D
            </div>
            <span className="text-xl font-outfit font-bold bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
              {t('app.name')}
            </span>
          </Link>
          {isPremium && (
            <span className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full">
              Premium
            </span>
          )}
          {isAdmin && (
            <span className="bg-gradient-to-r from-purple-400 to-purple-500 text-white text-xs px-2 py-1 rounded-full">
              Admin
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <Button variant="ghost" size="icon" className="relative">
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
