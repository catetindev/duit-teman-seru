
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
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Feedback</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Kami sangat menghargai masukan Anda untuk membuat aplikasi ini lebih baik!
          </p>
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="h-[calc(100vh-280px)] min-h-[600px] relative">
            <iframe
              data-tally-src="https://tally.so/r/3xozjr?transparentBackground=1"
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Form Feedback🙏"
              className="absolute top-0 left-0 w-full h-full border-0"
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;
