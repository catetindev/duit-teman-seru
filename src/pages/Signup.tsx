
import React from 'react';
import Navbar from '@/components/landing/Navbar';
import Footer from '@/components/landing/Footer';
import SignupForm from '@/components/auth/SignupForm';
import AuthIllustration from '@/components/auth/AuthIllustration';
import { useBrandingAssets } from '@/hooks/useBrandingAssets';

const Signup = () => {
  const { logoUrl } = useBrandingAssets();
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      <div className="flex flex-1 w-full mt-16 md:mt-20">
        {/* Left side - Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
          <SignupForm logoUrl={logoUrl} />
        </div>
        
        {/* Right side - Image as background */}
        <AuthIllustration />
      </div>
      
      <Footer />
    </div>
  );
};

export default Signup;
