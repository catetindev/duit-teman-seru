
import React from 'react';
import { useBrandingAssets } from '@/hooks/useBrandingAssets';

interface AuthIllustrationProps {
  className?: string;
}

const AuthIllustration = ({ className = "" }: AuthIllustrationProps) => {
  const { backgroundUrl } = useBrandingAssets();
  
  return (
    <div 
      className={`hidden md:block md:w-1/2 relative ${className}`}
      style={{
        backgroundImage: `url(${backgroundUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    />
  );
};

export default AuthIllustration;
