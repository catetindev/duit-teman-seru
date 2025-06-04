
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

import DashboardSidebar from './DashboardSidebar';
import MobileNavbar from './MobileNavbar';
import LoadingSpinner from './LoadingSpinner';
import LoginRequired from './LoginRequired';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  isPremium?: boolean;
  isAdmin?: boolean;
}

const DashboardLayout = ({
  children,
  isPremium,
  isAdmin
}: DashboardLayoutProps) => {
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();
  
  // Page transition animations
  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.98
    },
    in: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.25, 0, 1]
      }
    },
    out: { 
      opacity: 0, 
      y: -20,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.25, 0, 1]
      }
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LoadingSpinner />
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LoginRequired />
      </motion.div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
        {isMobile && <MobileNavbar isPremium={isPremium} isAdmin={isAdmin} />}
        
        {!isMobile && (
          <motion.div
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.25, 0, 1] }}
          >
            <DashboardSidebar 
              isPremium={isPremium} 
              isAdmin={isAdmin} 
            />
          </motion.div>
        )}

        <div className={cn(
          "flex-1 transition-all duration-300", 
          !isMobile && "ml-64",
          isMobile && "pt-16 pb-20"
        )}> 
          <main className="w-full h-full overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
