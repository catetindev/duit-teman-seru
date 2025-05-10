
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowDownUp, Target, BarChart2, PieChart, Settings, Bell, ShieldAlert, MessageSquare } from 'lucide-react';

interface MobileNavbarProps {
  isPremium?: boolean;
  isAdmin?: boolean;
}

const MobileNavbar = ({ isPremium, isAdmin }: MobileNavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/transactions', icon: ArrowDownUp, label: 'Transactions' },
    { path: '/goals', icon: Target, label: 'Goals' },
    { path: '/budget', icon: BarChart2, label: 'Budget' },
    ...(isPremium ? [{ path: '/analytics', icon: PieChart, label: 'Analytics' }] : []),
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/feedback', icon: MessageSquare, label: 'Feedback' },
    { path: '/settings', icon: Settings, label: 'Settings' },
    ...(isAdmin ? [{ path: '/admin', icon: ShieldAlert, label: 'Admin' }] : []),
  ];

  return (
    <>
      {/* Top navbar for mobile */}
      <div className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-30 flex items-center justify-between px-4">
        <div className="flex items-center">
          <img src="/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png" alt="Logo" className="h-8 w-auto" />
        </div>
      </div>
      
      {/* Bottom navbar for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t bg-background z-30">
        <div className="grid grid-cols-5 h-full">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.path}
              className={`flex flex-col items-center justify-center text-xs space-y-1 ${
                isActive(item.path) 
                  ? 'text-primary' 
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => navigate(item.path)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
