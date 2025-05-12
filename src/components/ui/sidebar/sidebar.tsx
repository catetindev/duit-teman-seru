
import React, { forwardRef } from 'react';
import { useSidebarContext } from './sidebar-context';
import { cn } from '@/lib/utils';

// Sidebar Component
interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ className, children, ...props }, ref) => {
    const { expanded } = useSidebarContext();
    
    return (
      <aside
        ref={ref}
        className={cn(
          "fixed top-0 left-0 z-30 h-screen w-64 border-r bg-background transition-all",
          !expanded && "w-16",
          className
        )}
        {...props}
      >
        <div className="flex h-full flex-col overflow-hidden">{children}</div>
      </aside>
    );
  }
);
Sidebar.displayName = "Sidebar";

// SidebarHeader Component
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarHeader = forwardRef<HTMLDivElement, SidebarHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex h-16 items-center border-b px-4", className)}
      {...props}
    >
      {children}
    </div>
  )
);
SidebarHeader.displayName = "SidebarHeader";

// SidebarContent Component
interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarContent = forwardRef<HTMLDivElement, SidebarContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex-1 overflow-auto py-2", className)}
      {...props}
    >
      {children}
    </div>
  )
);
SidebarContent.displayName = "SidebarContent";

// SidebarFooter Component
interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarFooter = forwardRef<HTMLDivElement, SidebarFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("border-t p-2", className)}
      {...props}
    >
      {children}
    </div>
  )
);
SidebarFooter.displayName = "SidebarFooter";
