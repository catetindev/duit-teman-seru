
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">Feedback</h1>
            <p className="text-slate-600">
              Kami sangat menghargai masukan Anda untuk membuat aplikasi ini lebih baik!
            </p>
          </div>

          {/* Content Container */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="h-[calc(100vh-200px)] min-h-[600px] relative">
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
      </div>
    </DashboardLayout>
  );
};

export default Feedback;
