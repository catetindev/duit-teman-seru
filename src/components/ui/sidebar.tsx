
import * as React from "react"
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  Settings,
  Bell,
  BarChart2,
  PieChart,
  Plus,
  Minus,
} from "lucide-react"
import LogoutButton from "./LogoutButton";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
  children?: React.ReactNode;
}

const useSidebar = () => {
  // Simple sidebar state management. Adjust as needed.
  const [collapsed, setCollapsed] = React.useState(false);
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  return {
    collapsed,
    toggleSidebar
  };
};

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const { collapsed, toggleSidebar } = useSidebar();
  
  return (
    <div className="min-h-screen flex w-full">
      <SidebarContext.Provider value={{ collapsed, toggleSidebar }}>
        {children}
      </SidebarContext.Provider>
    </div>
  );
};

type SidebarContextType = {
  collapsed: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined);

export const useSidebarContext = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
};

export const Sidebar = ({
  className,
  children,
  ...props
}: SidebarProps) => {
  const { collapsed } = useSidebarContext();

  return (
    <aside
      className={cn(
        "flex flex-col h-screen border-r fixed inset-y-0 left-0 transition-all bg-background",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  );
};

interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarHeader = ({
  className,
  ...props
}: SidebarHeaderProps) => {
  const { collapsed } = useSidebarContext();

  return (
    <header
      className={cn("h-16 flex items-center px-4 border-b", className)}
      {...props}
    >
      <div className="flex items-center justify-between w-full">
        {!collapsed && (
          <div className="font-bold text-xl">DuitTemanseru</div>
        )}
        {collapsed && <div className="font-bold text-xl">DT</div>}
      </div>
    </header>
  );
};

interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarContent = ({
  className,
  children,
  ...props
}: SidebarContentProps) => {
  return (
    <div
      className={cn("flex-1 overflow-y-auto py-3", className)}
      {...props}
    >
      {children}
    </div>
  );
};

interface SidebarFooterProps extends React.HTMLAttributes<HTMLElement> {}

export const SidebarFooter = ({
  className,
  ...props
}: SidebarFooterProps) => {
  const { collapsed } = useSidebarContext();
  
  return (
    <footer
      className={cn("p-4 border-t mt-auto", className)}
      {...props}
    >
      <div className={cn(
        "flex items-center justify-center",
        collapsed ? "flex-col" : "justify-between"
      )}>
        {!collapsed && (
          <LogoutButton variant="ghost" />
        )}
        {collapsed && (
          <LogoutButton variant="ghost" size="icon" className="h-9 w-9 p-0" />
        )}
      </div>
    </footer>
  );
};

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarGroup = ({
  className,
  children,
  ...props
}: SidebarGroupProps) => {
  return (
    <div
      className={cn("py-2", className)}
      {...props}
    >
      {children}
    </div>
  );
};

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const SidebarGroupLabel = ({
  className,
  ...props
}: SidebarGroupLabelProps) => {
  const { collapsed } = useSidebarContext();
  
  if (collapsed) return null;
  
  return (
    <p
      className={cn(
        "ml-4 text-xs font-medium text-muted-foreground pb-1",
        className
      )}
      {...props}
    />
  );
};

interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SidebarGroupContent = ({
  className,
  children,
  ...props
}: SidebarGroupContentProps) => {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  );
};

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
}

export const SidebarMenu = ({ className, ...props }: SidebarMenuProps) => {
  return <div className={cn("flex flex-col space-y-0.5", className)} {...props} />;
};

interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  active?: boolean;
  disabled?: boolean;
}

export const SidebarMenuItem = ({
  className,
  children,
  active,
  disabled,
  ...props
}: SidebarMenuItemProps) => {
  return (
    <li
      className={cn(
        "flex flex-1 list-none",
        disabled && "cursor-not-allowed opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </li>
  );
};

interface SidebarMenuButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  active?: boolean;
}

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(({ className, asChild = false, active, ...props }, ref) => {
  const { collapsed } = useSidebarContext();
  const Comp = asChild ? React.Fragment : "button";
  
  return (
    <Comp>
      <button
        ref={ref}
        className={cn(
          "flex items-center text-muted-foreground w-full",
          collapsed ? "px-2" : "px-4",
          "py-2 hover:bg-muted/50 rounded-md transition-colors",
          active && "bg-muted",
          className
        )}
        {...props}
      />
    </Comp>
  );
});
SidebarMenuButton.displayName = "SidebarMenuButton";

interface SidebarTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {}

export const SidebarTrigger = ({
  className,
  ...props
}: SidebarTriggerProps) => {
  const { collapsed, toggleSidebar } = useSidebarContext();
  
  return (
    <button
      className={cn(
        "fixed top-4 left-4 z-50 h-8 w-8 flex items-center justify-center rounded-md border bg-background md:hidden",
        className
      )}
      onClick={toggleSidebar}
      {...props}
    >
      {collapsed ? <Plus size={16} /> : <Minus size={16} />}
    </button>
  );
};

interface SidebarNavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  end?: boolean;
}

export const SidebarNavLink: React.FC<SidebarNavLinkProps> = ({ 
  to, 
  icon, 
  children,
  end = false
}) => {
  const { collapsed } = useSidebarContext();
  const location = useLocation();
  const isActive = end 
    ? location.pathname === to
    : location.pathname.startsWith(to);
    
  return (
    <SidebarMenuItem active={isActive}>
      <SidebarMenuButton asChild active={isActive}>
        <Link
          to={to}
          className={cn(
            "flex w-full items-center",
            isActive ? "text-foreground font-medium" : "text-muted-foreground",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          <div className={cn("mr-2", collapsed && "mr-0")}>{icon}</div>
          {!collapsed && <span>{children}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

interface SidebarSubMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  icon: React.ReactNode;
  defaultOpen?: boolean;
}

export const SidebarSubMenu = ({
  className,
  label,
  icon,
  defaultOpen = false,
  children,
  ...props
}: SidebarSubMenuProps) => {
  const { collapsed } = useSidebarContext();
  const [open, setOpen] = React.useState(defaultOpen);
  
  return (
    <div className={cn("", className)} {...props}>
      <button
        className={cn(
          "flex items-center w-full text-muted-foreground",
          collapsed ? "px-2 justify-center" : "px-4 justify-between",
          "py-2 hover:bg-muted/50 rounded-md transition-colors"
        )}
        onClick={() => !collapsed && setOpen(!open)}
      >
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          <div className={cn("mr-2", collapsed && "mr-0")}>{icon}</div>
          {!collapsed && <span>{label}</span>}
        </div>
        {!collapsed && <ChevronDown className={cn("h-4 w-4 transition-transform", open && "transform rotate-180")} />}
      </button>
      
      {!collapsed && open && (
        <div className="ml-6 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};
