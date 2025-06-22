
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
  const { generateInvoiceNumber, addInvoice, updateInvoice, isAdding, isUpdating } = useInvoices();

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
    console.log('=== FORM SUBMISSION START ===');
    console.log('Form data:', data);
    console.log('User:', user);

    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive'
      });
      return;
    }

    // Validate customer selection
    if (!data.customer_id) {
      toast({
        title: 'Error',
        description: 'Please select a customer',
        variant: 'destructive'
      });
      return;
    }

    // Validate items
    const validItems = data.items.filter(item => 
      item.description && 
      item.description.trim() && 
      item.quantity > 0 && 
      item.price >= 0
    );

    if (validItems.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one valid item',
        variant: 'destructive'
      });
      return;
    }

    try {
      setLoading(true);

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
        payment_method: data.payment_method,
        payment_proof_url: null, // Add missing field
        notes: data.notes || null
      };

      console.log('Submitting invoice data:', invoiceData);

      if (invoice?.id) {
        await updateInvoice({ ...invoiceData, id: invoice.id });
        toast({
          title: 'Success',
          description: 'Invoice updated successfully'
        });
      } else {
        await addInvoice(invoiceData);
        toast({
          title: 'Success',
          description: 'Invoice created successfully'
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Invoice submission error:', error);
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
    loading: loading || isAdding || isUpdating,
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
