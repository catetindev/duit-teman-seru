
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowDownUp, BarChart2, Target, User, Menu, ShieldAlert } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  
  // Full menu items including those hidden in bottom nav
  const fullMenuItems = [
    ...navItems,
    { path: '/settings', label: 'Settings', icon: User },
  ];
  
  // Add admin route if user is admin
  if (isAdmin) {
    fullMenuItems.push({ path: '/admin', label: 'Admin', icon: ShieldAlert });
  }
  
  // Add analytics if premium
  if (isPremium) {
    fullMenuItems.push({ path: '/analytics', label: 'Analytics', icon: BarChart2 });
  }

  return (
    <>
      {/* Top header with hamburger and logo */}
      <div className="fixed top-0 left-0 right-0 z-50 glass bg-background/95 border-b shadow-sm">
        <div className="h-16 px-4 flex items-center justify-between">
          {/* Hamburger menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 rounded-lg hover:bg-muted/80 transition-all">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] pt-16">
              <div className="grid gap-4 py-4">
                {fullMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path || 
                                  (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                  
                  return (
                    <Link 
                      key={item.path} 
                      to={item.path}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                        isActive 
                          ? "bg-muted font-medium text-primary" 
                          : "hover:bg-muted/60"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                
                {/* Logout option at the bottom */}
                <div className="mt-auto pt-4 border-t">
                  <Link 
                    to="/logout" 
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-destructive hover:bg-muted/60 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Logo centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img 
              src="/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png" 
              alt="Catatuy Logo" 
              className="h-8 w-auto object-contain" 
            />
          </div>
          
          {/* User avatar */}
          <Link to="/settings">
            <Avatar className="h-8 w-8 border">
              <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                {user?.email?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
      
      {/* Bottom navigation bar - Made taller with better padding */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-background border-t flex justify-around items-center px-2 z-50 pb-4 pt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
                         (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-colors",
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
    </>
  );
};

export default MobileNavbar;
