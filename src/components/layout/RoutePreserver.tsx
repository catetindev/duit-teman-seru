
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function RoutePreserver() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we should restore a path from local storage
    const savedPath = localStorage.getItem('lastPath');
    
    if (savedPath && location.pathname === '/') {
      // Remove the saved path to prevent repeated redirects
      localStorage.removeItem('lastPath');
      navigate(savedPath);
    }
  }, [navigate, location.pathname]);

  return null;
}
