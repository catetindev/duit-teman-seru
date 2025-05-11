
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer } from '@/types/entrepreneur';
import { UseFormReturn } from 'react-hook-form';

interface InvoiceCustomerFormProps {
  form: UseFormReturn<any>;
  customers: Customer[];
  defaultInvoiceNumber?: string;
  loading?: boolean;
}

export function InvoiceCustomerForm({ 
  form, 
  customers, 
  defaultInvoiceNumber,
  loading
}: InvoiceCustomerFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Invoice Number */}
      <FormField
        control={form.control}
        name="invoice_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Invoice Number</FormLabel>
            <FormControl>
              <Input placeholder="INV-001" {...field} disabled={!!defaultInvoiceNumber} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Customer */}
      <FormField
        control={form.control}
        name="customer_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Customer</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={!!defaultInvoiceNumber || loading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
