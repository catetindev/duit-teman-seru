
import * as React from "react";

type SidebarContextType = {
  collapsed: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  // Simple sidebar state management
  const [collapsed, setCollapsed] = React.useState(false);
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  return {
    collapsed,
    toggleSidebar
  };
};

export const SidebarProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const {
    collapsed,
    toggleSidebar
  } = useSidebar();
  return <div className="min-h-screen flex w-full">
      <SidebarContext.Provider value={{
      collapsed,
      toggleSidebar
    }}>
        {children}
      </SidebarContext.Provider>
    </div>;
};

export const useSidebarContext = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
};
