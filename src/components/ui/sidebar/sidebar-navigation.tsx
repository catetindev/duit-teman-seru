
import * as React from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useSidebarContext } from "./sidebar-context";

interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}
export const SidebarGroup = ({
  className,
  children,
  ...props
}: SidebarGroupProps) => {
  return <div className={cn("py-2", className)} {...props}>
      {children}
    </div>;
};

interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export const SidebarGroupLabel = ({
  className,
  ...props
}: SidebarGroupLabelProps) => {
  const {
    collapsed
  } = useSidebarContext();
  if (collapsed) return null;
  return <p className={cn("ml-4 text-xs font-medium text-muted-foreground pb-1", className)} {...props} />;
};

interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export const SidebarGroupContent = ({
  className,
  children,
  ...props
}: SidebarGroupContentProps) => {
  return <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>;
};

interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultOpen?: boolean;
}
export const SidebarMenu = ({
  className,
  ...props
}: SidebarMenuProps) => {
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
  return <li className={cn("flex flex-1 list-none", disabled && "cursor-not-allowed opacity-70", className)} {...props}>
      {children}
    </li>;
};

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  active?: boolean;
}
export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(({
  className,
  asChild = false,
  active,
  ...props
}, ref) => {
  const {
    collapsed
  } = useSidebarContext();
  const Comp = asChild ? React.Fragment : "button";
  return <Comp>
      <button ref={ref} className={cn("flex items-center text-muted-foreground w-full", collapsed ? "px-2" : "px-4", "py-2 hover:bg-muted/50 rounded-md transition-colors", active && "bg-muted", className)} {...props} />
    </Comp>;
});
SidebarMenuButton.displayName = "SidebarMenuButton";

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
  const {
    collapsed
  } = useSidebarContext();
  const location = useLocation();
  const isActive = end ? location.pathname === to : location.pathname.startsWith(to);
  return <SidebarMenuItem active={isActive}>
      <SidebarMenuButton asChild active={isActive}>
        <Link to={to} className={cn("flex w-full items-center", isActive ? "text-foreground font-medium" : "text-muted-foreground", collapsed ? "justify-center" : "justify-start")}>
          <div className={cn("mr-2", collapsed && "mr-0")}>{icon}</div>
          {!collapsed && <span>{children}</span>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>;
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
  const {
    collapsed
  } = useSidebarContext();
  const [open, setOpen] = React.useState(defaultOpen);
  return <div className={cn("", className)} {...props}>
      <button className={cn("flex items-center w-full text-muted-foreground", collapsed ? "px-2 justify-center" : "px-4 justify-between", "py-2 hover:bg-muted/50 rounded-md transition-colors")} onClick={() => !collapsed && setOpen(!open)}>
        <div className={cn("flex items-center", collapsed && "justify-center w-full")}>
          <div className={cn("mr-2", collapsed && "mr-0")}>{icon}</div>
          {!collapsed && <span>{label}</span>}
        </div>
        {!collapsed && <ChevronDown className={cn("h-4 w-4 transition-transform", open && "transform rotate-180")} />}
      </button>
      
      {!collapsed && open && <div className="ml-6 mt-1 space-y-1">
          {children}
        </div>}
    </div>;
};
