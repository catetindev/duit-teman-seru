
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { toast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: 'free' | 'premium' | 'admin';
  premium?: boolean;
  admin?: boolean;
  adminOnly?: boolean;
  entrepreneurModeOnly?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole = 'free', 
  premium = false,
  admin = false,
  adminOnly = false,
  entrepreneurModeOnly = false
}: ProtectedRouteProps) => {
  const { user, userRole, isPremium, isLoading } = useAuth();
  const { isEntrepreneurMode } = useEntrepreneurMode();
  const location = useLocation();

  console.log(`[ProtectedRoute] Path: ${location.pathname}`);
  console.log(`[ProtectedRoute] isLoading: ${isLoading}`);
  console.log(`[ProtectedRoute] User:`, user ? user.id : 'null');
  console.log(`[ProtectedRoute] User Role: ${userRole}`);
  console.log(`[ProtectedRoute] Required Role (effective): ${premium ? 'premium' : (admin || adminOnly) ? 'admin' : requiredRole}`);
  console.log(`[ProtectedRoute] Entrepreneur Mode Only: ${entrepreneurModeOnly}, Is in Entrepreneur Mode: ${isEntrepreneurMode}`);

  if (isLoading) {
    console.log('[ProtectedRoute] Rendering loading indicator.');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!user) {
    console.log('[ProtectedRoute] User not authenticated, redirecting to /login.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  let effectiveRole = requiredRole;
  if (premium) effectiveRole = 'premium';
  if (admin || adminOnly) effectiveRole = 'admin';

  if (effectiveRole === 'admin' && userRole !== 'admin') {
    console.log('[ProtectedRoute] Admin role required, user is not admin. Redirecting to /dashboard.');
    return <Navigate to="/dashboard" replace />;
  }

  if (effectiveRole === 'premium' && userRole !== 'premium' && userRole !== 'admin') {
    console.log('[ProtectedRoute] Premium role required, user is not premium/admin. Redirecting to /pricing.');
    toast({
      title: "Premium Feature",
      description: "This feature is only available for premium users.",
      variant: "destructive"
    });
    return <Navigate to="/pricing" replace />;
  }

  // Check if route requires entrepreneur mode
  if (entrepreneurModeOnly && !isEntrepreneurMode) {
    console.log('[ProtectedRoute] Entrepreneur mode required but not active. Redirecting to dashboard.');
    toast({
      title: "Entrepreneur Mode Required",
      description: "Please enable Entrepreneur Mode to access this feature.",
    });
    return <Navigate to="/dashboard" replace />;
  }

  // Check if route requires both entrepreneur mode and premium
  if (entrepreneurModeOnly && !isPremium) {
    console.log('[ProtectedRoute] Entrepreneur mode and premium required. Redirecting to pricing.');
    toast({ 
      title: "Premium Feature",
      description: "Entrepreneur features are only available for premium users.",
      variant: "destructive"
    });
    return <Navigate to="/pricing" replace />;
  }

  console.log('[ProtectedRoute] User authenticated and has permission. Rendering children.');
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
