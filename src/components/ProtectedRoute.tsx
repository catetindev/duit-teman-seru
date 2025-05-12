
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: 'free' | 'premium' | 'admin';
  premium?: boolean;
  admin?: boolean;
  adminOnly?: boolean; // Add this prop
}

const ProtectedRoute = ({ 
  children, 
  requiredRole = 'free', 
  premium = false,
  admin = false,
  adminOnly = false // Add default value
}: ProtectedRouteProps) => {
  const { user, userRole, isLoading } = useAuth();
  const location = useLocation();

  // If still loading auth state, show a loading indicator
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Set the required role based on premium or admin props
  let effectiveRole = requiredRole;
  if (premium) effectiveRole = 'premium';
  if (admin || adminOnly) effectiveRole = 'admin'; // Handle both admin and adminOnly props

  // Check role-based permissions
  if (effectiveRole === 'admin' && userRole !== 'admin') {
    // Admin-only route but user is not admin
    return <Navigate to="/dashboard" replace />;
  }

  if (effectiveRole === 'premium' && userRole !== 'premium' && userRole !== 'admin') {
    // Premium route but user is not premium or admin
    return <Navigate to="/pricing" replace />;
  }

  // User is authenticated and has required permission
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute;
