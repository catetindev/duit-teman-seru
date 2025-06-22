
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

          const formItems = parsedItems.map((item: any) => ({
            description: item.name || item.description || '',
            quantity: item.quantity || 1,
            price: item.unit_price || item.price || 0,
            total: item.total || 0
          }));

          form.reset({
            invoice_number: invoice.invoice_number,
            customer_id: invoice.customer_id,
            items: formItems.length > 0 ? formItems : [{ description: '', quantity: 1, price: 0, total: 0 }],
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
          
          form.setValue('invoice_number', newInvoiceNumber || `INV-${Date.now().toString().slice(-6)}`);
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
