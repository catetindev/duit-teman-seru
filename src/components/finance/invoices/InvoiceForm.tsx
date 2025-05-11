
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { InvoiceFormData, InvoiceItem } from '@/types/finance';
import { Customer, Product } from '@/types/entrepreneur';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { InvoiceCustomerForm } from './form/InvoiceCustomerForm';
import { InvoiceItemsSection } from './form/InvoiceItemsSection';
import { InvoicePaymentForm } from './form/InvoicePaymentForm';
import { InvoiceTotalsSection } from './form/InvoiceTotalsSection';

// Define schema for invoice form
const invoiceItemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  description: z.string().optional(),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  unit_price: z.coerce.number().nonnegative('Price cannot be negative'),
  total: z.coerce.number().nonnegative('Total cannot be negative'),
});

const formSchema = z.object({
  invoice_number: z.string().min(1, 'Invoice number is required'),
  customer_id: z.string().min(1, 'Customer is required'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  subtotal: z.coerce.number().nonnegative(),
  tax: z.coerce.number().nonnegative(),
  discount: z.coerce.number().nonnegative(),
  total: z.coerce.number().positive('Total must be greater than zero'),
  payment_method: z.string().min(1, 'Payment method is required'),
  payment_due_date: z.date(),
  notes: z.string().optional(),
  status: z.enum(['Paid', 'Unpaid', 'Overdue']),
});

interface InvoiceFormProps {
  defaultValues?: Partial<InvoiceFormData>;
  customers: Customer[];
  products: Product[];
  onSubmit: (data: InvoiceFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function InvoiceForm({
  defaultValues,
  customers,
  products,
  onSubmit,
  onCancel,
  loading = false,
}: InvoiceFormProps) {
  const [taxRate, setTaxRate] = useState(10); // Default 10%
  const [discountAmount, setDiscountAmount] = useState(0);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoice_number: defaultValues?.invoice_number || '',
      customer_id: defaultValues?.customer_id || '',
      items: defaultValues?.items || [{ name: '', description: '', quantity: 1, unit_price: 0, total: 0 }],
      subtotal: defaultValues?.subtotal || 0,
      tax: defaultValues?.tax || 0,
      discount: defaultValues?.discount || 0,
      total: defaultValues?.total || 0,
      status: defaultValues?.status || 'Unpaid',
      payment_method: defaultValues?.payment_method || 'Transfer',
      payment_due_date: defaultValues?.payment_due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      notes: defaultValues?.notes || '',
    },
  });

  // Setup field array for invoice items
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  // Calculate item total when quantity or unit price changes
  const calculateItemTotal = (index: number) => {
    const items = form.getValues('items');
    const item = items[index];
    const total = item.quantity * item.unit_price;
    form.setValue(`items.${index}.total`, total);
    calculateTotals();
  };

  // Calculate subtotal, tax, and total
  const calculateTotals = () => {
    const items = form.getValues('items');
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const tax = (subtotal * taxRate) / 100;
    const discount = discountAmount;
    const total = subtotal + tax - discount;

    form.setValue('subtotal', subtotal);
    form.setValue('tax', tax);
    form.setValue('discount', discount);
    form.setValue('total', total);
  };

  // Handle form submission
  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit(data as InvoiceFormData);
  };

  // Add product from existing product catalog
  const handleAddProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    append({
      name: product.name,
      description: '',
      quantity: 1,
      unit_price: Number(product.price),
      total: Number(product.price),
    });

    setTimeout(() => calculateTotals(), 0);
  };

  // Calculate totals when tax rate or discount changes
  useEffect(() => {
    calculateTotals();
  }, [taxRate, discountAmount]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <InvoiceCustomerForm 
          form={form} 
          customers={customers} 
          defaultInvoiceNumber={defaultValues?.invoice_number}
          loading={loading}
        />

        <InvoiceItemsSection
          form={form}
          fields={fields}
          products={products}
          onAddProduct={handleAddProduct}
          onAddEmptyItem={() => append({ name: '', description: '', quantity: 1, unit_price: 0, total: 0 })}
          onRemove={(index) => {
            remove(index);
            setTimeout(() => calculateTotals(), 0);
          }}
          calculateItemTotal={calculateItemTotal}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InvoicePaymentForm form={form} />
          
          <InvoiceTotalsSection 
            form={form} 
            taxRate={taxRate} 
            discountAmount={discountAmount}
            setTaxRate={setTaxRate}
            setDiscountAmount={setDiscountAmount}
          />
        </div>

        <div className="flex justify-end gap-2 mt-8">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {defaultValues?.id ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
