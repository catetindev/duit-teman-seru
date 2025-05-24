
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';

const OnboardingSection = () => {
  const { restartOnboarding } = useOnboarding();

  const handleRestartTour = () => {
    restartOnboarding();
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
        <Button onClick={handleRestartTour} variant="outline" className="w-full">
          Mulai Tur Panduan
        </Button>
      </CardContent>
    </Card>
  );
};

export default OnboardingSection;
