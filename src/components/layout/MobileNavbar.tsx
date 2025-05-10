
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Bell, LayoutDashboard, MessageSquare, PieChart, Settings, ShieldAlert, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EntrepreneurModeToggle } from '@/components/entrepreneur/EntrepreneurModeToggle';
import { useNotifications } from '@/hooks/notifications/useNotifications';

interface MobileNavbarProps {
  isPremium?: boolean;
  isAdmin?: boolean;
}

const MobileNavbar = ({ isPremium, isAdmin }: MobileNavbarProps) => {
  const location = useLocation();
  const { unreadCount } = useNotifications('current');
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <>
      {/* Top navbar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-background border-b flex items-center justify-between px-4 z-50">
        <Link to="/dashboard" className="flex items-center">
          <img 
            src="/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png" 
            alt="Catatuy Logo" 
            className="h-8" 
          />
        </Link>
        
        <div className="flex items-center gap-2">
          {isPremium && <EntrepreneurModeToggle />}
          
          <Link 
            to="/notifications" 
            className={cn(
              "relative p-2 rounded-full hover:bg-accent", 
              isActive('/notifications') && "bg-accent"
            )}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>
          
          <Link 
            to="/settings" 
            className={cn(
              "p-2 rounded-full hover:bg-accent", 
              isActive('/settings') && "bg-accent"
            )}
          >
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </div>
      
      {/* Bottom navbar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t flex items-center justify-between px-4 z-50">
        <Link 
          to="/dashboard" 
          className={cn(
            "flex flex-1 flex-col items-center justify-center text-xs", 
            isActive('/dashboard') 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
        >
          <LayoutDashboard className="h-5 w-5 mb-1" />
          Dashboard
        </Link>
        
        <Link 
          to="/transactions" 
          className={cn(
            "flex flex-1 flex-col items-center justify-center text-xs", 
            isActive('/transactions') 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
        >
          <Target className="h-5 w-5 mb-1" />
          Transactions
        </Link>
        
        <Link 
          to="/budget" 
          className={cn(
            "flex flex-1 flex-col items-center justify-center text-xs", 
            isActive('/budget') 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
        >
          <BarChart2 className="h-5 w-5 mb-1" />
          Budget
        </Link>
        
        {isPremium && (
          <Link 
            to="/analytics" 
            className={cn(
              "flex flex-1 flex-col items-center justify-center text-xs", 
              isActive('/analytics') 
                ? "text-primary" 
                : "text-muted-foreground"
            )}
          >
            <PieChart className="h-5 w-5 mb-1" />
            Analytics
          </Link>
        )}
        
        <Link 
          to="/feedback" 
          className={cn(
            "flex flex-1 flex-col items-center justify-center text-xs", 
            isActive('/feedback') 
              ? "text-primary" 
              : "text-muted-foreground"
          )}
        >
          <MessageSquare className="h-5 w-5 mb-1" />
          Feedback
        </Link>
        
        {isAdmin && (
          <Link 
            to="/admin" 
            className={cn(
              "flex flex-1 flex-col items-center justify-center text-xs", 
              isActive('/admin') 
                ? "text-primary" 
                : "text-muted-foreground"
            )}
          >
            <ShieldAlert className="h-5 w-5 mb-1" />
            Admin
          </Link>
        )}
      </div>
    </>
  );
};

export default MobileNavbar;
