
import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from './Header';
import { useLanguage } from '@/hooks/useLanguage';
import { cn } from '@/lib/utils';
import { Home, PiggyBank, BarChart, CreditCard, Target, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  active: boolean;
}

const NavItem = ({ icon, label, href, active }: NavItemProps) => (
  <Link 
    to={href} 
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
      active 
        ? "bg-primary/10 text-primary font-medium" 
        : "hover:bg-muted/80 text-muted-foreground"
    )}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

interface DashboardLayoutProps {
  children: ReactNode;
  isPremium?: boolean;
  isAdmin?: boolean;
}

const DashboardLayout = ({ 
  children, 
  isPremium = false, 
  isAdmin = false 
}: DashboardLayoutProps) => {
  const { t } = useLanguage();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const navItems = [
    {
      icon: <Home size={20} />,
      label: t('nav.dashboard'),
      href: isAdmin ? '/admin' : '/dashboard',
    },
    {
      icon: <CreditCard size={20} />,
      label: t('nav.transactions'),
      href: '/transactions',
    },
    {
      icon: <Target size={20} />,
      label: t('nav.goals'),
      href: '/goals',
    },
    {
      icon: <BarChart size={20} />,
      label: t('nav.budget'),
      href: '/budget',
    }
  ];
  
  // Add analytics for premium users only
  if (isPremium) {
    navItems.push({
      icon: <PiggyBank size={20} />,
      label: t('nav.analytics'),
      href: '/analytics',
    });
  }
  
  // Add settings at the end
  navItems.push({
    icon: <Settings size={20} />,
    label: t('nav.settings'),
    href: '/settings',
  });
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Header isPremium={isPremium} isAdmin={isAdmin} />
      
      <div className="flex flex-1 container px-4 mx-auto pt-6">
        <aside className="w-60 hidden md:block pr-6">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={currentPath === item.href}
              />
            ))}
          </nav>
          
          {!isPremium && !isAdmin && (
            <div className="mt-8 p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg text-white">
              <h3 className="font-bold mb-2">✨ {t('action.upgrade')}</h3>
              <p className="text-sm mb-3 opacity-90">
                {t('app.tagline')}
              </p>
              <Button variant="secondary" size="sm" className="w-full">
                {t('action.upgrade')}
              </Button>
            </div>
          )}
        </aside>
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
