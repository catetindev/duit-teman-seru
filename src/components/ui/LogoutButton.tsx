import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner'; // Import toast from sonner

interface LogoutButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ variant = 'default', className, ...props }) => {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Show a loading toast and keep its ID
    const loadingToastId = toast.loading("Logging out..."); 

    try {
      await logout();
      // If logout is successful (promise resolves), update the toast to success
      toast.success("Logged out successfully", { id: loadingToastId }); 
    } catch (error: any) {
      console.error('Logout failed:', error);
      // If logout fails (promise rejects), update the toast to error
      toast.error(error.message || 'Failed to logout', { id: loadingToastId }); 
    } finally {
      // Always set loading state back to false
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {isLoggingOut ? (
        <>
          <span className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></span>
          Logging out...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          Logout
        </>
      )}
    </Button>
  );
};

export default LogoutButton;