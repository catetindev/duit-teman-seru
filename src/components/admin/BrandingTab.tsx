
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBrandingAssets } from '@/hooks/useBrandingAssets';
import { ImagePreview } from './branding/ImagePreview';
import { ImageUploader } from './branding/ImageUploader';

const BrandingTab = () => {
  const { toast } = useToast();
  const { 
    logoUrl, 
    backgroundUrl, 
    isLoading, 
    uploadLogo, 
    uploadBackground 
  } = useBrandingAssets();
  
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/png', 'image/svg+xml'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PNG or SVG file for the logo",
          variant: "destructive"
        });
        return;
      }
      setLogoFile(file);
    }
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PNG or JPG file for the background",
          variant: "destructive"
        });
        return;
      }
      setBackgroundFile(file);
    }
  };

  const uploadBrandingAssets = async () => {
    setIsUploading(true);
    try {
      // Upload logo if selected
      if (logoFile) {
        await uploadLogo(logoFile);
      }
      
      // Upload background if selected
      if (backgroundFile) {
        await uploadBackground(backgroundFile);
      }
      
      toast({
        title: "Branding updated successfully",
        description: "Your changes have been saved and will be reflected throughout the app",
      });
      
      // Reset file selections
      setLogoFile(null);
      setBackgroundFile(null);
      
    } catch (error: any) {
      toast({
        title: "Error updating branding",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Branding Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize your application's branding elements including logo and background images.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ImageUploader 
          title="Logo" 
          description="Upload your company logo (PNG or SVG). This will appear in the navbar, footer, and auth pages."
          imageUrl={logoUrl}
          isLoading={isLoading}
          selectedFile={logoFile}
          onChange={handleLogoChange}
          fileTypes=".png,.svg"
          inputId="logo-upload"
        />
        
        <ImageUploader 
          title="Background Image" 
          description="Upload a background image (PNG or JPG) for login and signup pages."
          imageUrl={backgroundUrl}
          isLoading={isLoading}
          selectedFile={backgroundFile}
          onChange={handleBackgroundChange}
          fileTypes=".png,.jpg,.jpeg"
          inputId="bg-upload"
          className="h-40"
        />
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={uploadBrandingAssets} 
          disabled={isUploading || (!logoFile && !backgroundFile)} 
          className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600"
        >
          {isUploading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent"></span>
              Uploading...
            </>
          ) : (
            <>
              Save Branding Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BrandingTab;
