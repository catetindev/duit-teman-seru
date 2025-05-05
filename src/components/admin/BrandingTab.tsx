import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useBrandingAssets } from '@/hooks/useBrandingAssets';

const BrandingTab = () => {
  const { toast } = useToast();
  const { logoUrl, backgroundUrl, isLoading } = useBrandingAssets();
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
      setBackgroundPreview(null);
      setBackgroundFile(null);
      setLogoPreview(null);
      
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
        <Card>
          <CardHeader>
            <CardTitle>Logo</CardTitle>
            <CardDescription>
              Upload your company logo (PNG or SVG). This will appear in the navbar, footer, and auth pages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 flex justify-center items-center bg-gray-50">
              {isLoading ? (
                <div className="animate-pulse w-40 h-20 bg-gray-200 rounded"></div>
              ) : logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt="Current logo" 
                  className="h-20 object-contain"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <ImageIcon size={48} />
                  <span>No logo uploaded</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Upload New Logo</Label>
              <div className="flex items-center space-x-2">
                <input
                  id="logo-upload"
                  type="file"
                  accept=".png,.svg"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" /> Choose File
                </Button>
                {logoFile && (
                  <span className="text-sm text-gray-600 truncate max-w-[150px]">
                    {logoFile.name}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Background Image</CardTitle>
            <CardDescription>
              Upload a background image (PNG or JPG) for login and signup pages.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4 flex justify-center items-center bg-gray-50 h-40 overflow-hidden">
              {isLoading ? (
                <div className="animate-pulse w-full h-full bg-gray-200 rounded"></div>
              ) : backgroundUrl ? (
                <img 
                  src={backgroundUrl} 
                  alt="Current background" 
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <ImageIcon size={48} />
                  <span>No background uploaded</span>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bg-upload">Upload New Background</Label>
              <div className="flex items-center space-x-2">
                <input
                  id="bg-upload"
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleBackgroundChange}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('bg-upload')?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" /> Choose File
                </Button>
                {backgroundFile && (
                  <span className="text-sm text-gray-600 truncate max-w-[150px]">
                    {backgroundFile.name}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
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
