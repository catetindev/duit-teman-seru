
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ValidCurrency } from '@/hooks/goals/types';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import BudgetForm from '@/components/budget/BudgetForm';
import BudgetList from '@/components/budget/BudgetList';
import DeleteBudgetDialog from '@/components/budget/DeleteBudgetDialog';

// Define the form values interface
interface FormValues {
  category: string;
  amount: number;
  currency: ValidCurrency;
}

// Define a compatible Budget interface for this page
interface PageBudget {
  id: string;
  category: string;
  amount: number;
  spent?: number;
  currency: ValidCurrency;
  period: string;
  user_id: string;
}

const BudgetPage = () => {
  const { t } = useLanguage();
  const { isPremium } = useAuth();
  const { budgets, loading, addUpdateBudget, deleteBudget } = useDashboardData();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<PageBudget | null>(null);

  console.log('Budget page - budgets:', budgets);
  console.log('Budget page - loading:', loading);

  // Convert budgets to the correct type with explicit user_id
  const typedBudgets: PageBudget[] = budgets.map(budget => ({
    ...budget,
    user_id: budget.user_id || '', // Add explicit user_id property
    currency: budget.currency as ValidCurrency,
    period: budget.period || 'monthly'
  }));

  const handleEditBudget = (budget: PageBudget) => {
    setSelectedBudget(budget);
    setDialogOpen(true);
  };

  const handleDeleteBudget = (budget: PageBudget) => {
    setSelectedBudget(budget);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedBudget) {
      const success = await deleteBudget(selectedBudget.id);
      if (success) {
        toast({
          title: "Budget Deleted",
          description: "Your budget has been successfully deleted",
        });
      }
    }
  };

  const openNewBudgetDialog = () => {
    setSelectedBudget(null);
    setDialogOpen(true);
  };

  // Form submission handler - includes user_id
  const onSubmit = async (values: FormValues) => {
    await addUpdateBudget({
      id: selectedBudget?.id,
      category: values.category,
      amount: values.amount,
      currency: values.currency,
      period: 'monthly', // Default period value
      user_id: selectedBudget?.user_id || '' // Include user_id from selected budget or empty string
    });
    
    toast({
      title: selectedBudget ? "Budget Updated" : "Budget Created",
      description: "Your budget has been saved successfully",
    });
  };

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{t('budget.title')}</h1>
              <p className="text-slate-600 text-base">Manage your budgets and spending limits</p>
            </div>
            <Button onClick={openNewBudgetDialog} className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
              <Plus className="mr-2 h-5 w-5" /> {t('budget.create')}
            </Button>
          </div>

          <BudgetList 
            budgets={typedBudgets}
            loading={loading.budgets}
            onAddNew={openNewBudgetDialog}
            onEdit={handleEditBudget}
            onDelete={handleDeleteBudget}
          />

          {/* Budget Form Dialog */}
          <BudgetForm 
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={onSubmit}
            selectedBudget={selectedBudget}
          />

          {/* Delete Confirmation Dialog */}
          <DeleteBudgetDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={confirmDelete}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BudgetPage;
