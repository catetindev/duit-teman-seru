
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <motion.div 
        whileHover={{ scale: isEntrepreneurMode ? 1.02 : 1 }} 
        whileTap={{ scale: isEntrepreneurMode ? 0.98 : 1 }}
        className="w-full"
      >
        <Button 
          onClick={handleIncomeClick} 
          className={`w-full h-16 rounded-2xl font-semibold text-lg transition-all duration-300 ${
            isEntrepreneurMode 
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-md' 
              : 'bg-slate-200 hover:bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
          size="lg"
          data-tour="business-income-btn"
          disabled={!isEntrepreneurMode}
        >
          <div className="flex items-center justify-center gap-3">
            {isEntrepreneurMode ? (
              <TrendingUp className="h-6 w-6" />
            ) : (
              <Lock className="h-6 w-6" />
            )}
            <span>Record Business Income</span>
          </div>
        </Button>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: isEntrepreneurMode ? 1.02 : 1 }} 
        whileTap={{ scale: isEntrepreneurMode ? 0.98 : 1 }}
        className="w-full"
      >
        <Button 
          onClick={handleExpenseClick} 
          className={`w-full h-16 rounded-2xl font-semibold text-lg transition-all duration-300 ${
            isEntrepreneurMode 
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-sm hover:shadow-md' 
              : 'bg-slate-200 hover:bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
          size="lg"
          data-tour="business-expense-btn"
          disabled={!isEntrepreneurMode}
        >
          <div className="flex items-center justify-center gap-3">
            {isEntrepreneurMode ? (
              <TrendingDown className="h-6 w-6" />
            ) : (
              <Lock className="h-6 w-6" />
            )}
            <span>Record Business Expense</span>
          </div>
        </Button>
      </motion.div>
    </div>
  );
}
