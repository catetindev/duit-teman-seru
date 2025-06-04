import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceFormSchema } from './form/invoiceFormSchema';
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

  const form = useForm({
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
      status: 'Unpaid' as const,
      notes: ''
    }
  });

  useEffect(() => {
    const initializeForm = async () => {
      if (invoice) {
        form.reset({
          invoice_number: invoice.invoice_number,
          customer_id: invoice.customer_id,
          items: invoice.items ? JSON.parse(invoice.items) : [],
          subtotal: invoice.subtotal,
          tax: invoice.tax,
          discount: invoice.discount,
          total: invoice.total,
          payment_due_date: new Date(invoice.payment_due_date),
          status: invoice.status as "Paid" | "Unpaid" | "Overdue",
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

  const onSubmit = async (data: any) => {
    setLoading(true);
    
    try {
      if (invoice) {
        await updateInvoice({ ...data, id: invoice.id });
      } else {
        await addInvoice(user?.id || '', data);
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
              products={products} 
            />
            
            <InvoiceTotalsSection form={form} />
            
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
