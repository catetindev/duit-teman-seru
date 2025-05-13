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

// Define an interface for the user_settings table including our custom_settings column
interface UserSettings {
  id: string;
  user_id: string;
  preferred_currency: string;
  preferred_language: string;
  custom_settings?: string; // JSON stored as string
  created_at: string;
  updated_at: string;
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
        // Check if the user has custom settings
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(); // Use maybeSingle() to handle cases where no row is found

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine here
          console.error('Error loading user settings:', error);
          throw error;
        }
        
        if (data && data.custom_settings) {
          const customSettings = JSON.parse(data.custom_settings as string);
          const settings = customSettings?.invoice_settings;
            
          if (settings) {
            setLogoUrl(settings.logoUrl || null);
            setShowLogo(settings.showLogo !== undefined ? settings.showLogo : true);
            setBusinessName(settings.businessName || 'Nama Bisnis Anda');
          }
        } else {
          // No settings found, use defaults or initialize if needed
          console.log('No user_settings found for user, using default invoice preferences.');
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
      const { data: existingSettings, error: checkError } = await supabase
        .from('user_settings')
        .select('custom_settings')
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let customSettings: Record<string, any> = {};
      if (existingSettings?.custom_settings) {
        try {
          customSettings = JSON.parse(existingSettings.custom_settings as string);
        } catch (e) {
          console.warn('Failed to parse existing custom_settings, creating new object');
        }
      }

      customSettings = {
        ...customSettings,
        invoice_settings: {
          logoUrl,
          showLogo,
          businessName
        }
      };
      
      // Upsert user_settings: update if exists, insert if not
      const { error: upsertError } = await supabase
        .from('user_settings')
        .upsert({ 
          user_id: user.id, 
          custom_settings: JSON.stringify(customSettings),
          // Provide default values for other required fields if inserting
          preferred_currency: existingSettings?.preferred_currency || 'IDR', 
          preferred_language: existingSettings?.preferred_language || 'id',
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' });


      if (upsertError) throw upsertError;
    } catch (error) {
      console.error('Error saving invoice preferences:', error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      savePreferences();
    }
  }, [logoUrl, showLogo, businessName, user?.id]);

  const uploadLogo = async (file: File) => {
    if (!user?.id || !file) return;
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `invoice-logos/${fileName}`;
      const { error: uploadError } = await supabase
        .storage
        .from('logos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      if (uploadError) throw uploadError;
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

  const removeLogo = async () => {
    if (!logoUrl || !user?.id) return;
    try {
      const urlParts = logoUrl.split('/');
      const filePath = urlParts.slice(-2).join('/');
      await supabase
        .storage
        .from('logos')
        .remove([filePath]);
      setLogoUrl(null);
    } catch (error) {
      console.error('Error removing logo:', error);
    }
  };

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