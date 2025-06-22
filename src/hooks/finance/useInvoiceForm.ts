
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceFormSchema, InvoiceFormData } from '@/components/finance/invoices/form/invoiceFormSchema';
import { Customer, Product } from '@/types/entrepreneur';
import { Invoice, InvoiceItem } from '@/types/finance';
import { useInvoices } from '@/hooks/finance/useInvoices';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

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
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [loading, setLoading] = useState(false);
  const [taxRate, setTaxRate] = useState(11);
  const [discountAmount, setDiscountAmount] = useState(0);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoice_number: '',
      customer_id: '',
      items: [{ description: '', quantity: 1, price: 0, total: 0 }],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      payment_due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'Unpaid',
      payment_method: 'Cash',
      notes: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  });

  useEffect(() => {
    const initializeForm = async () => {
      try {
        if (invoice) {
          // Edit mode - load existing invoice data
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
          // Create mode - generate new invoice number
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
  }, [invoice, form, generateInvoiceNumber, toast]);

  const refreshCustomers = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCustomers(data || []);
    } catch (error) {
      console.error('Error refreshing customers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load customers',
        variant: 'destructive'
      });
    }
  };

  const addProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    append({
      description: product.name,
      quantity: 1,
      price: Number(product.price),
      total: Number(product.price)
    });
    
    setTimeout(calculateTotals, 100);
  };

  const addEmptyItem = () => {
    append({
      description: '',
      quantity: 1,
      price: 0,
      total: 0
    });
  };

  const calculateItemTotal = (index: number) => {
    const items = form.getValues('items');
    const item = items[index];
    const total = item.quantity * item.price;
    
    form.setValue(`items.${index}.total`, total);
    calculateTotals();
  };

  const calculateTotals = () => {
    const items = form.getValues('items');
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount - discountAmount;

    form.setValue('subtotal', subtotal);
    form.setValue('tax', taxAmount);
    form.setValue('discount', discountAmount);
    form.setValue('total', Math.max(0, total));
  };

  useEffect(() => {
    calculateTotals();
  }, [taxRate, discountAmount]);

  const onSubmit = async (data: InvoiceFormData) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive'
      });
      return;
    }

    console.log('Submitting invoice form with data:', data);
    setLoading(true);
    
    try {
      // Validate items - ensure at least one item with description
      const validItems = data.items.filter(item => item.description && item.description.trim());
      if (validItems.length === 0) {
        toast({
          title: 'Error',
          description: 'Please add at least one item with a description',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      // Validate customer selection
      if (!data.customer_id) {
        toast({
          title: 'Error',
          description: 'Please select a customer',
          variant: 'destructive'
        });
        setLoading(false);
        return;
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
        tax: data.tax,
        discount: data.discount,
        total: data.total,
        payment_due_date: data.payment_due_date.toISOString(),
        status: data.status,
        payment_method: data.payment_method,
        payment_proof_url: invoice?.payment_proof_url || '',
        notes: data.notes || ''
      };

      console.log('Final invoice data for submission:', invoiceData);

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
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving invoice:', error);
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
