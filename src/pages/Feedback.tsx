import React, { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

const Feedback = () => {
  const { isPremium, isAdmin } = useAuth();

  useEffect(() => {
    // Load Tally widgets script if not already loaded
    if (!(window as any).Tally) {
      const script = document.createElement('script');
      script.src = 'https://tally.so/widgets/embed.js';
      script.async = true;
      document.body.appendChild(script);
      
      // Cleanup script when component unmounts
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  return (
    <DashboardLayout isPremium={isPremium} isAdmin={isAdmin}>
      <div className="flex flex-col h-[calc(100vh-var(--header-height,4rem)-var(--footer-height,4rem)-2rem)] md:h-[calc(100vh-var(--header-height,4rem)-2rem)]"> {/* Adjust height based on layout */}
        <h1 className="text-2xl font-bold mb-4 px-4 md:px-0">Feedback</h1>
        <p className="text-muted-foreground mb-6 px-4 md:px-0">
          Kami sangat menghargai masukan Anda untuk membuat aplikasi ini lebih baik!
        </p>
        <div className="flex-grow relative">
          <iframe
            data-tally-src="https://tally.so/r/3xozjr?transparentBackground=1"
            width="100%"
            height="100%"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
            title="Form Feedback🙏"
            className="absolute top-0 left-0 w-full h-full border-0"
          ></iframe>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;