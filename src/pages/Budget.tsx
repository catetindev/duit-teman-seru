
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ValidCurrency } from '@/hooks/goals/types';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import BudgetForm from '@/components/budget/BudgetForm';
import BudgetList from '@/components/budget/BudgetList';
import DeleteBudgetDialog from '@/components/budget/DeleteBudgetDialog';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const { budgets, loading, addUpdateBudget, deleteBudget } = useDashboardData();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<PageBudget | null>(null);

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
    <DashboardLayout>
      <div className="container mx-auto p-4 mb-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Budget Management</h1>
          <Button onClick={openNewBudgetDialog} size={isMobile ? "sm" : "default"}>
            <Plus className="mr-2 h-4 w-4" /> Create Budget
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
    </DashboardLayout>
  );
};

export default BudgetPage;
