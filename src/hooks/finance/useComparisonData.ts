
import { useState } from 'react';
import { ComparisonData } from '@/types/finance';
import { useFinancialSummary } from './useFinancialSummary';

// Utility function to get date range for current and previous month
export const getMonthDateRange = (date: Date) => {
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

export function useComparisonData() {
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [loading, setLoading] = useState(false);
  const { fetchPeriodData } = useFinancialSummary();

  // Fetch comparison data between two periods
  const fetchComparisonData = async (
    currentRange?: { from: Date, to: Date },
    previousRange?: { from: Date, to: Date }
  ) => {
    try {
      setLoading(true);
      
      // If ranges aren't provided, use current and previous month
      if (!currentRange || !previousRange) {
        const now = new Date();
        const ranges = getMonthDateRange(now);
        currentRange = ranges.current;
        previousRange = ranges.previous;
      }

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
      
      const comparisonData = {
        current: currentData,
        previous: previousData,
        incomeChange,
        expensesChange,
        profitChange,
        marginChange
      };
      
      setComparison(comparisonData);
      return comparisonData;
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    comparison,
    loading,
    fetchComparisonData
  };
}
