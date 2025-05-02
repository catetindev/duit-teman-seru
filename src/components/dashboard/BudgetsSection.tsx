
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import ExpenseCard from '@/components/ui/ExpenseCard';

interface Budget {
  category: string;
  spent: number;
  budget: number;
  currency: 'IDR' | 'USD';
}

interface BudgetsSectionProps {
  budgets: Budget[];
  isPremium: boolean;
}

const BudgetsSection = ({ budgets, isPremium }: BudgetsSectionProps) => {
  const { t } = useLanguage();
  
  if (!isPremium) return null;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('budget.title')}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((budget, index) => (
          <ExpenseCard 
            key={index}
            category={budget.category}
            spent={budget.spent}
            budget={budget.budget}
            currency={budget.currency}
          />
        ))}
      </div>
    </div>
  );
};

export default BudgetsSection;
