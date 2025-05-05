
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useBrandingAssets } from '@/hooks/useBrandingAssets';
import { ImagePreview } from './branding/ImagePreview';
import { ImageUploader } from './branding/ImageUploader';

const BrandingTab = () => {
  const { toast } = useToast();
  const { logoUrl, backgroundUrl, isLoading } = useBrandingAssets();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isBucketCreated, setIsBucketCreated] = useState(false);

  // Check if branding bucket exists on component mount
  useEffect(() => {
    const checkBucket = async () => {
      try {
        const { data, error } = await supabase.storage.getBucket('branding');
        if (error && error.message.includes('not found')) {
          setIsBucketCreated(false);
        } else {
          setIsBucketCreated(true);
        }
      } catch (error) {
        console.error("Error checking bucket:", error);
        setIsBucketCreated(false);
      }
    };
    
    checkBucket();
  }, []);

  const createBrandingBucket = async () => {
    try {
      setIsUploading(true);
      const { data, error } = await supabase.storage.createBucket('branding', {
        public: true,
        fileSizeLimit: 5242880 // 5MB limit
      });
      
      if (error) throw error;
      
      setIsBucketCreated(true);
      toast({
        title: "Storage bucket created",
        description: "The branding storage bucket has been successfully created"
      });
    } catch (error: any) {
      toast({
        title: "Failed to create storage bucket",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

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
    if (!isBucketCreated) {
      toast({
        title: "Storage bucket not created",
        description: "Please create the branding bucket first",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Upload logo if selected
      if (logoFile) {
        const { error: logoError } = await supabase.storage
          .from('branding')
          .upload('logo.png', logoFile, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (logoError) {
          throw new Error(`Error uploading logo: ${logoError.message}`);
        }
      }
      
      // Upload background if selected
      if (backgroundFile) {
        const { error: bgError } = await supabase.storage
          .from('branding')
          .upload('background.jpg', backgroundFile, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (bgError) {
          throw new Error(`Error uploading background: ${bgError.message}`);
        }
      }
      
      toast({
        title: "Branding updated successfully",
        description: "Your changes have been saved and will be reflected throughout the app",
      });
      
      // Dispatch a custom event to notify all components that branding has been updated
      window.dispatchEvent(new CustomEvent('branding-updated'));
      
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
      
      {!isBucketCreated && (
        <Card className="border-dashed border-2 border-orange-300 bg-orange-50 dark:bg-orange-950/20">
          <CardHeader>
            <CardTitle>Storage Setup Required</CardTitle>
            <CardDescription>
              You need to create a storage bucket for branding assets before uploading images.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={createBrandingBucket} 
              disabled={isUploading} 
              className="w-full"
            >
              {isUploading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent mr-2"></span>
                  Creating Bucket...
                </>
              ) : (
                "Create Branding Bucket"
              )}
            </Button>
          </CardContent>
        </Card>
      )}
      
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
          disabled={isUploading || (!logoFile && !backgroundFile) || !isBucketCreated} 
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
