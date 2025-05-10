
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
    <header className="h-16 border-b flex items-center px-4 justify-between">
      <div className="flex items-center gap-2">
        <button 
          onClick={() => navigate('/')}
          className="font-bold text-lg flex items-center gap-2"
        >
          <span className="text-xl">💰</span>
          <span className="hidden md:inline">Catatyo</span>
        </button>
      </div>
      
      <div className="flex items-center space-x-3">
        <LanguageToggle />
        <NotificationsPopover />
        <ModeToggle />
        {user && <LogoutButton />}
      </div>
    </header>
  );
};

export default Header;
