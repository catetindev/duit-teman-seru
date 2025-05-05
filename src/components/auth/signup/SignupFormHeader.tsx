
import React from 'react';

interface SignupFormHeaderProps {
  logoUrl: string | null;
}

export const SignupFormHeader: React.FC<SignupFormHeaderProps> = ({ logoUrl }) => {
  return (
    <>
      <div className="flex md:hidden items-center justify-center mb-8">
        {logoUrl && (
          <img 
            src={logoUrl}
            alt="App Logo" 
            className="h-12 object-contain" 
          />
        )}
      </div>
      
      <div className="text-center md:text-left mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Get Started Now</h1>
        <p className="text-gray-500">Create your account and start managing your finances</p>
      </div>
    </>
  );
};
