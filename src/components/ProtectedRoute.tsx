
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'free' | 'premium' | 'admin';
}

const ProtectedRoute = ({ children, requiredRole = 'free' }: ProtectedRouteProps) => {
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

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based permissions
  if (requiredRole === 'admin' && userRole !== 'admin') {
    // Admin-only route but user is not admin
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole === 'premium' && userRole !== 'premium' && userRole !== 'admin') {
    // Premium route but user is not premium or admin
    return <Navigate to="/pricing" replace />;
  }

  // User is authenticated and has required permission
  return <>{children}</>;
};

export default ProtectedRoute;
