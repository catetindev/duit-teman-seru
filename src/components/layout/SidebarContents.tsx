
import React from 'react';
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
  // Show entrepreneur sidebar only if both entrepreneur mode is active AND user is premium
  if (isEntrepreneurMode && isPremium) {
    return <EntrepreneurModeSidebar isAdmin={isAdmin} />;
  } else {
    return <PersonalModeSidebar isPremium={isPremium} isAdmin={isAdmin} />;
  }
};

export default SidebarContents;
