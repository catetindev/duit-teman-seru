
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './button';
import { LogOut } from 'lucide-react';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  variant = 'ghost',
  size = 'default',
  className = ''
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call the logout function from AuthContext
      await logout();
      
      // Force a page reload to clear any lingering state
      // This is more reliable than just navigating
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <Button
      onClick={handleLogout}
      variant={variant}
      size={size}
      className={`flex items-center gap-2 ${className}`}
    >
      <LogOut className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;
