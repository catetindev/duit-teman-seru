
import React from 'react';
import { SidebarContent } from "@/components/ui/sidebar";
import EntrepreneurModeSidebar from './sidebar/EntrepreneurModeSidebar';
import PersonalModeSidebar from './sidebar/PersonalModeSidebar';

interface SidebarContentsProps {
  isEntrepreneurMode: boolean;
  isPremium?: boolean;
  isAdmin?: boolean;
}

const SidebarContents = ({ 
  isEntrepreneurMode, 
  isPremium, 
  isAdmin 
}: SidebarContentsProps) => {
  if (isEntrepreneurMode && isPremium) {
    return <EntrepreneurModeSidebar isAdmin={isAdmin} />;
  } else {
    return <PersonalModeSidebar isPremium={isPremium} isAdmin={isAdmin} />;
  }
};

export default SidebarContents;
