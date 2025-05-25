
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Loader2 } from 'lucide-react';
import { useEntrepreneurOnboarding } from '@/hooks/useEntrepreneurOnboarding';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';

const EntrepreneurOnboardingSection = () => {
  const { restartEntrepreneurOnboarding } = useEntrepreneurOnboarding();
  const [isRestarting, setIsRestarting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isPremium } = useAuth();
  const { isEntrepreneurMode } = useEntrepreneurMode();

  const handleRestartTour = async () => {
    if (!isPremium) {
      toast({
        title: "Fitur Premium",
        description: "Mode entrepreneur hanya tersedia untuk pengguna premium",
        variant: "destructive",
      });
      return;
    }

    if (!isEntrepreneurMode) {
      toast({
        title: "Mode Entrepreneur Tidak Aktif",
        description: "Aktifkan mode entrepreneur terlebih dahulu untuk melihat panduan",
        variant: "destructive",
      });
      return;
    }

    setIsRestarting(true);
    
    try {
      console.log('EntrepreneurOnboardingSection: Restarting entrepreneur onboarding tour...');
      const success = await restartEntrepreneurOnboarding();
      
      if (success) {
        console.log('EntrepreneurOnboardingSection: Successfully restarted entrepreneur onboarding');
        toast({
          title: "Tur entrepreneur diaktifkan! 🚀",
          description: "Kembali ke dashboard untuk melihat panduan mode entrepreneur",
        });
        
        // Navigate to dashboard to trigger the onboarding
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        console.error('EntrepreneurOnboardingSection: Failed to restart entrepreneur onboarding');
        toast({
          title: "Gagal mengaktifkan tur",
          description: "Silakan coba lagi dalam beberapa saat",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('EntrepreneurOnboardingSection: Error restarting entrepreneur onboarding:', error);
      toast({
        title: "Terjadi kesalahan",
        description: "Silakan coba lagi dalam beberapa saat",
        variant: "destructive",
      });
    } finally {
      setIsRestarting(false);
    }
  };

  if (!isPremium) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Panduan Mode Entrepreneur
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Ingin melihat panduan cara menggunakan fitur entrepreneur mode lagi? Klik tombol di bawah untuk memulai tur panduan khusus entrepreneur.
        </p>
        <Button 
          onClick={handleRestartTour} 
          variant="outline" 
          className="w-full"
          disabled={isRestarting || !isEntrepreneurMode}
        >
          {isRestarting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengaktifkan...
            </>
          ) : (
            "Mulai Tur Panduan Entrepreneur"
          )}
        </Button>
        {!isEntrepreneurMode && (
          <p className="text-xs text-amber-600">
            * Aktifkan mode entrepreneur terlebih dahulu
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default EntrepreneurOnboardingSection;
