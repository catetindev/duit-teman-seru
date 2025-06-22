
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Invoice } from '@/types/finance';
import { InvoiceFormData } from '@/components/finance/invoices/form/invoiceFormSchema';
import { useToast } from '@/hooks/use-toast';

interface UseInvoiceFormInitializationProps {
  form: UseFormReturn<InvoiceFormData>;
  invoice?: Invoice | null;
  generateInvoiceNumber: () => Promise<string>;
  setTaxRate: (rate: number) => void;
  setDiscountAmount: (amount: number) => void;
}

export function useInvoiceFormInitialization({
  form,
  invoice,
  generateInvoiceNumber,
  setTaxRate,
  setDiscountAmount
}: UseInvoiceFormInitializationProps) {
  const { toast } = useToast();

  useEffect(() => {
    const initializeForm = async () => {
      try {
        if (invoice) {
          console.log('Loading existing invoice:', invoice);
          
          let parsedItems = [];
          try {
            if (typeof invoice.items === 'string') {
              parsedItems = JSON.parse(invoice.items);
            } else if (Array.isArray(invoice.items)) {
              parsedItems = invoice.items;
            }
          } catch (error) {
            console.error('Error parsing invoice items:', error);
            parsedItems = [];
          }

          // Ensure items have the correct field names for database compatibility
          const formItems = parsedItems.map((item: any) => ({
            name: item.name || item.description || '',
            description: item.description || item.name || '',
            quantity: Number(item.quantity) || 1,
            unit_price: Number(item.unit_price || item.price) || 0,
            total: Number(item.total) || 0
          }));

          console.log('Formatted items for form:', formItems);

          form.reset({
            invoice_number: invoice.invoice_number,
            customer_id: invoice.customer_id,
            items: formItems.length > 0 ? formItems : [{ name: '', description: '', quantity: 1, unit_price: 0, total: 0 }],
            subtotal: Number(invoice.subtotal) || 0,
            tax: Number(invoice.tax) || 0,
            discount: Number(invoice.discount) || 0,
            total: Number(invoice.total) || 0,
            payment_due_date: new Date(invoice.payment_due_date),
            status: invoice.status as 'Unpaid' | 'Paid' | 'Overdue',
            payment_method: invoice.payment_method || 'Cash',
            notes: invoice.notes || ''
          });
          
          if (Number(invoice.subtotal) > 0) {
            setTaxRate((Number(invoice.tax) / Number(invoice.subtotal)) * 100);
          }
          setDiscountAmount(Number(invoice.discount) || 0);
        } else {
          console.log('Generating new invoice number...');
          const newInvoiceNumber = await generateInvoiceNumber();
          console.log('Generated invoice number:', newInvoiceNumber);
          
          // Initialize with proper default values for new invoice
          form.reset({
            invoice_number: newInvoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
            customer_id: '',
            items: [{ name: '', description: '', quantity: 1, unit_price: 0, total: 0 }],
            subtotal: 0,
            tax: 0,
            discount: 0,
            total: 0,
            payment_due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'Unpaid',
            payment_method: 'Cash',
            notes: ''
          });
        }
      } catch (error) {
        console.error('Error initializing form:', error);
        toast({
          title: 'Error',
          description: 'Failed to initialize invoice form',
          variant: 'destructive'
        });
      }
    };

    initializeForm();
  }, [invoice, form, generateInvoiceNumber, setTaxRate, setDiscountAmount, toast]);
}
