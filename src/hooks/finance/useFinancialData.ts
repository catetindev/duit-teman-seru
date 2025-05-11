
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FinanceSummary, ExpenseCategory, TopProduct, ComparisonData } from '@/types/finance';
import { useToast } from '@/hooks/use-toast';
import { useInvoices } from './useInvoices';
import { useBusinessExpenses } from './useBusinessExpenses';

// Utility function to get date range for current and previous month
const getMonthDateRange = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  lastDay.setHours(23, 59, 59, 999);
  
  const prevFirstDay = new Date(year, month - 1, 1);
  const prevLastDay = new Date(year, month, 0);
  prevLastDay.setHours(23, 59, 59, 999);
  
  return {
    current: { from: firstDay, to: lastDay },
    previous: { from: prevFirstDay, to: prevLastDay }
  };
};

export function useFinancialData() {
  const [summary, setSummary] = useState<FinanceSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0
  });
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { toast } = useToast();
  const { fetchInvoices } = useInvoices();
  const { fetchExpenses } = useBusinessExpenses();

  // Function to fetch all financial data
  const fetchFinancialData = async (dateRange?: { from: Date, to: Date }) => {
    try {
      if (!user) return;
      setLoading(true);

      let currentRange = dateRange;
      if (!currentRange) {
        const now = new Date();
        const ranges = getMonthDateRange(now);
        currentRange = ranges.current;

        // Also fetch previous month data for comparison
        await fetchComparisonData(ranges.current, ranges.previous);
      }

      // Fetch income data (paid orders)
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('id, total, products, created_at')
        .eq('user_id', user.id)
        .eq('status', 'Paid')
        .gte('created_at', currentRange.from.toISOString())
        .lte('created_at', currentRange.to.toISOString());

      if (ordersError) throw ordersError;

      // Fetch expenses
      const expensesData = await fetchExpenses(currentRange);

      // Calculate totals
      const totalIncome = ordersData.reduce((sum, order) => sum + Number(order.total), 0);
      const totalExpenses = expensesData.reduce((sum, expense) => sum + Number(expense.amount), 0);
      const netProfit = totalIncome - totalExpenses;
      const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

      const financialSummary = {
        totalIncome,
        totalExpenses,
        netProfit,
        profitMargin
      };
      
      setSummary(financialSummary);

      // Calculate expense categories
      const categoryMap = expensesData.reduce((acc, expense) => {
        const category = expense.category;
        if (!acc[category]) acc[category] = 0;
        acc[category] += Number(expense.amount);
        return acc;
      }, {} as Record<string, number>);

      const categories = Object.entries(categoryMap).map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      })).sort((a, b) => b.amount - a.amount);

      setExpenseCategories(categories);

      // Calculate top products
      const productMap = new Map<string, { revenue: number, count: number }>();
      
      ordersData.forEach(order => {
        const products = Array.isArray(order.products) ? order.products : JSON.parse(typeof order.products === 'string' ? order.products : JSON.stringify(order.products));
        products.forEach((product: any) => {
          const name = product.name || product.product_name || 'Unknown';
          const revenue = Number(product.price || 0) * Number(product.quantity || 0);
          const current = productMap.get(name) || { revenue: 0, count: 0 };
          
          productMap.set(name, {
            revenue: current.revenue + revenue,
            count: current.count + Number(product.quantity || 1)
          });
        });
      });

      const topProductsList = Array.from(productMap.entries())
        .map(([name, data]) => ({
          name,
          revenue: data.revenue,
          count: data.count
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setTopProducts(topProductsList);

      return financialSummary;
    } catch (error: any) {
      console.error('Error fetching financial data:', error);
      toast({
        title: 'Error fetching financial data',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch comparison data between two periods
  const fetchComparisonData = async (
    currentRange: { from: Date, to: Date },
    previousRange: { from: Date, to: Date }
  ) => {
    try {
      if (!user) return;

      // Fetch current period data
      const currentData = await fetchPeriodData(currentRange);
      
      // Fetch previous period data
      const previousData = await fetchPeriodData(previousRange);

      // Calculate changes
      const incomeChange = previousData.totalIncome > 0 
        ? ((currentData.totalIncome - previousData.totalIncome) / previousData.totalIncome) * 100
        : 100;
      
      const expensesChange = previousData.totalExpenses > 0 
        ? ((currentData.totalExpenses - previousData.totalExpenses) / previousData.totalExpenses) * 100
        : 100;
      
      const profitChange = previousData.netProfit > 0 
        ? ((currentData.netProfit - previousData.netProfit) / Math.abs(previousData.netProfit)) * 100
        : (currentData.netProfit > 0 ? 100 : 0);
      
      const marginChange = previousData.profitMargin > 0 
        ? currentData.profitMargin - previousData.profitMargin
        : currentData.profitMargin;
      
      setComparison({
        current: currentData,
        previous: previousData,
        incomeChange,
        expensesChange,
        profitChange,
        marginChange
      });

      return { current: currentData, previous: previousData };
    } catch (error: any) {
      console.error('Error fetching comparison data:', error);
    }
  };

  // Helper function to get data for a specific period
  const fetchPeriodData = async (range: { from: Date, to: Date }): Promise<FinanceSummary> => {
    try {
      // Fetch income data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total')
        .eq('user_id', user!.id)
        .eq('status', 'Paid')
        .gte('created_at', range.from.toISOString())
        .lte('created_at', range.to.toISOString());

      if (ordersError) throw ordersError;

      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('business_expenses')
        .select('amount')
        .eq('user_id', user!.id)
        .gte('date', range.from.toISOString())
        .lte('date', range.to.toISOString());

      if (expensesError) throw expensesError;

      // Calculate summary
      const totalIncome = ordersData.reduce((sum, order) => sum + Number(order.total), 0);
      const totalExpenses = expensesData.reduce((sum, expense) => sum + Number(expense.amount), 0);
      const netProfit = totalIncome - totalExpenses;
      const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

      return { totalIncome, totalExpenses, netProfit, profitMargin };
    } catch (error) {
      console.error('Error fetching period data:', error);
      return { totalIncome: 0, totalExpenses: 0, netProfit: 0, profitMargin: 0 };
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchFinancialData();
    }
  }, [user]);

  return {
    summary,
    comparison,
    expenseCategories,
    topProducts,
    loading,
    fetchFinancialData,
    fetchComparisonData
  };
}
