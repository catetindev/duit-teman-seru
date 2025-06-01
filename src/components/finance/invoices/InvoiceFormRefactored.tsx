import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { InvoiceFormData } from '@/types/finance';
import { Customer, Product } from '@/types/entrepreneur';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { InvoiceCustomerForm } from './form/InvoiceCustomerForm';
import { InvoiceItemsSection } from './form/InvoiceItemsSection';
import { InvoicePaymentForm } from './form/InvoicePaymentForm';
import { InvoiceTotalsSection } from './form/InvoiceTotalsSection';
import { cn } from '@/lib/utils';

// Define schema for invoice form
const invoiceItemSchema = z.object({
  name: z.string().min(1, 'Nama item diperlukan'),
  description: z.string().optional(),
  quantity: z.coerce.number().positive('Jumlah harus positif'),
  unit_price: z.coerce.number().nonnegative('Harga tidak boleh negatif'),
  total: z.coerce.number().nonnegative('Total tidak boleh negatif'),
});

const formSchema = z.object({
  invoice_number: z.string().min(1, 'Nomor faktur diperlukan'),
  customer_id: z.string().min(1, 'Pelanggan diperlukan'),
  items: z.array(invoiceItemSchema).min(1, 'Minimal satu item diperlukan'),
  subtotal: z.coerce.number().nonnegative(),
  tax: z.coerce.number().nonnegative(),
  discount: z.coerce.number().nonnegative(),
  total: z.coerce.number().positive('Total harus lebih besar dari nol'),
  payment_method: z.string().min(1, 'Metode pembayaran diperlukan'),
  payment_due_date: z.date(),
  notes: z.string().optional(),
  status: z.enum(['Paid', 'Unpaid', 'Overdue']),
});

interface InvoiceFormRefactoredProps {
  defaultValues?: Partial<InvoiceFormData>;
  customers: Customer[];
  products: Product[];
  onSubmit: (data: InvoiceFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function InvoiceFormRefactored({
  defaultValues,
  customers,
  products,
  onSubmit,
  onCancel,
  loading = false,
}: InvoiceFormRefactoredProps) {
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
      payment_due_date: defaultValues?.payment_due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
        {/* Step 1: Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              1. Informasi Pelanggan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <InvoiceCustomerForm 
              form={form} 
              customers={customers} 
              defaultInvoiceNumber={defaultValues?.invoice_number}
              loading={loading}
            />
          </CardContent>
        </Card>

        {/* Step 2: Products and Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              2. Produk & Item
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Step 3: Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              3. Pembayaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <InvoicePaymentForm form={form} />
              <InvoiceTotalsSection 
                form={form} 
                taxRate={taxRate} 
                discountAmount={discountAmount}
                setTaxRate={setTaxRate}
                setDiscountAmount={setDiscountAmount}
              />
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="min-w-[100px]"
          >
            Batal
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="min-w-[100px]"
          >
            {defaultValues?.id ? 'Perbarui' : 'Buat'} Faktur
          </Button>
        </div>
      </form>
    </Form>
  );
}