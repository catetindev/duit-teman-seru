
import React from 'react';
import { ExpenseCategory, TopProduct, FinanceSummary } from '@/types/finance';
import { ArrowDownToLine, LineChart, File } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';

type BusinessInsightsProps = {
  expenseCategories: ExpenseCategory[];
  topProducts: TopProduct[];
  summary: FinanceSummary;
};

export const BusinessInsights = ({
  expenseCategories,
  topProducts,
  summary
}: BusinessInsightsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Insights</CardTitle>
        <CardDescription>
          Personalized recommendations for your business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
            <h3 className="font-medium flex items-center gap-2">
              <ArrowDownToLine className="h-4 w-4" />
              Expense Optimization
            </h3>
            <p className="text-sm mt-1">
              Your "{expenseCategories[0]?.category || 'Marketing'}" expenses are higher than average. 
              Consider reviewing your spending in this category to improve profitability.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900">
            <h3 className="font-medium flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Growth Opportunity
            </h3>
            <p className="text-sm mt-1">
              Your top product "{topProducts[0]?.name || 'Product A'}" contributes 
              significantly to your revenue. Consider expanding this product line.
            </p>
          </div>
          
          <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
            <h3 className="font-medium flex items-center gap-2">
              <File className="h-4 w-4" />
              Tax Planning
            </h3>
            <p className="text-sm mt-1">
              Based on your current income of {formatCurrency(summary.totalIncome)}, 
              consider scheduling a tax planning session before the quarter ends.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
