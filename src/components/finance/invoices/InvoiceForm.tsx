
import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, X } from 'lucide-react';
import { InvoiceFormData, InvoiceItem } from '@/types/finance';
import { Customer, Product } from '@/types/entrepreneur';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/formatUtils';

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Invoice Number */}
          <FormField
            control={form.control}
            name="invoice_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice Number</FormLabel>
                <FormControl>
                  <Input placeholder="INV-001" {...field} disabled={!!defaultValues?.invoice_number} />
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
                  disabled={!!defaultValues?.customer_id || loading}
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

        {/* Items Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Invoice Items</h3>
            <div className="flex items-center gap-2">
              <Select onValueChange={handleAddProduct}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Add from products" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - {formatCurrency(Number(product.price))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => append({ name: '', description: '', quantity: 1, unit_price: 0, total: 0 })}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>
          </div>

          <div className="border rounded-md">
            <div className="grid grid-cols-12 gap-2 p-3 bg-muted font-medium text-sm">
              <div className="col-span-4">Item</div>
              <div className="col-span-2">Qty</div>
              <div className="col-span-2">Unit Price</div>
              <div className="col-span-3">Total</div>
              <div className="col-span-1"></div>
            </div>

            {fields.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No items added yet
              </div>
            ) : (
              fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 p-3 border-t items-center">
                  <div className="col-span-4">
                    <Input
                      {...form.register(`items.${index}.name`)}
                      placeholder="Item name"
                      className="mb-1"
                    />
                    <Input
                      {...form.register(`items.${index}.description`)}
                      placeholder="Description (optional)"
                      className="text-xs"
                    />
                    {form.formState.errors.items?.[index]?.name && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.items[index]?.name?.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="1"
                      {...form.register(`items.${index}.quantity`, {
                        valueAsNumber: true,
                        onChange: () => calculateItemTotal(index),
                      })}
                    />
                    {form.formState.errors.items?.[index]?.quantity && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.items[index]?.quantity?.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      {...form.register(`items.${index}.unit_price`, {
                        valueAsNumber: true,
                        onChange: () => calculateItemTotal(index),
                      })}
                    />
                    {form.formState.errors.items?.[index]?.unit_price && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.items[index]?.unit_price?.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-3">
                    <Input
                      type="number"
                      readOnly
                      {...form.register(`items.${index}.total`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        remove(index);
                        setTimeout(() => calculateTotals(), 0);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          {form.formState.errors.items?.message && (
            <p className="text-sm text-destructive">
              {form.formState.errors.items.message}
            </p>
          )}
        </div>

        {/* Totals Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Unpaid">Unpaid</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Transfer">Bank Transfer</SelectItem>
                      <SelectItem value="QRIS">QRIS</SelectItem>
                      <SelectItem value="Credit Card">Credit Card</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_due_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any additional notes for this invoice"
                      className="resize-none h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="bg-muted p-4 rounded-lg space-y-4">
            <h3 className="font-medium">Invoice Summary</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(form.watch('subtotal'))}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Tax ({taxRate}%):</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    className="w-16 text-right"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span>Discount:</span>
                <div>
                  <Input
                    type="number"
                    min="0"
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                    className="w-32 text-right"
                  />
                </div>
              </div>

              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(form.watch('total'))}</span>
                </div>
                {form.formState.errors.total && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.total.message}
                  </p>
                )}
              </div>
            </div>
          </div>
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
