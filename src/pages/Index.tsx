import React, { useEffect } from 'react';
import { useSafeLanguage } from '@/hooks/useLanguage';
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
  // Use the safe language hook that doesn't throw errors
  const { t } = useSafeLanguage();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Tawk.to live chat script
    const s1 = document.createElement('script');
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6840176a3ab1e8190d1bb4ae/1ist5mukp';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s1.id = 'tawkto-script'; // beri id agar mudah dihapus
    const s0 = document.getElementsByTagName('script')[0];
    if (s0 && s0.parentNode) {
      s0.parentNode.insertBefore(s1, s0);
    } else {
      document.body.appendChild(s1);
    }
    // Cleanup: hapus script dan widget saat unmount
    return () => {
      // Hapus script
      const script = document.getElementById('tawkto-script');
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      // Hapus widget iframe jika ada
      const tawkIframe = document.querySelector('iframe[src*="tawk.to"]');
      if (tawkIframe && tawkIframe.parentNode) {
        tawkIframe.parentNode.removeChild(tawkIframe);
      }
      // Hapus global Tawk_API jika perlu
      if ((window as any).Tawk_API) {
        delete (window as any).Tawk_API;
      }
    };
  }, []);

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
