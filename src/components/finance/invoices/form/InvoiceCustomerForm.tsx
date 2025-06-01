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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Invoice Number */}
      <FormField
        control={form.control}
        name="invoice_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nomor Faktur</FormLabel>
            <FormControl>
              <Input 
                placeholder="Contoh: INV-001" 
                {...field} 
                disabled={!!defaultInvoiceNumber}
                className={defaultInvoiceNumber ? "bg-muted" : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Customer Selection */}
      <FormField
        control={form.control}
        name="customer_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pelanggan</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={!!defaultInvoiceNumber || loading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih pelanggan" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[300px]">
                {customers.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    Belum ada pelanggan
                  </div>
                ) : (
                  customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      <div className="flex flex-col">
                        <span>{customer.name}</span>
                        {customer.phone && (
                          <span className="text-xs text-muted-foreground">
                            {customer.phone}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
