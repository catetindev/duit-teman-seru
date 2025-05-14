
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FinanceSummary } from '@/types/finance';
import { useFinancialSummary } from './useFinancialSummary';
import { useExpenseCategories } from './useExpenseCategories';
import { useTopProducts } from './useTopProducts';
import { useComparisonData, getMonthDateRange } from './useComparisonData';

// Main hook that combines all financial data hooks
export function useFinancialData() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Use the individual hooks
  const { summary, fetchSummary } = useFinancialSummary();
  const { expenseCategories, calculateCategories } = useExpenseCategories();
  const { topProducts, fetchTopProducts } = useTopProducts();
  const { comparison, fetchComparisonData } = useComparisonData();

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

      // Fetch all data for the current range
      const summaryData = await fetchSummary(currentRange);
      await calculateCategories(currentRange);
      await fetchTopProducts(currentRange);

      return summaryData;
    } catch (error: any) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
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
