import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OnboardingTourProps {
  onComplete?: () => void;
  forceStart?: boolean;
}

const OnboardingTour = ({ onComplete, forceStart = false }: OnboardingTourProps) => {
  const [runTour, setRunTour] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

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
        console.log('Force starting onboarding tour');
        setRunTour(true);
        setIsChecking(false);
      } else {
        checkOnboardingStatus();
      }
    } else if (!isLoading && !user) {
      setIsChecking(false);
    }
  }, [user, isLoading, forceStart]);

  const checkOnboardingStatus = async () => {
    if (!user) {
      setIsChecking(false);
      return;
    }

    try {
      console.log('Checking onboarding status for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking onboarding status:', error);
        setIsChecking(false);
        return;
      }

      console.log('Onboarding status data:', data);

      // If no profile exists or onboarding not completed, start the tour
      const shouldStartTour = !data || !data.onboarding_completed;
      
      if (shouldStartTour) {
        console.log('Starting onboarding tour for new user');
        // Add a delay to ensure DOM elements are rendered
        setTimeout(() => {
          setRunTour(true);
          setIsChecking(false);
        }, 1500);
      } else {
        console.log('User has already completed onboarding');
        setIsChecking(false);
      }
    } catch (error) {
      console.error('Error in checkOnboardingStatus:', error);
      setIsChecking(false);
    }
  };

  const markOnboardingCompleted = async () => {
    if (!user) return;

    try {
      console.log('Marking onboarding as completed for user:', user.id);
      
      const { error } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating onboarding status:', error);
        toast({
          title: "Error",
          description: "Failed to save onboarding progress",
          variant: "destructive",
        });
      } else {
        console.log('Onboarding marked as completed successfully');
        toast({
          title: "Sip, kamu udah siap pake Catatyo! 🎉",
          description: "Cuanmu, aturanmu. Selamat mengelola keuangan!",
        });
      }
    } catch (error) {
      console.error('Error updating onboarding status:', error);
    }
  };

  const handleJoyrideCallback = async (data: CallBackProps) => {
    const { status, action } = data;
    
    console.log('Joyride callback:', { status, action });

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      await markOnboardingCompleted();
      setRunTour(false);
      onComplete?.();
    }
  };

  // Don't render anything while checking or if tour shouldn't run
  if (isChecking || !runTour) {
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
