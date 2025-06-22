
import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceFormSchema, InvoiceFormData } from '@/components/finance/invoices/form/invoiceFormSchema';

export function useInvoiceFormState() {
  const [loading, setLoading] = useState(false);
  const [taxRate, setTaxRate] = useState(11);
  const [discountAmount, setDiscountAmount] = useState(0);

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceFormSchema),
    mode: 'onBlur',
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

  return {
    form,
    fields,
    loading,
    setLoading,
    taxRate,
    setTaxRate,
    discountAmount,
    setDiscountAmount,
    append,
    remove
  };
}
