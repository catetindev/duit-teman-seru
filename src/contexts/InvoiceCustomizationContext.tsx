
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface InvoiceCustomizationContextType {
  logoUrl: string | null;
  showLogo: boolean;
  businessName: string;
  uploading: boolean;
  uploadLogo: (file: File) => Promise<void>;
  removeLogo: () => Promise<void>;
  toggleShowLogo: (show: boolean) => void;
  setBusinessName: (name: string) => void;
}

const InvoiceCustomizationContext = createContext<InvoiceCustomizationContextType | undefined>(undefined);

export function InvoiceCustomizationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [showLogo, setShowLogo] = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [uploading, setUploading] = useState(false);

  // Load saved settings
  useEffect(() => {
    if (user?.id) {
      loadSettings();
    }
  }, [user?.id]);

  const loadSettings = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('invoice_logo_url, show_invoice_logo, business_name')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        return;
      }

      if (data) {
        setLogoUrl(data.invoice_logo_url);
        setShowLogo(data.show_invoice_logo ?? true);
        setBusinessName(data.business_name || '');
      }
    } catch (error) {
      console.error('Error loading invoice settings:', error);
    }
  };

  const uploadLogo = async (file: File) => {
    if (!user?.id) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/invoice-logo.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('invoice-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('invoice-logos')
        .getPublicUrl(fileName);

      setLogoUrl(publicUrl);

      // Save to user settings
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          invoice_logo_url: publicUrl,
          show_invoice_logo: showLogo,
          business_name: businessName
        });

      toast({
        title: 'Success',
        description: 'Logo uploaded successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = async () => {
    if (!user?.id || !logoUrl) return;

    try {
      setLogoUrl(null);

      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          invoice_logo_url: null,
          show_invoice_logo: showLogo,
          business_name: businessName
        });

      toast({
        title: 'Success',
        description: 'Logo removed successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const toggleShowLogo = async (show: boolean) => {
    if (!user?.id) return;

    setShowLogo(show);

    try {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          invoice_logo_url: logoUrl,
          show_invoice_logo: show,
          business_name: businessName
        });
    } catch (error: any) {
      console.error('Error updating logo visibility:', error);
    }
  };

  const updateBusinessName = async (name: string) => {
    if (!user?.id) return;

    setBusinessName(name);

    try {
      await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          invoice_logo_url: logoUrl,
          show_invoice_logo: showLogo,
          business_name: name
        });
    } catch (error: any) {
      console.error('Error updating business name:', error);
    }
  };

  return (
    <InvoiceCustomizationContext.Provider
      value={{
        logoUrl,
        showLogo,
        businessName,
        uploading,
        uploadLogo,
        removeLogo,
        toggleShowLogo,
        setBusinessName: updateBusinessName
      }}
    >
      {children}
    </InvoiceCustomizationContext.Provider>
  );
}

export function useInvoiceCustomization() {
  const context = useContext(InvoiceCustomizationContext);
  if (!context) {
    throw new Error('useInvoiceCustomization must be used within InvoiceCustomizationProvider');
  }
  return context;
}
