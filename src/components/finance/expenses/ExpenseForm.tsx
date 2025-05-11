
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { BusinessExpense } from '@/types/finance';
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

const formSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  date: z.date(),
  notes: z.string().optional(),
});

interface ExpenseFormProps {
  expense?: BusinessExpense;
  categories: string[];
  onSubmit: (data: Omit<BusinessExpense, 'id' | 'user_id' | 'created_at'>) => void;
  onCancel: () => void;
}

export function ExpenseForm({
  expense,
  categories,
  onSubmit,
  onCancel
}: ExpenseFormProps) {
  const isEditing = !!expense;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: expense?.title || '',
      amount: expense?.amount ? Number(expense.amount) : 0,
      category: expense?.category || '',
      date: expense?.date ? new Date(expense.date) : new Date(),
      notes: expense?.notes || '',
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({
      title: data.title,
      amount: data.amount,
      category: data.category,
      date: data.date.toISOString(),
      notes: data.notes || null,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expense Title</FormLabel>
              <FormControl>
                <Input placeholder="Rent, Utilities, Supplies, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="0.00"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="Other">Other</SelectItem>
                  )}
                  {!categories.includes('Rent') && <SelectItem value="Rent">Rent</SelectItem>}
                  {!categories.includes('Utilities') && <SelectItem value="Utilities">Utilities</SelectItem>}
                  {!categories.includes('Supplies') && <SelectItem value="Supplies">Supplies</SelectItem>}
                  {!categories.includes('Marketing') && <SelectItem value="Marketing">Marketing</SelectItem>}
                  {!categories.includes('Software') && <SelectItem value="Software">Software</SelectItem>}
                  {!categories.includes('Food') && <SelectItem value="Food">Food</SelectItem>}
                  {!categories.includes('Transportation') && <SelectItem value="Transportation">Transportation</SelectItem>}
                  {!categories.includes('Other') && <SelectItem value="Other">Other</SelectItem>}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date</FormLabel>
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
                  placeholder="Add any additional details about this expense"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update' : 'Add'} Expense
          </Button>
        </div>
      </form>
    </Form>
  );
}
