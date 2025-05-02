
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import ExpenseCard from '@/components/ui/ExpenseCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/hooks/useDashboardData';
import { useToast } from '@/hooks/use-toast';

interface Budget {
  id: string;
  category: string;
  spent: number;
  budget: number;
  currency: 'IDR' | 'USD';
}

interface BudgetsSectionProps {
  isPremium: boolean;
}

const BudgetsSection = ({ isPremium }: BudgetsSectionProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) return;
    
    const fetchBudgets = async () => {
      setLoading(true);
      try {
        // First get all budgets
        const { data: budgetData, error: budgetError } = await supabase
          .from('budgets')
          .select('*')
          .eq('user_id', user.id)
          .order('category', { ascending: true });
        
        if (budgetError) throw budgetError;
        
        // Get current month's first and last day
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        // Get sum of expenses per category for current month
        const { data: expenseData, error: expenseError } = await supabase
          .from('transactions')
          .select('category, amount')
          .eq('type', 'expense')
          .eq('user_id', user.id)
          .gte('date', firstDay.toISOString().split('T')[0])
          .lte('date', lastDay.toISOString().split('T')[0]);
        
        if (expenseError) throw expenseError;
        
        // Map expenses to an object for easy lookup
        const expensesByCategory: Record<string, number> = {};
        expenseData?.forEach(item => {
          const category = item.category;
          const amount = Number(item.amount || 0);
          if (!expensesByCategory[category]) {
            expensesByCategory[category] = 0;
          }
          expensesByCategory[category] += amount;
        });
        
        // Combine budget data with spent amounts
        const formattedBudgets: Budget[] = (budgetData || []).map(budget => ({
          id: budget.id,
          category: budget.category,
          budget: Number(budget.amount),
          spent: expensesByCategory[budget.category.toLowerCase()] || 0,
          currency: budget.currency as 'IDR' | 'USD',
        }));
        
        setBudgets(formattedBudgets);
      } catch (error: any) {
        console.error('Error fetching budgets:', error);
        toast({
          title: "Error",
          description: "Failed to load budget data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBudgets();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('budgets-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'budgets', filter: `user_id=eq.${user.id}` },
        () => {
          fetchBudgets();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);
  
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
      
      {loading ? (
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
              budget={budget.budget}
              currency={budget.currency}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BudgetsSection;
