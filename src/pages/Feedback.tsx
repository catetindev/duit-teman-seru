
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

const Feedback = () => {
  const { isPremium, isAdmin } = useAuth();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    console.log('Feedback page loading...');
    
    // Check if script is already loaded
    if ((window as any).Tally) {
      console.log('Tally script already loaded');
      setIsScriptLoaded(true);
      return;
    }

    // Load Tally widgets script
    const script = document.createElement('script');
    script.src = 'https://tally.so/widgets/embed.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Tally script loaded successfully');
      setIsScriptLoaded(true);
      
      // Initialize Tally if available
      if ((window as any).Tally) {
        try {
          (window as any).Tally.loadEmbeds();
        } catch (error) {
          console.error('Error initializing Tally:', error);
        }
      }
    };
    
    script.onerror = () => {
      console.error('Failed to load Tally script');
    };
    
    document.head.appendChild(script);
    
    // Cleanup function
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <DashboardLayout isPremium={isPremium} isAdmin={isAdmin}>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Feedback</h1>
            <p className="text-slate-600 text-base max-w-2xl mx-auto">
              Kami sangat menghargai masukan Anda untuk membuat aplikasi ini lebih baik!
            </p>
          </div>

          {/* Content Container */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            {!isScriptLoaded ? (
              <div className="h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-slate-600">Loading feedback form...</p>
                </div>
              </div>
            ) : (
              <div className="h-[calc(100vh-300px)] min-h-[600px] relative">
                <iframe
                  data-tally-src="https://tally.so/r/3xozjr?transparentBackground=1"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title="Form Feedback🙏"
                  className="absolute top-0 left-0 w-full h-full border-0"
                  onLoad={() => console.log('Tally iframe loaded')}
                  onError={() => console.error('Tally iframe failed to load')}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;
