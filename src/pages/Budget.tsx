
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2, Edit, Plus } from 'lucide-react';
import { Budget, ValidCurrency } from '@/hooks/goals/types';
import { formatCurrency } from '@/utils/formatUtils';
import { useLanguage } from '@/hooks/useLanguage';
import { toast } from '@/hooks/use-toast';

// Define the form values interface
interface FormValues {
  category: string;
  amount: number;
  currency: ValidCurrency;
}

const BudgetPage = () => {
  const { t } = useLanguage();
  const { budgets, loading, addUpdateBudget, deleteBudget } = useDashboardData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  
  const form = useForm<FormValues>({
    defaultValues: {
      category: '',
      amount: 0,
      currency: 'IDR' as ValidCurrency
    }
  });

  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    form.reset({
      category: budget.category,
      amount: budget.amount,
      currency: budget.currency
    });
    setDialogOpen(true);
  };

  const handleDeleteBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedBudget) {
      const success = await deleteBudget(selectedBudget.id);
      if (success) {
        toast({
          title: t('budget.deleted'),
          description: t('budget.deleteSuccess'),
        });
      }
      setDeleteDialogOpen(false);
    }
  };

  const openNewBudgetDialog = () => {
    setSelectedBudget(null);
    form.reset({
      category: '',
      amount: 0,
      currency: 'IDR' as ValidCurrency
    });
    setDialogOpen(true);
  };

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    await addUpdateBudget({
      id: selectedBudget?.id,
      category: values.category,
      amount: values.amount,
      currency: values.currency,
      period: 'monthly' // Default period value
    });
    setDialogOpen(false);
    toast({
      title: selectedBudget ? t('budget.updated') : t('budget.created'),
      description: t('budget.saveSuccess'),
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{t('budget.title')}</h1>
          <Button onClick={openNewBudgetDialog}>
            <Plus className="mr-2 h-4 w-4" /> {t('budget.create')}
          </Button>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg animate-pulse h-32" />
            ))}
          </div>
        )}

        {!loading && budgets.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground mb-4">{t('budget.empty')}</p>
            <Button onClick={openNewBudgetDialog}>
              <Plus className="mr-2 h-4 w-4" /> {t('budget.create')}
            </Button>
          </Card>
        )}

        {!loading && budgets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map((budget) => {
              const spentPercentage = budget.spent ? (budget.spent / budget.amount) * 100 : 0;
              const isOverBudget = spentPercentage > 100;

              return (
                <Card key={budget.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium capitalize">{budget.category}</h3>
                      <p className="text-2xl font-bold mt-2">{formatCurrency(budget.amount, budget.currency)}</p>
                      {budget.spent !== undefined && (
                        <p className={`text-sm mt-1 ${isOverBudget ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {t('budget.spent')}: {formatCurrency(budget.spent, budget.currency)} 
                          <span className="text-xs ml-1">
                            ({Math.round(spentPercentage)}%)
                          </span>
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('budget.periodLabel')}: {budget.period}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditBudget(budget)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteBudget(budget)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(spentPercentage, 100)}%` }}
                    />
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Budget Form Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedBudget ? t('budget.editTitle') : t('budget.createTitle')}</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="category">{t('budget.category')}</Label>
                <Input 
                  id="category" 
                  {...form.register("category", { required: true })}
                  placeholder={t('budget.categoryPlaceholder')}
                />
              </div>
              
              <div>
                <Label htmlFor="amount">{t('budget.amount')}</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  {...form.register("amount", { 
                    required: true,
                    valueAsNumber: true,
                    min: 0
                  })}
                  placeholder="0"
                />
              </div>
              
              <div>
                <Label htmlFor="currency">{t('budget.currency')}</Label>
                <Select 
                  {...form.register("currency")}
                  onValueChange={(value) => form.setValue("currency", value as ValidCurrency)}
                  defaultValue={form.getValues("currency")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('budget.selectCurrency')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IDR">IDR - Indonesian Rupiah</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit">
                  {selectedBudget ? t('common.update') : t('common.create')}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t('budget.deleteConfirmTitle')}</AlertDialogTitle>
              <AlertDialogDescription>
                {t('budget.deleteConfirmMessage')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                {t('common.delete')}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default BudgetPage;
