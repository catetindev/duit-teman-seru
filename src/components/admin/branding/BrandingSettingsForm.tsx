
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUploader from './FileUploader';

const BrandingSettingsForm = () => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [currentBackground, setCurrentBackground] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch current branding assets on component mount
  useEffect(() => {
    const fetchBrandingAssets = async () => {
      try {
        // Check if logo exists
        const { data: logoData } = await supabase.storage
          .from('branding')
          .getPublicUrl('logo.png');
          
        if (logoData) {
          // Add a timestamp to prevent caching
          setCurrentLogo(`${logoData.publicUrl}?t=${Date.now()}`);
        }
        
        // Check if background exists
        const { data: backgroundData } = await supabase.storage
          .from('branding')
          .getPublicUrl('background.jpg');
          
        if (backgroundData) {
          // Add a timestamp to prevent caching
          setCurrentBackground(`${backgroundData.publicUrl}?t=${Date.now()}`);
        }
      } catch (error) {
        console.error('Error fetching branding assets:', error);
      }
    };
    
    fetchBrandingAssets();
  }, []);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setLogoFile(null);
      setLogoPreview(null);
      return;
    }

    const file = e.target.files[0];
    
    // Validate file format (SVG or PNG)
    if (!['image/svg+xml', 'image/png'].includes(file.type)) {
      toast.error('Logo must be SVG or PNG format');
      return;
    }
    
    // Validate file size (max 1MB)
    if (file.size > 1024 * 1024) {
      toast.error('Logo must be less than 1MB');
      return;
    }
    
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setBackgroundFile(null);
      setBackgroundPreview(null);
      return;
    }

    const file = e.target.files[0];
    
    // Validate file format (JPG or PNG)
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Background must be JPG or PNG format');
      return;
    }
    
    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Background must be less than 2MB');
      return;
    }
    
    setBackgroundFile(file);
    setBackgroundPreview(URL.createObjectURL(file));
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleRemoveBackground = () => {
    setBackgroundFile(null);
    setBackgroundPreview(null);
  };

  const handleSaveBranding = async () => {
    setLoading(true);
    
    try {
      // Upload logo if provided
      if (logoFile) {
        const { error: logoError } = await supabase.storage
          .from('branding')
          .upload('logo.png', logoFile, {
            contentType: logoFile.type,
            upsert: true
          });
          
        if (logoError) throw logoError;
        
        // Get the public URL for the uploaded logo
        const { data: logoData } = await supabase.storage
          .from('branding')
          .getPublicUrl('logo.png');
          
        setCurrentLogo(`${logoData.publicUrl}?t=${Date.now()}`);
      }
      
      // Upload background if provided
      if (backgroundFile) {
        const { error: bgError } = await supabase.storage
          .from('branding')
          .upload('background.jpg', backgroundFile, {
            contentType: backgroundFile.type,
            upsert: true
          });
          
        if (bgError) throw bgError;
        
        // Get the public URL for the uploaded background
        const { data: bgData } = await supabase.storage
          .from('branding')
          .getPublicUrl('background.jpg');
          
        setCurrentBackground(`${bgData.publicUrl}?t=${Date.now()}`);
      }
      
      toast.success('Branding settings updated successfully');
      
      // Reset file selections
      setLogoFile(null);
      setBackgroundFile(null);
      setLogoPreview(null);
      setBackgroundPreview(null);
    } catch (error: any) {
      console.error('Error updating branding:', error);
      toast.error(`Error updating branding: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Tabs defaultValue="logo" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="logo">Logo</TabsTrigger>
          <TabsTrigger value="background">Background</TabsTrigger>
        </TabsList>
        
        <TabsContent value="logo" className="space-y-4">
          <FileUploader
            id="logoUpload"
            label="Upload Logo (SVG or PNG format, max 1MB)"
            accept=".svg,.png"
            onChange={handleLogoChange}
            previewUrl={logoPreview}
            currentUrl={currentLogo}
            filePreview={logoPreview}
            onRemovePreview={handleRemoveLogo}
            type="logo"
          />
        </TabsContent>
        
        <TabsContent value="background" className="space-y-4">
          <FileUploader
            id="backgroundUpload"
            label="Upload Login/Signup Background (JPG or PNG format, max 2MB)"
            accept=".jpg,.jpeg,.png"
            onChange={handleBackgroundChange}
            previewUrl={backgroundPreview}
            currentUrl={currentBackground}
            filePreview={backgroundPreview}
            onRemovePreview={handleRemoveBackground}
            type="background"
          />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end border-t p-4 mt-4">
        <Button 
          onClick={handleSaveBranding}
          disabled={loading || (!logoFile && !backgroundFile)}
          className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600"
        >
          {loading ? (
            <>
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-r-transparent mr-2"></span>
              Saving...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Save Branding Settings
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default BrandingSettingsForm;
