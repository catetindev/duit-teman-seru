
import React, { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

const Feedback = () => {
  const { isPremium, isAdmin } = useAuth();

  // Initialize or reload Tally script after component mounts
  useEffect(() => {
    const loadTallyScript = () => {
      if (typeof window !== "undefined") {
        if (typeof (window as any).Tally !== "undefined") {
          (window as any).Tally.loadEmbeds();
        } else {
          const iframes = document.querySelectorAll("iframe[data-tally-src]:not([src])");
          iframes.forEach((iframe: HTMLIFrameElement) => {
            if (iframe.dataset.tallySrc) {
              iframe.src = iframe.dataset.tallySrc;
            }
          });
        }
      }
    };

    // Load the script if not already loaded
    if (typeof (window as any).Tally === "undefined") {
      const script = document.createElement("script");
      script.src = "https://tally.so/widgets/embed.js";
      script.onload = loadTallyScript;
      script.onerror = loadTallyScript;
      document.body.appendChild(script);
    } else {
      loadTallyScript();
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <DashboardLayout isPremium={isPremium} isAdmin={isAdmin}>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">We'd Love Your Feedback</h1>
        <p className="text-muted-foreground mb-6">
          Your feedback helps us improve Catatyo. Please share your thoughts and suggestions below.
        </p>
        
        <div className="bg-card rounded-lg border shadow-sm p-4">
          <iframe 
            data-tally-src="https://tally.so/embed/3xozjr?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1" 
            loading="lazy" 
            width="100%" 
            height="751" 
            frameBorder="0" 
            title="Form Feedback🙏"
            className="w-full"
          ></iframe>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;
