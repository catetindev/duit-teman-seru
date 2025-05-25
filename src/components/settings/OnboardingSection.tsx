
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, Loader2 } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const OnboardingSection = () => {
  const { restartOnboarding } = useOnboarding();
  const [isRestarting, setIsRestarting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRestartTour = async () => {
    setIsRestarting(true);
    
    try {
      console.log('OnboardingSection: Restarting onboarding tour...');
      const success = await restartOnboarding();
      
      if (success) {
        console.log('OnboardingSection: Successfully restarted onboarding');
        toast({
          title: "Tur panduan diaktifkan! 🎯",
          description: "Kembali ke dashboard untuk melihat panduan",
        });
        
        // Navigate to dashboard to trigger the onboarding
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        console.error('OnboardingSection: Failed to restart onboarding');
        toast({
          title: "Gagal mengaktifkan tur",
          description: "Silakan coba lagi dalam beberapa saat",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('OnboardingSection: Error restarting onboarding:', error);
      toast({
        title: "Terjadi kesalahan",
        description: "Silakan coba lagi dalam beberapa saat",
        variant: "destructive",
      });
    } finally {
      setIsRestarting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlayCircle className="h-5 w-5" />
          Panduan Aplikasi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">
          Ingin melihat panduan cara menggunakan Catatyo lagi? Klik tombol di bawah untuk memulai tur panduan.
        </p>
        <Button 
          onClick={handleRestartTour} 
          variant="outline" 
          className="w-full"
          disabled={isRestarting}
        >
          {isRestarting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Mengaktifkan...
            </>
          ) : (
            "Mulai Tur Panduan"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default OnboardingSection;
