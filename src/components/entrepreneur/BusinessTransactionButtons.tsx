
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, TrendingUp, TrendingDown } from 'lucide-react';

interface BusinessTransactionButtonsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export function BusinessTransactionButtons({ 
  onAddIncome, 
  onAddExpense 
}: BusinessTransactionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button 
        onClick={onAddIncome} 
        className="bg-amber-500 hover:bg-amber-600 text-white flex-1"
      >
        <TrendingUp className="mr-1 h-4 w-4" />
        + Business Income
      </Button>
      <Button 
        onClick={onAddExpense} 
        className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
      >
        <TrendingDown className="mr-1 h-4 w-4" />
        + Business Expense
      </Button>
    </div>
  );
}
