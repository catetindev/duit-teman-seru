
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, TrendingUp, TrendingDown, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface BusinessTransactionButtonsProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export function BusinessTransactionButtons({ 
  onAddIncome, 
  onAddExpense 
}: BusinessTransactionButtonsProps) {
  const { isEntrepreneurMode, isPremiumRequired } = useEntrepreneurMode();
  const navigate = useNavigate();

  const handleIncomeClick = () => {
    if (!isEntrepreneurMode) {
      if (isPremiumRequired) {
        toast({
          title: "Premium Feature Required",
          description: "Business income tracking requires premium and entrepreneur mode.",
          variant: "destructive",
          action: (
            <div 
              className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded cursor-pointer text-xs font-medium"
              onClick={() => navigate('/pricing')}
            >
              Upgrade
            </div>
          )
        });
      } else {
        toast({
          title: "Entrepreneur Mode Required",
          description: "Please enable entrepreneur mode to record business income.",
          variant: "destructive"
        });
      }
      return;
    }
    onAddIncome();
  };

  const handleExpenseClick = () => {
    if (!isEntrepreneurMode) {
      if (isPremiumRequired) {
        toast({
          title: "Premium Feature Required",
          description: "Business expense tracking requires premium and entrepreneur mode.",
          variant: "destructive",
          action: (
            <div 
              className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded cursor-pointer text-xs font-medium"
              onClick={() => navigate('/pricing')}
            >
              Upgrade
            </div>
          )
        });
      } else {
        toast({
          title: "Entrepreneur Mode Required",
          description: "Please enable entrepreneur mode to record business expenses.",
          variant: "destructive"
        });
      }
      return;
    }
    onAddExpense();
  };

  return (
    <div className="flex flex-wrap gap-3">
      <motion.div 
        whileHover={{ scale: isEntrepreneurMode ? 1.02 : 1 }} 
        whileTap={{ scale: isEntrepreneurMode ? 0.98 : 1 }}
        className="flex-1"
      >
        <Button 
          onClick={handleIncomeClick} 
          className={`w-full py-6 h-auto ${
            isEntrepreneurMode 
              ? 'bg-green-500 hover:bg-green-600 text-white' 
              : 'bg-gray-300 hover:bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
          size="lg"
          data-tour="business-income-btn"
          disabled={!isEntrepreneurMode}
        >
          {isEntrepreneurMode ? (
            <TrendingUp className="mr-2 h-5 w-5" />
          ) : (
            <Lock className="mr-2 h-5 w-5" />
          )}
          <span className="text-base">Record Business Income</span>
        </Button>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: isEntrepreneurMode ? 1.02 : 1 }} 
        whileTap={{ scale: isEntrepreneurMode ? 0.98 : 1 }}
        className="flex-1"
      >
        <Button 
          onClick={handleExpenseClick} 
          className={`w-full py-6 h-auto ${
            isEntrepreneurMode 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gray-300 hover:bg-gray-400 text-gray-600 cursor-not-allowed'
          }`}
          size="lg"
          data-tour="business-expense-btn"
          disabled={!isEntrepreneurMode}
        >
          {isEntrepreneurMode ? (
            <TrendingDown className="mr-2 h-5 w-5" />
          ) : (
            <Lock className="mr-2 h-5 w-5" />
          )}
          <span className="text-base">Record Business Expense</span>
        </Button>
      </motion.div>
    </div>
  );
}
