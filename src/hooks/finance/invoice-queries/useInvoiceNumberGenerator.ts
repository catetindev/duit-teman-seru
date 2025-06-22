
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useInvoiceNumberGenerator = () => {
  const { user } = useAuth();

  const generateInvoiceNumber = async () => {
    try {
      if (!user?.id) {
        console.log('No user ID, generating fallback invoice number');
        return `INV-${Date.now()}`;
      }
      
      console.log('Fetching existing invoices for user:', user.id);
      const { data: existingInvoices, error } = await supabase
        .from('invoices')
        .select('invoice_number')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching existing invoices:', error);
        return `INV-${Date.now()}`;
      }

      const currentDate = new Date();
      const year = currentDate.getFullYear().toString().slice(-2);
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

      let nextNumber = 1;
      if (existingInvoices && existingInvoices.length > 0) {
        const lastInvoice = existingInvoices[0];
        console.log('Last invoice:', lastInvoice);
        const match = lastInvoice.invoice_number.match(/INV-(\d{2})(\d{2})-(\d{4})/);
        if (match) {
          const lastNumber = parseInt(match[3]);
          nextNumber = lastNumber + 1;
        }
      }

      const invoiceNumber = `INV-${year}${month}-${nextNumber.toString().padStart(4, '0')}`;
      console.log('Generated invoice number:', invoiceNumber);
      return invoiceNumber;
    } catch (error) {
      console.error('Error generating invoice number:', error);
      return `INV-${Date.now()}`;
    }
  };

  return { generateInvoiceNumber };
};
