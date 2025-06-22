
import { z } from 'zod';

export const invoiceFormSchema = z.object({
  id: z.string().optional(),
  invoice_number: z.string().min(1, 'Invoice number is required'),
  customer_id: z.string().min(1, 'Please select a customer'),
  items: z.array(z.object({
    description: z.string().min(1, 'Description is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    price: z.number().min(0, 'Price must be positive'),
    total: z.number().min(0, 'Total must be positive')
  })).min(1, 'At least one item is required'),
  subtotal: z.number().min(0, 'Subtotal must be positive'),
  tax: z.number().min(0, 'Tax must be positive'),
  discount: z.number().min(0, 'Discount must be positive'),
  total: z.number().min(0, 'Total must be positive'),
  payment_due_date: z.date(),
  status: z.enum(['Unpaid', 'Paid', 'Overdue']).default('Unpaid'),
  payment_method: z.string().min(1, 'Payment method is required').default('Cash'),
  notes: z.string().optional()
});

export type InvoiceFormData = z.infer<typeof invoiceFormSchema>;
