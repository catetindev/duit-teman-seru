
import React from 'react';
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from "@/components/ui/sidebar";
import LogoutButton from '@/components/ui/LogoutButton';
import SidebarContents from './SidebarContents';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';

interface DashboardSidebarProps {
  isPremium?: boolean;
  isAdmin?: boolean;
}

const DashboardSidebar = ({ isPremium, isAdmin }: DashboardSidebarProps) => {
  const { isEntrepreneurMode } = useEntrepreneurMode();

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-center w-full">
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png" alt="Catatuy Logo" className="h-8 sm:h-10" />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <SidebarContents 
          isEntrepreneurMode={isEntrepreneurMode}
          isPremium={isPremium}
          isAdmin={isAdmin}
        />
      </SidebarContent>
      
      <SidebarFooter className="p-2">
        <div className="px-2 py-2">
          <LogoutButton variant="outline" className="w-full rounded-full text-sm" />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
