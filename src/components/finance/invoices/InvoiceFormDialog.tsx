
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription } from '@/components/ui/dialog';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Customer, Product } from '@/types/entrepreneur';
import { Invoice } from '@/types/finance';
import { InvoiceCustomerForm } from './form/InvoiceCustomerForm';
import { InvoiceItemsSection } from './form/InvoiceItemsSection';
import { InvoiceTotalsSection } from './form/InvoiceTotalsSection';
import { InvoiceDialogHeader } from './dialog/InvoiceDialogHeader';
import { InvoiceDialogActions } from './dialog/InvoiceDialogActions';
import { invoiceFormSchema, type InvoiceFormData } from './form/invoiceFormSchema';

interface InvoiceFormDialogProps {
  open: boolean;
  onClose: () => void;
  customers: Customer[];
  products: Product[];
  invoice?: Invoice | null;
  onSuccess: () => void;
}

export function InvoiceFormDialog({
  open,
  onClose,
  customers,
  products,
  invoice,
  onSuccess
}: InvoiceFormDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taxRate, setTaxRate] = useState(11);
  const [discountAmount, setDiscountAmount] = useState(0);

  const isEditMode = !!invoice;

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoice_number: '',
      customer_id: '',
      items: [{ description: '', quantity: 1, price: 0, total: 0 }],
      subtotal: 0,
      total: 0,
      payment_due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      notes: ''
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items'
  });

  // Generate invoice number
  const generateInvoiceNumber = async (): Promise<string> => {
    if (!user?.id) return 'INV-001';

    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('invoice_number')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      const lastNumber = data?.[0]?.invoice_number?.match(/INV-(\d+)/)?.[1];
      const nextNumber = lastNumber ? parseInt(lastNumber) + 1 : 1;
      return `INV-${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error('Error generating invoice number:', error);
      return `INV-${Date.now().toString().slice(-3)}`;
    }
  };

  // Initialize form when dialog opens
  useEffect(() => {
    if (open && !isEditMode) {
      generateInvoiceNumber().then(invoiceNumber => {
        form.setValue('invoice_number', invoiceNumber);
      });
    }
  }, [open, isEditMode]);

  // Load invoice data for editing
  useEffect(() => {
    if (invoice && isEditMode) {
      form.reset({
        invoice_number: invoice.invoice_number,
        customer_id: invoice.customer_id,
        items: invoice.items as any[],
        subtotal: Number(invoice.subtotal),
        total: Number(invoice.total),
        payment_due_date: new Date(invoice.payment_due_date),
        notes: invoice.notes || ''
      });
      setTaxRate(Number(invoice.tax) / Number(invoice.subtotal) * 100 || 11);
      setDiscountAmount(Number(invoice.discount) || 0);
    }
  }, [invoice, isEditMode, form]);

  const addProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    append({
      description: product.name,
      quantity: 1,
      price: Number(product.price),
      total: Number(product.price)
    });

    calculateTotals();
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
    form.setValue('total', Math.max(0, total));
  };

  const handleSubmit = async (data: InvoiceFormData) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare invoice data with all required fields
      const invoiceData = {
        invoice_number: data.invoice_number,
        customer_id: data.customer_id,
        items: JSON.stringify(data.items), // Serialize items as JSON
        subtotal: data.subtotal,
        tax: (data.subtotal * taxRate) / 100,
        discount: discountAmount,
        total: data.total,
        status: 'Unpaid',
        payment_due_date: data.payment_due_date.toISOString(),
        notes: data.notes || null,
        user_id: user.id
      };

      if (isEditMode && invoice) {
        const { error } = await supabase
          .from('invoices')
          .update(invoiceData)
          .eq('id', invoice.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Invoice updated successfully'
        });
      } else {
        const { error } = await supabase
          .from('invoices')
          .insert(invoiceData);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Invoice created successfully'
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save invoice',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch for changes to recalculate totals
  useEffect(() => {
    calculateTotals();
  }, [taxRate, discountAmount]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <InvoiceDialogHeader isEditMode={isEditMode} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Customer and Invoice Info */}
            <InvoiceCustomerForm 
              form={form}
              customers={customers}
              defaultInvoiceNumber={form.watch('invoice_number')}
            />

            {/* Invoice Items */}
            <InvoiceItemsSection
              form={form}
              fields={fields}
              products={products}
              onAddProduct={addProduct}
              onAddEmptyItem={addEmptyItem}
              onRemove={remove}
              calculateItemTotal={calculateItemTotal}
            />

            {/* Totals Section */}
            <InvoiceTotalsSection
              form={form}
              taxRate={taxRate}
              discountAmount={discountAmount}
              setTaxRate={setTaxRate}
              setDiscountAmount={setDiscountAmount}
            />

            {/* Action Buttons */}
            <InvoiceDialogActions
              isEditMode={isEditMode}
              isSubmitting={isSubmitting}
              onCancel={onClose}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
