
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
          // Parse items safely for editing
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
            items: formItems.length > 0 ? formItems : [{ description: '', quantity: 1, price: 0, total: 0 }],
            subtotal: invoice.subtotal,
            tax: invoice.tax,
            discount: invoice.discount,
            total: invoice.total,
            payment_due_date: new Date(invoice.payment_due_date),
            status: invoice.status as 'Unpaid' | 'Paid' | 'Overdue',
            payment_method: invoice.payment_method || 'Cash',
            notes: invoice.notes || ''
          });
          
          // Set tax rate and discount from existing invoice
          if (invoice.subtotal > 0) {
            setTaxRate((invoice.tax / invoice.subtotal) * 100);
          }
          setDiscountAmount(invoice.discount);
        } else {
          // Generate new invoice number for new invoices
          const newInvoiceNumber = await generateInvoiceNumber();
          console.log('Generated invoice number:', newInvoiceNumber);
          form.setValue('invoice_number', newInvoiceNumber || `INV-${Date.now().toString().slice(-6)}`);
        }
      } catch (error) {
        console.error('Error initializing form:', error);
        toast({
          title: 'Error',
          description: 'Gagal menginisialisasi form invoice',
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
        description: 'Gagal memuat data customer',
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
    
    // Recalculate totals after adding product
    setTimeout(calculateTotals, 0);
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

  // Watch for tax rate and discount changes
  useEffect(() => {
    calculateTotals();
  }, [taxRate, discountAmount]);

  const onSubmit = async (data: InvoiceFormData) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'User tidak terautentikasi',
        variant: 'destructive'
      });
      return;
    }

    console.log('Form data submitted:', data);
    setLoading(true);
    
    try {
      // Validate that we have at least one item with content
      const validItems = data.items.filter(item => item.description.trim());
      if (validItems.length === 0) {
        toast({
          title: 'Error',
          description: 'Harap tambahkan minimal satu item dengan deskripsi',
          variant: 'destructive'
        });
        setLoading(false);
        return;
      }

      // Map form items to InvoiceItem format
      const mappedItems: InvoiceItem[] = validItems.map(item => ({
        name: item.description,
        description: '',
        quantity: item.quantity,
        unit_price: item.price,
        total: item.total
      }));

      console.log('Mapped items:', mappedItems);

      if (invoice) {
        // For updates
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
        
        console.log('Update data:', updateData);
        await updateInvoice(updateData);
        
        toast({
          title: 'Berhasil',
          description: 'Invoice berhasil diupdate'
        });
      } else {
        // For new invoices
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
        
        console.log('Create data:', createData);
        await addInvoice(createData);
        
        toast({
          title: 'Berhasil',
          description: 'Invoice berhasil dibuat'
        });
      }
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving invoice:', error);
      toast({
        title: 'Error',
        description: error.message || 'Gagal menyimpan invoice',
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
