
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Component that preserves route after page refresh
 * Checks localStorage for the last path visited and navigates there
 */
export function RoutePreserver() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // On initial mount, check if we need to restore a path
    if (location.pathname === '/') {
      const lastPath = localStorage.getItem('lastPath');
      
      // If we have a saved path and it's not the root, navigate to it
      if (lastPath && lastPath !== '/' && lastPath !== location.pathname) {
        navigate(lastPath, { replace: true });
      }
    } else {
      // Save the current path for potential future restores
      localStorage.setItem('lastPath', location.pathname);
    }
  }, [location.pathname, navigate]);

  // This is a utility component with no UI
  return null;
}
