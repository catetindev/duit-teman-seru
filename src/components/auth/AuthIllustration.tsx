
import React from 'react';
import { Link } from 'react-router-dom';

interface AuthIllustrationProps {
  logoUrl: string | null;
  backgroundUrl: string | null;
  defaultLogoUrl: string;
  defaultBackgroundUrl: string;
}

const AuthIllustration = ({ 
  logoUrl, 
  backgroundUrl, 
  defaultLogoUrl, 
  defaultBackgroundUrl 
}: AuthIllustrationProps) => {
  return (
    <div className="hidden md:block md:w-1/2 bg-gray-50 p-6 relative">
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
          src={backgroundUrl || defaultBackgroundUrl}
          alt="Financial freedom illustration" 
          className="max-w-full max-h-full object-contain rounded-xl" 
        />
      </div>
    </div>
  );
};

export default AuthIllustration;
