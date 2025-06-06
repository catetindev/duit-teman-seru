
import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceFormSchema, InvoiceFormData } from '@/components/finance/invoices/form/invoiceFormSchema';
import { Customer, Product } from '@/types/entrepreneur';
import { Invoice, InvoiceItem } from '@/types/finance';
import { useInvoices } from '@/hooks/finance/useInvoices';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
      items: [],
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      payment_due_date: new Date(),
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
      if (invoice) {
        // Parse items safely
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

        // Map InvoiceItem to form schema format
        const formItems = parsedItems.map((item: InvoiceItem) => ({
          description: item.name || item.description || '',
          quantity: item.quantity,
          price: item.unit_price,
          total: item.total
        }));

        form.reset({
          invoice_number: invoice.invoice_number,
          customer_id: invoice.customer_id,
          items: formItems,
          subtotal: invoice.subtotal,
          tax: invoice.tax,
          discount: invoice.discount,
          total: invoice.total,
          payment_due_date: new Date(invoice.payment_due_date),
          status: invoice.status as 'Unpaid' | 'Paid' | 'Overdue',
          payment_method: invoice.payment_method || 'Cash',
          notes: invoice.notes || ''
        });
      } else {
        const newInvoiceNumber = await generateInvoiceNumber();
        form.setValue('invoice_number', newInvoiceNumber || '');
      }
    };

    initializeForm();
  }, [invoice, form, generateInvoiceNumber]);

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

  const onSubmit = async (data: InvoiceFormData) => {
    setLoading(true);
    
    try {
      // Map form items to InvoiceItem format
      const mappedItems: InvoiceItem[] = data.items.map(item => ({
        name: item.description,
        description: '',
        quantity: item.quantity,
        unit_price: item.price,
        total: item.total
      }));

      if (invoice) {
        // For updates, transform data to match database schema
        const updateData = {
          id: invoice.id,
          invoice_number: data.invoice_number,
          customer_id: data.customer_id,
          items: mappedItems,
          subtotal: data.subtotal,
          tax: data.tax,
          discount: data.discount,
          total: data.total,
          payment_due_date: data.payment_due_date.toISOString(),
          status: data.status,
          payment_method: data.payment_method,
          payment_proof_url: invoice.payment_proof_url || '',
          notes: data.notes || ''
        };
        await updateInvoice(updateData);
      } else {
        // For new invoices, transform data to match database schema
        const createData = {
          invoice_number: data.invoice_number,
          customer_id: data.customer_id,
          items: mappedItems,
          subtotal: data.subtotal,
          tax: data.tax,
          discount: data.discount,
          total: data.total,
          payment_due_date: data.payment_due_date.toISOString(),
          status: data.status,
          payment_method: data.payment_method,
          payment_proof_url: '',
          notes: data.notes || ''
        };
        await addInvoice(createData);
      }
      
      onSuccess();
      onClose();
      form.reset();
    } catch (error) {
      console.error('Error saving invoice:', error);
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
