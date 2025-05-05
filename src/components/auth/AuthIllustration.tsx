
import React from 'react';
import { Link } from 'react-router-dom';
import { useBrandingAssets } from '@/hooks/useBrandingAssets';

interface AuthIllustrationProps {
  className?: string;
}

const AuthIllustration = ({ className = "" }: AuthIllustrationProps) => {
  const { logoUrl, backgroundUrl } = useBrandingAssets();
  
  return (
    <div className={`hidden md:block md:w-1/2 bg-gray-50 p-6 relative ${className}`}>
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center gap-2">
          {logoUrl && (
            <img 
              src={logoUrl}
              alt="App Logo" 
              className="h-12 object-contain" 
            />
          )}
        </Link>
      </div>
      
      <div className="h-full w-full flex items-center justify-center">
        <img 
          src={backgroundUrl}
          alt="Financial freedom illustration" 
          className="max-w-full max-h-full object-contain rounded-xl" 
        />
      </div>
    </div>
  );
};

export default AuthIllustration;
