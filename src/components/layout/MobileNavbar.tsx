
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowDownUp, BarChart2, Target, User, ShieldAlert } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';

interface MobileNavbarProps {
  isPremium?: boolean;
  isAdmin?: boolean;
}

const MobileNavbar = ({ isPremium, isAdmin }: MobileNavbarProps) => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/transactions', label: 'Transactions', icon: ArrowDownUp },
    { path: '/budget', label: 'Budget', icon: BarChart2 },
    { path: '/goals', label: 'Goals', icon: Target },
  ];
  
  // Add admin route if user is admin
  if (isAdmin) {
    navItems.push({ path: '/admin', label: 'Admin', icon: ShieldAlert });
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 glass bg-background/95 border-b shadow-sm">
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center">
          <img 
            src="/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png" 
            alt="Catatuy Logo" 
            className="h-8 object-contain" 
          />
        </Link>
        
        {/* User avatar */}
        <Link to="/settings">
          <Avatar className="h-8 w-8 border">
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {user?.email?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
      
      {/* Bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t flex justify-around items-center px-2 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                           (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center px-2 py-1 rounded-lg transition-colors",
                isActive 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavbar;
