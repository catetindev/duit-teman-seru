
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import ExpenseCard from '@/components/ui/ExpenseCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/utils/formatUtils';
import { useToast } from '@/hooks/use-toast';
import { useDashboardData, Budget } from '@/hooks/useDashboardData';

interface BudgetsSectionProps {
  isPremium: boolean;
}

const BudgetsSection = ({ isPremium }: BudgetsSectionProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const { budgets, loading } = useDashboardData();
  
  if (!isPremium) return null;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('budget.title')}</h2>
        <Link to="/budget">
          <Button variant="ghost" size="sm" className="text-sm">
            {t('common.viewAll')} <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      {loading.budgets ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">{t('budget.empty')}</p>
          <Link to="/budget">
            <Button variant="outline" size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> {t('budget.createBudget')}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {budgets.slice(0, 4).map((budget) => (
            <ExpenseCard 
              key={budget.id}
              category={budget.category}
              spent={budget.spent}
              budget={budget.amount}
              currency={budget.currency}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetsSection;
