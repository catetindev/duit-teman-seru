
import React, { forwardRef, ElementRef, ComponentPropsWithoutRef } from 'react';
import { NavLink, To } from 'react-router-dom';
import { cn } from '@/lib/utils';

// SidebarGroup Component
export interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarGroup = ({ className, children, ...props }: SidebarGroupProps) => (
  <div className={cn("pb-4", className)} {...props}>
    {children}
  </div>
);

// SidebarGroupLabel Component
export interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarGroupLabel = ({ className, children, ...props }: SidebarGroupLabelProps) => (
  <div className={cn("px-3 mb-2 text-xs font-semibold text-muted-foreground", className)} {...props}>
    {children}
  </div>
);

// SidebarGroupContent Component
export interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const SidebarGroupContent = ({ className, children, ...props }: SidebarGroupContentProps) => (
  <div className={cn("space-y-1", className)} {...props}>
    {children}
  </div>
);

// SidebarMenuItemLink Component
export interface SidebarMenuItemLinkProps extends React.HTMLAttributes<HTMLLIElement> {
  href: To;
  icon?: React.ReactNode;
  end?: boolean;
  children: React.ReactNode;
}

export const SidebarMenuItemLink = forwardRef<HTMLLIElement, SidebarMenuItemLinkProps>(
  ({ children, className, href, icon, end, ...props }, ref) => (
    <li ref={ref} className={cn("block", className)} {...props}>
      <NavLink
        to={href}
        end={end}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-2 rounded-md px-3 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
            isActive 
              ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" 
              : "text-gray-600 dark:text-gray-300"
          )
        }
      >
        {icon && <span className="inline-flex">{icon}</span>}
        <span>{children}</span>
      </NavLink>
    </li>
  )
);
SidebarMenuItemLink.displayName = "SidebarMenuItemLink";

// SidebarMenuItem Component
export interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const SidebarMenuItem = forwardRef<HTMLLIElement, SidebarMenuItemProps>(
  ({ children, className, icon, ...props }, ref) => (
    <li ref={ref} className={cn("block", className)} {...props}>
      <div className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-600 dark:text-gray-300">
        {icon && <span className="inline-flex">{icon}</span>}
        <span>{children}</span>
      </div>
    </li>
  )
);
SidebarMenuItem.displayName = "SidebarMenuItem";

// SidebarNavLink Component
export interface SidebarNavLinkProps extends Omit<ComponentPropsWithoutRef<typeof NavLink>, "className"> {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const SidebarNavLink = forwardRef<ElementRef<typeof NavLink>, SidebarNavLinkProps>(
  ({ to, icon, children, end, ...props }, ref) => (
    <NavLink
      ref={ref}
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-md px-3 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
          isActive 
            ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" 
            : "text-gray-600 dark:text-gray-300"
        )
      }
      {...props}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      <span>{children}</span>
    </NavLink>
  )
);
SidebarNavLink.displayName = "SidebarNavLink";
