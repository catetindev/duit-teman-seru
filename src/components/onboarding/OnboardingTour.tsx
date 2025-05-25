
import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useOnboarding } from '@/hooks/useOnboarding';

interface OnboardingTourProps {
  onComplete?: () => void;
  forceStart?: boolean;
}

const OnboardingTour = ({ onComplete, forceStart = false }: OnboardingTourProps) => {
  const [runTour, setRunTour] = useState(false);
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const { needsOnboarding, loading, markOnboardingComplete } = useOnboarding();

  const steps: Step[] = [
    {
      target: '[data-tour="dashboard-greeting"]',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Halo! 👋</h3>
          <p className="text-sm">Ini ringkasan keuanganmu. Yuk mulai kelola cuanmu dari sini 🚀</p>
        </div>
      ),
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '[data-tour="balance-card"]',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Saldo Saat Ini 💰</h3>
          <p className="text-sm">Ini total saldo gabungan dari semua transaksi yang kamu catat.</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="income-expense-cards"]',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Pemasukan & Pengeluaran 📊</h3>
          <p className="text-sm">Cek berapa pemasukan dan pengeluaranmu bulan ini. Harusnya sih lebih banyak masuk ya 😅</p>
        </div>
      ),
      placement: 'bottom',
    },
    {
      target: '[data-tour="add-transaction"]',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Tambah Transaksi ➕</h3>
          <p className="text-sm">Klik ini buat mulai catat pemasukan atau pengeluaran. Mudah kok!</p>
        </div>
      ),
      placement: 'left',
    },
    {
      target: '[data-tour="goals-section"]',
      content: (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Target Menabung 🎯</h3>
          <p className="text-sm">Punya tujuan finansial? Catat di sini biar makin semangat nabung 💰</p>
        </div>
      ),
      placement: 'left',
    },
  ];

  useEffect(() => {
    if (!isLoading && user) {
      if (forceStart) {
        console.log('OnboardingTour: Force starting onboarding tour');
        setRunTour(true);
      } else if (!loading) {
        if (needsOnboarding) {
          console.log('OnboardingTour: Starting onboarding tour for new user');
          // Add a delay to ensure DOM elements are rendered
          setTimeout(() => {
            setRunTour(true);
          }, 1500);
        } else {
          console.log('OnboardingTour: User has already completed onboarding');
        }
      }
    }
  }, [user, isLoading, forceStart, needsOnboarding, loading]);

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status, action } = data;
    
    console.log('OnboardingTour: Joyride callback:', { status, action });

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      console.log('OnboardingTour: Onboarding completed or skipped, saving progress...');
      
      const success = await markOnboardingComplete();
      
      if (success) {
        console.log('OnboardingTour: Successfully saved onboarding completion');
        toast({
          title: "Sip, kamu udah siap pake Catatyo! 🎉",
          description: "Cuanmu, aturanmu. Selamat mengelola keuangan!",
        });
      } else {
        console.error('OnboardingTour: Failed to save onboarding progress');
        toast({
          title: "Onboarding selesai! 🎉",
          description: "Meski ada sedikit masalah teknis, kamu tetap bisa lanjut pakai aplikasi!",
          variant: "default",
        });
      }
      
      setRunTour(false);
      onComplete?.();
    }
  };

  // Don't render anything while checking auth or onboarding status
  if (isLoading || loading) {
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
          primaryColor: '#8b5cf6',
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
          backgroundColor: '#8b5cf6',
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

export default OnboardingTour;
