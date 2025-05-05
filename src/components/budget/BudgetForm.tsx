import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { categories } from '@/components/transactions/transaction-types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ValidCurrency } from '@/hooks/goals/types';

// Define budget category types using the same ones from transactions
const allCategories = [...categories.expense, ...categories.income];

const budgetFormSchema = z.object({
  category: z.string({
    required_error: "Please select a category",
  }),
  amount: z.coerce
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive"),
  currency: z.enum(["IDR", "USD"], {
    required_error: "Please select a currency",
  }),
});

interface BudgetFormValues {
  category: string;
  amount: number;
  currency: ValidCurrency;
}

interface BudgetData {
  id?: string;
  category: string;
  amount: number;
  currency: ValidCurrency;
  period?: string;
  user_id?: string;
  spent?: number;
}

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: BudgetFormValues) => Promise<void>;
  selectedBudget: BudgetData | null;
}

export default function BudgetForm({
  open,
  onOpenChange,
  onSubmit,
  selectedBudget,
}: BudgetFormProps) {
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: selectedBudget?.category || "",
      amount: selectedBudget?.amount || 0,
      currency: (selectedBudget?.currency as ValidCurrency) || "IDR",
    },
  });

  // Update form when selectedBudget changes
  React.useEffect(() => {
    if (selectedBudget) {
      form.reset({
        category: selectedBudget.category,
        amount: selectedBudget.amount,
        currency: selectedBudget.currency,
      });
    } else {
      form.reset({
        category: "",
        amount: 0,
        currency: "IDR",
      });
    }
  }, [selectedBudget, form]);

  const isSubmitting = form.formState.isSubmitting;
  
  async function handleSubmit(values: BudgetFormValues) {
    await onSubmit(values);
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedBudget ? "Edit Budget" : "Create Budget"}
          </DialogTitle>
          <DialogDescription>
            Set monthly spending limits for each category.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IDR">IDR (Rp)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    {selectedBudget ? "Updating..." : "Creating..."}
                  </span>
                ) : (
                  <>{selectedBudget ? "Update Budget" : "Create Budget"}</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
