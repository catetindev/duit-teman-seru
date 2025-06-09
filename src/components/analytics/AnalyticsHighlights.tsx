
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertCircle, Target } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { Transaction } from '@/hooks/useDashboardData';

interface AnalyticsHighlightsProps {
  transactions: Transaction[];
}

export const AnalyticsHighlights: React.FC<AnalyticsHighlightsProps> = ({ transactions }) => {
  const insights = useMemo(() => {
    if (!transactions.length) return [];
    
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    
    // Calculate category insights
    const categorySpending: Record<string, number> = {};
    expenses.forEach(t => {
      categorySpending[t.category] = (categorySpending[t.category] || 0) + Number(t.amount);
    });
    
    const topCategory = Object.entries(categorySpending)
      .sort(([,a], [,b]) => b - a)[0];
    
    const totalIncome = income.reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpense = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
    
    const insights = [];
    
    if (topCategory) {
      insights.push({
        icon: TrendingDown,
        title: "Highest Spending Category",
        description: `${topCategory[0]}: ${formatCurrency(topCategory[1], 'IDR')}`,
        type: "warning" as const
      });
    }
    
    if (savingsRate > 20) {
      insights.push({
        icon: TrendingUp,
        title: "Great Savings Rate!",
        description: `You're saving ${savingsRate.toFixed(1)}% of your income`,
        type: "success" as const
      });
    } else if (savingsRate < 0) {
      insights.push({
        icon: AlertCircle,
        title: "Spending Alert",
        description: "You're spending more than you earn this period",
        type: "danger" as const
      });
    }
    
    const avgDailyExpense = totalExpense / 30;
    insights.push({
      icon: Target,
      title: "Daily Spending Average",
      description: `${formatCurrency(avgDailyExpense, 'IDR')} per day`,
      type: "info" as const
    });
    
    return insights;
  }, [transactions]);
  
  if (!insights.length) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base md:text-lg">Financial Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Add more transactions to see personalized insights
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base md:text-lg">Financial Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'success' ? 'bg-green-50 border-green-500 dark:bg-green-900/20' :
                insight.type === 'warning' ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20' :
                insight.type === 'danger' ? 'bg-red-50 border-red-500 dark:bg-red-900/20' :
                'bg-blue-50 border-blue-500 dark:bg-blue-900/20'
              }`}
            >
              <div className="flex items-start space-x-3">
                <insight.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  insight.type === 'success' ? 'text-green-600' :
                  insight.type === 'warning' ? 'text-yellow-600' :
                  insight.type === 'danger' ? 'text-red-600' :
                  'text-blue-600'
                }`} />
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-sm md:text-base text-gray-900 dark:text-gray-100">
                    {insight.title}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {insight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
