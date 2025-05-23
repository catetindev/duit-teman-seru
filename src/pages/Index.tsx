
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';

// Import all the section components
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import EntrepreneurSection from '@/components/landing/EntrepreneurSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CallToActionSection from '@/components/landing/CallToActionSection';
import Footer from '@/components/landing/Footer';

const Index = () => {
  // Using try-catch to make sure the component doesn't crash if the provider isn't available
  // This should help to debug what's happening
  let translationFunction;
  try {
    const { t } = useLanguage();
    translationFunction = t;
  } catch (error) {
    console.error("Language provider error:", error);
    // Provide a fallback translation function
    translationFunction = (key: string) => key;
  }
  
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f8faf9] dark:from-gray-900 dark:to-gray-800 overflow-x-hidden">
      <Navbar />
      <div className="pt-16"> {/* Add padding to account for fixed navbar */}
        <HeroSection />
        <FeaturesSection />
        <EntrepreneurSection />
        <TestimonialsSection />
        <CallToActionSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
