
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <motion.div 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
        className="flex-1"
      >
        <Button 
          onClick={onAddIncome} 
          className="bg-green-500 hover:bg-green-600 text-white w-full py-6 h-auto"
          size="lg"
          data-tour="business-income-btn"
        >
          <TrendingUp className="mr-2 h-5 w-5" />
          <span className="text-base">Record Business Income</span>
        </Button>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.02 }} 
        whileTap={{ scale: 0.98 }}
        className="flex-1"
      >
        <Button 
          onClick={onAddExpense} 
          className="bg-blue-500 hover:bg-blue-600 text-white w-full py-6 h-auto"
          size="lg"
          data-tour="business-expense-btn"
        >
          <TrendingDown className="mr-2 h-5 w-5" />
          <span className="text-base">Record Business Expense</span>
        </Button>
      </motion.div>
    </div>
  );
}
