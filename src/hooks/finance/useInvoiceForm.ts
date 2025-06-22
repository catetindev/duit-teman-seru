
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
    console.log('=== INVOICE FORM SUBMISSION ===');
    console.log('Raw form data:', data);

    if (!user?.id) {
      console.error('No user ID found');
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive'
      });
      return;
    }

    if (!data.customer_id) {
      toast({
        title: 'Error',
        description: 'Please select a customer',
        variant: 'destructive'
      });
      return;
    }

    const validItems = data.items.filter(item => 
      item.name && 
      item.name.trim() && 
      item.quantity > 0 && 
      item.unit_price >= 0
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

      // Transform items to match database structure - use unit_price not price
      const transformedItems = validItems.map(item => ({
        name: item.name,
        description: item.description || item.name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.total
      }));

      console.log('Transformed items:', transformedItems);

      // Prepare invoice data for database
      const invoiceData = {
        invoice_number: data.invoice_number,
        customer_id: data.customer_id,
        items: transformedItems,
        subtotal: data.subtotal,
        tax: data.tax || 0,
        discount: data.discount || 0,
        total: data.total,
        payment_due_date: data.payment_due_date.toISOString(),
        status: data.status || 'Unpaid',
        payment_method: data.payment_method,
        payment_proof_url: null,
        notes: data.notes || null
      };

      console.log('Final invoice data for submission:', invoiceData);

      if (invoice?.id) {
        console.log('Updating existing invoice:', invoice.id);
        await updateInvoice({ ...invoiceData, id: invoice.id });
        toast({
          title: 'Success',
          description: 'Invoice updated successfully'
        });
      } else {
        console.log('Creating new invoice');
        await addInvoice(invoiceData);
        toast({
          title: 'Success',
          description: 'Invoice created successfully'
        });
      }

      console.log('Invoice operation completed successfully');
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('=== INVOICE SUBMISSION ERROR ===');
      console.error('Error details:', error);
      
      toast({
        title: 'Error',
        description: error.message || 'Failed to save invoice. Please try again.',
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
