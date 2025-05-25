
import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEntrepreneurOnboarding } from '@/hooks/useEntrepreneurOnboarding';

interface EntrepreneurOnboardingTourProps {
  onComplete?: () => void;
  forceStart?: boolean;
}

const EntrepreneurOnboardingTour = ({ onComplete, forceStart = false }: EntrepreneurOnboardingTourProps) => {
  const [runTour, setRunTour] = useState(false);
  const { user, isLoading, isPremium } = useAuth();
  const { toast } = useToast();
  const { needsEntrepreneurOnboarding, loading, markEntrepreneurOnboardingComplete } = useEntrepreneurOnboarding();

  const steps: Step[] = [
    {
      target: 'body',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Welcome to Entrepreneur Mode 🚀</h3>
          <p className="text-sm">Sekarang kamu masuk ke mode usaha. Semua fitur usaha seperti pencatatan bisnis, laporan keuangan, invoice generator, dan kalkulator harga udah aktif. Siap kelola usaha dengan lebih rapi?</p>
        </div>
      ),
      placement: 'center',
      disableBeacon: true,
    },
    {
      target: '[data-tour="business-income-btn"]',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Record Business Income</h3>
          <p className="text-sm">Klik tombol 'Record Business Income' buat catat pemasukan dari penjualan atau jasa. Yuk, mulai disiplin nyatet!</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="business-expense-btn"]',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Record Business Expense</h3>
          <p className="text-sm">Pencatatan gak lengkap kalau cuma pemasukan. Klik 'Record Business Expense' buat masukin pengeluaran usaha kamu.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="finance-reports"]',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">View Financial Reports</h3>
          <p className="text-sm">Cek semua performa usaha kamu di halaman Laporan Keuangan. Gak perlu ribet, tinggal lihat grafiknya!</p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="invoices-menu"]',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Create Invoices</h3>
          <p className="text-sm">Klik di menu Buat Invoice untuk ngeluarin tagihan profesional ke pelanggan kamu. Simpel, cepat, dan bisa langsung dikirim!</p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: '[data-tour="pricing-calculator"]',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Use the Pricing Calculator</h3>
          <p className="text-sm">Kalkulator harga bisa bantu kamu nentuin harga jual yang ideal. Gak ada lagi jual rugi!</p>
        </div>
      ),
      placement: 'right',
    },
    {
      target: 'body',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">You're all set! 🎉</h3>
          <p className="text-sm">Siap jadi entrepreneur yang rapi dan keren? Semua fitur udah aktif. Let's go!</p>
        </div>
      ),
      placement: 'center',
    },
  ];

  useEffect(() => {
    if (!isLoading && user && isPremium) {
      if (forceStart) {
        console.log('EntrepreneurOnboardingTour: Force starting entrepreneur onboarding tour');
        setRunTour(true);
      } else if (!loading) {
        if (needsEntrepreneurOnboarding) {
          console.log('EntrepreneurOnboardingTour: Starting entrepreneur onboarding tour for user');
          // Add a delay to ensure DOM elements are rendered
          setTimeout(() => {
            setRunTour(true);
          }, 1500);
        } else {
          console.log('EntrepreneurOnboardingTour: User has already completed entrepreneur onboarding');
        }
      }
    }
  }, [user, isLoading, isPremium, forceStart, needsEntrepreneurOnboarding, loading]);

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status, action } = data;
    
    console.log('EntrepreneurOnboardingTour: Joyride callback:', { status, action });

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      console.log('EntrepreneurOnboardingTour: Onboarding completed or skipped, saving progress...');
      
      const success = await markEntrepreneurOnboardingComplete();
      
      if (success) {
        console.log('EntrepreneurOnboardingTour: Successfully saved entrepreneur onboarding completion');
        toast({
          title: "Siap jadi entrepreneur! 🎉",
          description: "Semua fitur entrepreneur mode udah aktif. Selamat berbisnis!",
        });
      } else {
        console.error('EntrepreneurOnboardingTour: Failed to save entrepreneur onboarding progress');
        toast({
          title: "Onboarding selesai! 🎉",
          description: "Meski ada sedikit masalah teknis, kamu tetap bisa lanjut pakai fitur entrepreneur!",
          variant: "default",
        });
      }
      
      setRunTour(false);
      onComplete?.();
    }
  };

  // Don't render anything while checking auth or onboarding status
  if (isLoading || loading || !isPremium) {
    return null;
  }

  // Don't render if tour shouldn't run
  if (!runTour) {
    return null;
  }

  return (
    <Joyride
      steps={steps}
      run={runTour}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#f59e0b',
          backgroundColor: '#ffffff',
          textColor: '#374151',
          overlayColor: 'rgba(0, 0, 0, 0.4)',
          arrowColor: '#ffffff',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: 12,
          fontSize: 14,
        },
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonNext: {
          backgroundColor: '#f59e0b',
          borderRadius: 8,
          padding: '8px 16px',
          fontSize: 14,
          fontWeight: 600,
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: 10,
        },
        buttonSkip: {
          color: '#6b7280',
          fontSize: 14,
        },
      }}
      locale={{
        back: 'Kembali',
        close: 'Tutup',
        last: 'Selesai',
        next: 'Lanjut',
        skip: 'Lewati',
      }}
    />
  );
};

export default EntrepreneurOnboardingTour;
