import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceFormSchema, InvoiceFormData } from './form/invoiceFormSchema';
import { InvoiceCustomerForm } from './form/InvoiceCustomerForm';
import { InvoiceItemsSection } from './form/InvoiceItemsSection';
import { InvoiceTotalsSection } from './form/InvoiceTotalsSection';
import { InvoicePaymentForm } from './form/InvoicePaymentForm';
import { Customer, Product } from '@/types/entrepreneur';
import { Invoice } from '@/types/finance';
import { useInvoices } from '@/hooks/finance/useInvoices';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface InvoiceFormModalProps {
  open: boolean;
  onClose: () => void;
  customers: Customer[];
  products: Product[];
  invoice?: Invoice | null;
  onSuccess: () => void;
}

export function InvoiceFormModal({
  open,
  onClose,
  customers: initialCustomers,
  products,
  invoice,
  onSuccess
}: InvoiceFormModalProps) {
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

        form.reset({
          invoice_number: invoice.invoice_number,
          customer_id: invoice.customer_id,
          items: parsedItems,
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
      if (invoice) {
        // For updates, include the invoice id
        const updateData: InvoiceFormData & { id: string } = {
          ...data,
          id: invoice.id,
        };
        await updateInvoice(updateData);
      } else {
        // For new invoices, ensure all required fields are present and properly typed
        const createData: InvoiceFormData = {
          invoice_number: data.invoice_number!,
          customer_id: data.customer_id!,
          items: data.items!,
          subtotal: data.subtotal!,
          tax: data.tax!,
          discount: data.discount!,
          total: data.total!,
          payment_due_date: data.payment_due_date!,
          status: data.status!,
          payment_method: data.payment_method!,
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {invoice ? 'Edit Invoice' : 'Create New Invoice'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <InvoiceCustomerForm 
              form={form} 
              customers={customers}
              onCustomerAdded={refreshCustomers}
            />
            
            <InvoiceItemsSection 
              form={form} 
              fields={fields}
              products={products}
              onAddProduct={addProduct}
              onAddEmptyItem={addEmptyItem}
              onRemove={remove}
              calculateItemTotal={calculateItemTotal}
            />
            
            <InvoiceTotalsSection 
              form={form}
              taxRate={taxRate}
              discountAmount={discountAmount}
              setTaxRate={setTaxRate}
              setDiscountAmount={setDiscountAmount}
            />
            
            <InvoicePaymentForm form={form} />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Saving...' : (invoice ? 'Update Invoice' : 'Create Invoice')}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
