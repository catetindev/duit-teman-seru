
import { Budget } from '@/hooks/goals/types';
import BudgetCard from './BudgetCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';

interface BudgetListProps {
  budgets: Budget[];
  loading: boolean;
  onAddNew: () => void;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

const BudgetList = ({ budgets, loading, onAddNew, onEdit, onDelete }: BudgetListProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg animate-pulse h-32" />
        ))}
      </div>
    );
  }

  if (budgets.length === 0) {
    return (
      <Card className="p-8 text-center mb-6">
        <p className="text-muted-foreground mb-4">{t('budget.empty')}</p>
        <Button onClick={onAddNew} size={isMobile ? "sm" : "default"}>
          <Plus className="mr-2 h-4 w-4" /> {t('budget.create')}
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {budgets.map((budget) => (
        <BudgetCard 
          key={budget.id} 
          budget={budget} 
          onEdit={onEdit} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BudgetList;
