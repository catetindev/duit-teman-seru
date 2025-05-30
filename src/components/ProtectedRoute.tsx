import React, { useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  const [roleTimeout, setRoleTimeout] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  console.log(`[ProtectedRoute] Path: ${location.pathname}`);
  console.log(`[ProtectedRoute] isLoading: ${isLoading}`);
  console.log(`[ProtectedRoute] User:`, user ? user.id : 'null');
  console.log(`[ProtectedRoute] User Role: ${userRole}`);
  console.log(`[ProtectedRoute] Required Role (effective): ${premium ? 'premium' : (admin || adminOnly) ? 'admin' : requiredRole}`);
  console.log(`[ProtectedRoute] Entrepreneur Mode Only: ${entrepreneurModeOnly}, Is in Entrepreneur Mode: ${isEntrepreneurMode}`);

  // Timeout fallback: jika user sudah ada tapi userRole masih null > 3 detik
  useEffect(() => {
    if (user && !userRole && isLoading) {
      timeoutRef.current = setTimeout(() => {
        setRoleTimeout(true);
      }, 3000);
    } else {
      setRoleTimeout(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [user, userRole, isLoading]);

  // Tampilkan loading hanya jika user dan userRole sama-sama null dan isLoading true
  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Jika user sudah ada tapi userRole belum didapat setelah timeout
  if (user && !userRole && (isLoading || roleTimeout)) {
    if (roleTimeout) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center">
          <div className="mb-4 text-red-500 font-semibold">Gagal memuat data user, silakan refresh halaman.</div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded" onClick={() => window.location.reload()}>Refresh</button>
        </div>
      );
    }
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
    toast({
      title: "Admin Access Required",
      description: "You don't have permission to access this page",
      variant: "destructive"
    });
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
