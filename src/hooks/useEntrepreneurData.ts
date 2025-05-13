import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export interface EntrepreneurStats {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export function useEntrepreneurData() {
  const { user } = useAuth();
  const [stats, setStats] = useState<EntrepreneurStats>({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      // Fetch total income from paid orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total')
        .eq('user_id', user.id)
        .eq('status', 'Paid');
      if (ordersError) throw ordersError;
      const totalIncome = ordersData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      // Fetch total expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('business_expenses')
        .select('amount')
        .eq('user_id', user.id);
      if (expensesError) throw expensesError;
      const totalExpenses = expensesData?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

      // Fetch counts
      const { count: customerCount, error: customerError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (customerError) throw customerError;

      const { count: productCount, error: productError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (productError) throw productError;

      const { count: orderCount, error: orderErrorCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (orderErrorCount) throw orderErrorCount;
      
      setStats({
        totalIncome,
        totalExpenses,
        netProfit: totalIncome - totalExpenses,
        totalCustomers: customerCount || 0,
        totalProducts: productCount || 0,
        totalOrders: orderCount || 0,
      });

      // Fetch data for chart (last 6 months)
      const monthlyChartData: MonthlyData[] = [];
      for (let i = 5; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        const monthName = format(date, 'MMM');
        const firstDay = startOfMonth(date);
        const lastDay = endOfMonth(date);

        const { data: monthOrders, error: monthOrdersError } = await supabase
          .from('orders')
          .select('total')
          .eq('user_id', user.id)
          .eq('status', 'Paid')
          .gte('order_date', firstDay.toISOString())
          .lte('order_date', lastDay.toISOString());
        if (monthOrdersError) throw monthOrdersError;
        const monthIncome = monthOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

        const { data: monthExpenses, error: monthExpensesError } = await supabase
          .from('business_expenses')
          .select('amount')
          .eq('user_id', user.id)
          .gte('date', firstDay.toISOString())
          .lte('date', lastDay.toISOString());
        if (monthExpensesError) throw monthExpensesError;
        const monthExpense = monthExpenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
        
        monthlyChartData.push({ month: monthName, income: monthIncome, expense: monthExpense });
      }
      setChartData(monthlyChartData);

    } catch (error) {
      console.error("Error fetching entrepreneur data:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { stats, chartData, loading, refreshData: fetchData };
}