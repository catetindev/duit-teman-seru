
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '@/components/ui/LogoutButton';
import { useAuth } from '@/contexts/AuthContext';
import LanguageToggle from '../ui/LanguageToggle';
import { ModeToggle } from '../ui/ModeToggle';
import NotificationsPopover from '../ui/NotificationsPopover';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <header className="h-16 border-b bg-white flex items-center px-4 sm:px-6 justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate('/')}
          className="font-bold text-lg flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl">💰</span>
          <span className="hidden sm:inline text-slate-800">Catatyo</span>
        </button>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-3">
        <LanguageToggle />
        <NotificationsPopover />
        <ModeToggle />
        {user && <LogoutButton />}
      </div>
    </header>
  );
};

export default Header;
