
import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import SignupForm from '@/components/auth/SignupForm';
import AuthIllustration from '@/components/auth/AuthIllustration';
import { useBrandingAssets } from '@/hooks/useBrandingAssets';

const Signup = () => {
  const { logoUrl, backgroundUrl } = useBrandingAssets(
    "/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png",
    "/lovable-uploads/9990595e-be96-4dac-9fce-6ee0303ee188.png"
  );
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 w-full mt-16 md:mt-20">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
          <SignupForm logoUrl={logoUrl} />
        </div>
        
        {/* Right side - Image */}
        <AuthIllustration 
          logoUrl={logoUrl}
          backgroundUrl={backgroundUrl}
          defaultLogoUrl="/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png"
          defaultBackgroundUrl="/lovable-uploads/9990595e-be96-4dac-9fce-6ee0303ee188.png"
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Signup;
