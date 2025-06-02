
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface RevenueData {
  totalRevenue: number;
  posRevenue: number;
  orderRevenue: number;
  monthlyGrowth: number;
}

export function useBusinessRevenue() {
  const { user } = useAuth();
  const [revenueData, setRevenueData] = useState<RevenueData>({
    totalRevenue: 0,
    posRevenue: 0,
    orderRevenue: 0,
    monthlyGrowth: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchRevenueData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching business revenue data for user:', user.id);

      // Get current month's start and end dates
      const now = new Date();
      const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      
      // Get previous month's dates for growth calculation
      const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

      // Fetch POS transactions revenue for current month
      const { data: posTransactions, error: posError } = await supabase
        .from('pos_transactions')
        .select('total, created_at')
        .eq('user_id', user.id)
        .gte('created_at', currentMonthStart.toISOString())
        .lte('created_at', currentMonthEnd.toISOString());

      if (posError) {
        console.error('Error fetching POS transactions:', posError);
        throw posError;
      }

      // Fetch orders revenue for current month
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('total, created_at')
        .eq('user_id', user.id)
        .eq('status', 'Paid')
        .gte('created_at', currentMonthStart.toISOString())
        .lte('created_at', currentMonthEnd.toISOString());

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      // Fetch business income transactions for current month
      const { data: incomeTransactions, error: incomeError } = await supabase
        .from('transactions')
        .select('amount, date')
        .eq('user_id', user.id)
        .eq('type', 'income')
        .eq('is_business', true)
        .gte('date', currentMonthStart.toISOString().split('T')[0])
        .lte('date', currentMonthEnd.toISOString().split('T')[0]);

      if (incomeError) {
        console.error('Error fetching income transactions:', incomeError);
        throw incomeError;
      }

      // Calculate current month revenue
      const posRevenue = posTransactions?.reduce((sum, tx) => sum + Number(tx.total), 0) || 0;
      const orderRevenue = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const manualIncomeRevenue = incomeTransactions?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;
      
      const totalRevenue = posRevenue + orderRevenue + manualIncomeRevenue;

      // Fetch previous month data for growth calculation
      const { data: prevPosTransactions } = await supabase
        .from('pos_transactions')
        .select('total')
        .eq('user_id', user.id)
        .gte('created_at', previousMonthStart.toISOString())
        .lte('created_at', previousMonthEnd.toISOString());

      const { data: prevOrders } = await supabase
        .from('orders')
        .select('total')
        .eq('user_id', user.id)
        .eq('status', 'Paid')
        .gte('created_at', previousMonthStart.toISOString())
        .lte('created_at', previousMonthEnd.toISOString());

      const { data: prevIncomeTransactions } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'income')
        .eq('is_business', true)
        .gte('date', previousMonthStart.toISOString().split('T')[0])
        .lte('date', previousMonthEnd.toISOString().split('T')[0]);

      const prevTotalRevenue = (
        (prevPosTransactions?.reduce((sum, tx) => sum + Number(tx.total), 0) || 0) +
        (prevOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0) +
        (prevIncomeTransactions?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0)
      );

      // Calculate monthly growth percentage
      const monthlyGrowth = prevTotalRevenue > 0 
        ? ((totalRevenue - prevTotalRevenue) / prevTotalRevenue) * 100
        : 0;

      console.log('Revenue data calculated:', {
        totalRevenue,
        posRevenue,
        orderRevenue,
        manualIncomeRevenue,
        monthlyGrowth
      });

      setRevenueData({
        totalRevenue,
        posRevenue,
        orderRevenue,
        monthlyGrowth
      });

    } catch (error: any) {
      console.error('Error fetching business revenue data:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchRevenueData();
    }
  }, [user?.id, fetchRevenueData]);

  return {
    revenueData,
    loading,
    refetch: fetchRevenueData
  };
}
