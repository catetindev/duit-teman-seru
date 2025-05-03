
import * as React from "react";
import { cn } from "@/lib/utils";
import { useSidebarContext } from "./sidebar-context";
import { Plus, Minus } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children?: React.ReactNode;
}

export const Sidebar = ({
  className,
  children,
  ...props
}: SidebarProps) => {
  const {
    collapsed
  } = useSidebarContext();
  return <aside className={cn("flex flex-col h-screen border-r fixed inset-y-0 left-0 transition-all bg-background", collapsed ? "w-16" : "w-64", className)} {...props}>
      {children}
    </aside>;
};

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export const SidebarHeader = ({
  className,
  ...props
}: SidebarHeaderProps) => {
  const {
    collapsed
  } = useSidebarContext();
  return <header className={cn("h-16 flex items-center px-4 border-b", className)} {...props}>
      <div className="flex items-center justify-between w-full">
        {!collapsed && <div className="flex items-center">
            <img src="/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png" alt="Catatuy Logo" className="h-10 object-contain" />
          </div>}
        {collapsed && <div className="flex items-center justify-center w-full">
            <img src="/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png" alt="Catatuy Logo" className="h-8 object-contain" />
          </div>}
      </div>
    </header>;
};

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export const SidebarContent = ({
  className,
  children,
  ...props
}: SidebarContentProps) => {
  return <div className={cn("flex-1 overflow-y-auto py-3", className)} {...props}>
      {children}
    </div>;
};

interface SidebarFooterProps extends React.HTMLAttributes<HTMLElement> {}
export const SidebarFooter = ({
  className,
  ...props
}: SidebarFooterProps) => {
  const {
    collapsed
  } = useSidebarContext();
  return <footer className={cn("p-4 border-t mt-auto", className)} {...props}>
      <div className={cn("flex items-center justify-center", collapsed ? "flex-col" : "justify-between")}>
        {props.children}
      </div>
    </footer>;
};

interface SidebarTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {}
export const SidebarTrigger = ({
  className,
  ...props
}: SidebarTriggerProps) => {
  const {
    collapsed,
    toggleSidebar
  } = useSidebarContext();
  return <button className={cn("fixed top-4 left-4 z-50 h-8 w-8 flex items-center justify-center rounded-md border bg-background md:hidden", className)} onClick={toggleSidebar} {...props}>
      {collapsed ? <Plus size={16} /> : <Minus size={16} />}
    </button>;
};
