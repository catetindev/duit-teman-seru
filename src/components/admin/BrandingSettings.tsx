
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Image } from 'lucide-react';
import BrandingSettingsForm from './branding/BrandingSettingsForm';

const BrandingSettings = () => {
  return (
    <Card className="border-none shadow-md rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          Branding Settings
        </CardTitle>
        <CardDescription>
          Customize your app's logo and background images
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <BrandingSettingsForm />
      </CardContent>
    </Card>
  );
};

export default BrandingSettings;
