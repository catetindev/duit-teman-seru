
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePayment = () => {
  const { user, profile, session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const createPayment = async (billingCycle: 'monthly' | 'yearly') => {
    if (!user || !session) {
      toast.error('Please login to continue with payment');
      return { success: false, error: 'User not authenticated' };
    }

    setIsLoading(true);
    
    try {
      // Call our Supabase Edge Function to create the payment
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: {
          user: {
            id: user.id,
            email: user.email,
            fullName: profile?.full_name || user.email,
          },
          billingCycle,
          redirectUrl: `${window.location.origin}/dashboard`,
        }
      });

      if (error) {
        console.error('Payment creation error:', error);
        toast.error('Failed to initiate payment. Please try again.');
        return { success: false, error };
      }

      if (!data || !data.payment_url) {
        toast.error('Payment link generation failed');
        return { success: false, error: 'No payment URL returned' };
      }

      return { 
        success: true, 
        paymentUrl: data.payment_url,
        referenceId: data.reference_id
      };
    } catch (err) {
      console.error('Payment creation error:', err);
      toast.error('There was a problem with payment initialization');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    createPayment,
    isLoading
  };
};
