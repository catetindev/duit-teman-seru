
import React from 'react';
import BrandingSettings from './BrandingSettings';

const BrandingTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Branding Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize your application's branding elements including logo and background images.
        </p>
      </div>
      
      <BrandingSettings />
    </div>
  );
};

export default BrandingTab;
