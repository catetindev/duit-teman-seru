
import { useEffect } from 'react';
import { Customer, Product } from '@/types/entrepreneur';
import { Invoice } from '@/types/finance';
import { InvoiceFormData } from '@/components/finance/invoices/form/invoiceFormSchema';
import { useInvoices } from '@/hooks/finance/useInvoices';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useInvoiceFormState } from './invoice-form/useInvoiceFormState';
import { useInvoiceFormCalculations } from './invoice-form/useInvoiceFormCalculations';
import { useInvoiceFormInitialization } from './invoice-form/useInvoiceFormInitialization';
import { useInvoiceFormOperations } from './invoice-form/useInvoiceFormOperations';

interface UseInvoiceFormProps {
  customers: Customer[];
  products: Product[];
  invoice?: Invoice | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function useInvoiceForm({
  customers: initialCustomers,
  products,
  invoice,
  onSuccess,
  onClose
}: UseInvoiceFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { generateInvoiceNumber, addInvoice, updateInvoice } = useInvoices();

  const {
    form,
    fields,
    loading,
    setLoading,
    taxRate,
    setTaxRate,
    discountAmount,
    setDiscountAmount,
    append,
    remove
  } = useInvoiceFormState();

  const { calculateItemTotal, calculateTotals } = useInvoiceFormCalculations({
    form,
    taxRate,
    discountAmount
  });

  const {
    customers,
    setCustomers,
    refreshCustomers,
    addProduct,
    addEmptyItem
  } = useInvoiceFormOperations({
    form,
    append,
    products,
    calculateTotals
  });

  useInvoiceFormInitialization({
    form,
    invoice,
    generateInvoiceNumber,
    setTaxRate,
    setDiscountAmount
  });

  // Initialize customers
  useEffect(() => {
    setCustomers(initialCustomers);
  }, [initialCustomers, setCustomers]);

  const onSubmit = async (data: InvoiceFormData) => {
    console.log('=== INVOICE FORM SUBMISSION START ===');
    console.log('User ID:', user?.id);
    console.log('Form data received:', data);

    if (!user?.id) {
      console.error('User not authenticated');
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    
    try {
      // Validate required fields
      console.log('Validating form data...');
      
      if (!data.customer_id) {
        throw new Error('Please select a customer');
      }

      const validItems = data.items.filter(item => 
        item.description && 
        item.description.trim() && 
        item.quantity > 0 && 
        item.price >= 0
      );

      console.log('Valid items found:', validItems.length);
      console.log('Valid items:', validItems);

      if (validItems.length === 0) {
        throw new Error('Please add at least one item with valid data');
      }

      // Prepare invoice data for database
      const invoiceData = {
        invoice_number: data.invoice_number,
        customer_id: data.customer_id,
        items: validItems.map(item => ({
          name: item.description,
          description: '',
          quantity: item.quantity,
          unit_price: item.price,
          total: item.total
        })),
        subtotal: data.subtotal,
        tax: data.tax || 0,
        discount: data.discount || 0,
        total: data.total,
        payment_due_date: data.payment_due_date.toISOString(),
        status: data.status || 'Unpaid',
        payment_method: data.payment_method || 'Cash',
        payment_proof_url: invoice?.payment_proof_url || null,
        notes: data.notes || null
      };

      console.log('Prepared invoice data for database:', invoiceData);

      // Submit to database
      if (invoice) {
        console.log('Updating existing invoice...');
        await updateInvoice({ ...invoiceData, id: invoice.id });
        toast({
          title: 'Success',
          description: 'Invoice updated successfully'
        });
      } else {
        console.log('Creating new invoice...');
        await addInvoice(invoiceData);
        toast({
          title: 'Success',
          description: 'Invoice created successfully'
        });
      }
      
      console.log('=== INVOICE SUBMISSION SUCCESS ===');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('=== INVOICE SUBMISSION ERROR ===');
      console.error('Error details:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save invoice',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    fields,
    customers,
    loading,
    taxRate,
    discountAmount,
    setTaxRate,
    setDiscountAmount,
    refreshCustomers,
    addProduct,
    addEmptyItem,
    calculateItemTotal,
    remove,
    onSubmit
  };
}
