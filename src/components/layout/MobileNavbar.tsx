
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowDownUp, BarChart2, Target, User, Menu, ShieldAlert, LogOut } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabase } from '@/integrations/supabase/client';
import LogoutButton from '@/components/ui/LogoutButton';

interface MobileNavbarProps {
  isPremium?: boolean;
  isAdmin?: boolean;
}

const MobileNavbar = ({ isPremium, isAdmin }: MobileNavbarProps) => {
  const location = useLocation();
  const { user } = useAuth();
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
                
                {/* Logout option at the bottom - Use LogoutButton component instead of Link */}
                <div className="mt-auto pt-4 border-t">
                  <LogoutButton
                    variant="ghost"
                    size="default" 
                    className="w-full justify-start px-4 py-3 rounded-lg text-destructive hover:bg-muted/60 transition-colors"
                  />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Logo centered */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img 
              src={logoUrl || "/lovable-uploads/ebe4aa03-3f9e-4e7e-82f6-bb40de4a50b4.png"} 
              alt="App Logo" 
              className="h-10 w-auto object-contain" 
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
    </>
  );
};

export default MobileNavbar;
