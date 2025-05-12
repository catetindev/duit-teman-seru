
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface InvoiceCustomization {
  logoUrl: string | null;
  showLogo: boolean;
  businessName: string;
  uploading: boolean;
  uploadLogo: (file: File) => Promise<void>;
  removeLogo: () => Promise<void>;
  toggleShowLogo: () => void;
  setBusinessName: (name: string) => void;
}

const defaultCustomization: InvoiceCustomization = {
  logoUrl: null,
  showLogo: true,
  businessName: 'Nama Bisnis Anda',
  uploading: false,
  uploadLogo: async () => {},
  removeLogo: async () => {},
  toggleShowLogo: () => {},
  setBusinessName: () => {},
};

const InvoiceCustomizationContext = createContext<InvoiceCustomization>(defaultCustomization);

export const useInvoiceCustomization = () => useContext(InvoiceCustomizationContext);

export function InvoiceCustomizationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [showLogo, setShowLogo] = useState<boolean>(true);
  const [businessName, setBusinessName] = useState<string>('Nama Bisnis Anda');
  const [uploading, setUploading] = useState<boolean>(false);

  // Load saved preferences when user changes
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) return;

      try {
        // Load business settings from user_settings or dedicated table
        const { data, error } = await supabase
          .from('user_settings')
          .select('invoice_settings')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        
        if (data?.invoice_settings) {
          const settings = data.invoice_settings;
          setLogoUrl(settings.logoUrl || null);
          setShowLogo(settings.showLogo !== undefined ? settings.showLogo : true);
          setBusinessName(settings.businessName || 'Nama Bisnis Anda');
        }
      } catch (error) {
        console.error('Error loading invoice preferences:', error);
      }
    };

    loadPreferences();
  }, [user]);

  // Save preferences when they change
  const savePreferences = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .update({
          invoice_settings: {
            logoUrl,
            showLogo,
            businessName
          }
        })
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving invoice preferences:', error);
    }
  };

  // Save preferences whenever they change
  useEffect(() => {
    if (user?.id) {
      savePreferences();
    }
  }, [logoUrl, showLogo, businessName, user?.id]);

  // Upload logo to storage
  const uploadLogo = async (file: File) => {
    if (!user?.id || !file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `invoice-logos/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase
        .storage
        .from('logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase
        .storage
        .from('logos')
        .getPublicUrl(filePath);

      setLogoUrl(data.publicUrl);
    } catch (error) {
      console.error('Error uploading logo:', error);
    } finally {
      setUploading(false);
    }
  };

  // Remove logo
  const removeLogo = async () => {
    if (!logoUrl || !user?.id) return;

    try {
      // Extract file path from URL
      const urlParts = logoUrl.split('/');
      const filePath = urlParts.slice(-2).join('/'); // Get "logos/filename" part

      // Delete from storage
      await supabase
        .storage
        .from('logos')
        .remove([filePath]);

      setLogoUrl(null);
    } catch (error) {
      console.error('Error removing logo:', error);
    }
  };

  // Toggle logo visibility
  const toggleShowLogo = () => {
    setShowLogo(!showLogo);
  };

  const value = {
    logoUrl,
    showLogo,
    businessName,
    uploading,
    uploadLogo,
    removeLogo,
    toggleShowLogo,
    setBusinessName,
  };

  return (
    <InvoiceCustomizationContext.Provider value={value}>
      {children}
    </InvoiceCustomizationContext.Provider>
  );
}
