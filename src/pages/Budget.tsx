
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData, formatCurrency, Budget } from '@/hooks/useDashboardData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Edit } from 'lucide-react';

const categories = [
  { value: 'food', label: 'Food', icon: '🍔' },
  { value: 'transport', label: 'Transport', icon: '🚗' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'bills', label: 'Bills', icon: '📄' },
  { value: 'housing', label: 'Housing', icon: '🏠' },
  { value: 'health', label: 'Health', icon: '🏥' },
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'other', label: 'Other', icon: '📦' }
];

const formSchema = z.object({
  category: z.string({
    required_error: 'Please select a category',
  }),
  amount: z
    .number({
      required_error: 'Please enter an amount',
      invalid_type_error: 'Amount must be a number',
    })
    .positive('Amount must be positive'),
  currency: z.enum(['IDR', 'USD'])
});

type FormValues = z.infer<typeof formSchema>;

const getBudgetColor = (percentage: number) => {
  if (percentage >= 100) return 'bg-red-500';
  if (percentage >= 80) return 'bg-yellow-500';
  return 'bg-green-500';
};

const BudgetPage = () => {
  const { t } = useLanguage();
  const { isPremium } = useAuth();
  const { budgets, loading, addUpdateBudget, deleteBudget } = useDashboardData();
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      amount: 0,
      currency: 'IDR'
    }
  });
  
  const handleAddEditBudget = (budget?: Budget) => {
    if (budget) {
      setSelectedBudget(budget);
      form.reset({
        category: budget.category,
        amount: budget.amount,
        currency: budget.currency
      });
    } else {
      setSelectedBudget(null);
      form.reset({
        category: '',
        amount: 0,
        currency: 'IDR'
      });
    }
    setDialogOpen(true);
  };
  
  const onSubmit = async (values: FormValues) => {
    await addUpdateBudget({
      id: selectedBudget?.id,
      category: values.category,
      amount: values.amount,
      currency: values.currency
    });
    setDialogOpen(false);
  };

  const handleDeleteBudget = async (id: string) => {
    await deleteBudget(id);
  };

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('budget.title')}</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage your monthly spending limits
          </p>
        </div>
        <Button 
          onClick={() => handleAddEditBudget()}
          className="mt-4 md:mt-0 flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Budget
        </Button>
      </div>

      {loading.budgets ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : budgets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-xl font-medium mb-2">No budgets yet!</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Start setting up budgets for different categories to track and manage your spending.
            </p>
            <Button onClick={() => handleAddEditBudget()}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Budget
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {budgets.map((budget) => {
            const percentage = Math.round((budget.spent / budget.amount) * 100);
            const budgetColor = getBudgetColor(percentage);
            const icon = categories.find(c => c.value === budget.category.toLowerCase())?.icon || '📊';
            
            return (
              <Card key={budget.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{icon}</span>
                      <CardTitle>{budget.category}</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleAddEditBudget(budget)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteBudget(budget.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      Spent: {formatCurrency(budget.spent, budget.currency)}
                    </span>
                    <span className="text-sm font-medium">
                      {formatCurrency(budget.amount, budget.currency)}
                    </span>
                  </div>
                  <Progress 
                    value={percentage > 100 ? 100 : percentage}
                    className="h-2 overflow-hidden"
                    indicatorClassName={budgetColor}
                  />
                </CardContent>
                <CardFooter className="pt-2 pb-4">
                  <div className="w-full flex justify-between items-center text-sm">
                    <span className={`font-medium ${
                      percentage >= 100 ? 'text-red-500 dark:text-red-400' : 
                      percentage >= 80 ? 'text-yellow-500 dark:text-yellow-400' : 
                      'text-green-500 dark:text-green-400'
                    }`}>
                      {percentage}%
                    </span>
                    <span className="text-muted-foreground">
                      {percentage <= 80 && (
                        <span>{t('budget.good')}</span>
                      )}
                      {percentage > 80 && percentage < 100 && (
                        <span>{percentage}% used</span>
                      )}
                      {percentage >= 100 && (
                        <span>{t('budget.warning')}</span>
                      )}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBudget ? 'Edit Budget' : 'Add Budget'}</DialogTitle>
            <DialogDescription>
              {selectedBudget 
                ? 'Update the details for this budget category' 
                : 'Set a monthly budget limit for a spending category'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
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
                        placeholder="0"
                        {...field}
                        onChange={e => field.onChange(e.target.valueAsNumber)}
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="IDR">IDR - Indonesian Rupiah</SelectItem>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <Button type="submit">
                  {selectedBudget ? 'Update Budget' : 'Add Budget'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BudgetPage;
