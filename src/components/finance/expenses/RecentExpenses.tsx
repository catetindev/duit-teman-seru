
import React from 'react';
import { format, parseISO } from 'date-fns';
import { FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BusinessExpense } from '@/types/finance';

type RecentExpensesProps = {
  expenses: BusinessExpense[];
  onViewAll: () => void;
};

export const RecentExpenses = ({ expenses, onViewAll }: RecentExpensesProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">
          Recent Expenses
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 gap-1"
          onClick={onViewAll}
        >
          View All <FileText className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {expenses.slice(0, 5).map((expense) => (
            <div 
              key={expense.id} 
              className="flex items-center justify-between border-b pb-2"
            >
              <div className="flex items-center gap-2">
                <div className="bg-primary/10 text-primary p-1 rounded-full">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{expense.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(parseISO(expense.date), 'dd MMM yyyy')}
                  </p>
                </div>
              </div>
              <p className="text-sm font-medium">
                -{Intl.NumberFormat('id-ID', { 
                  style: 'currency', 
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(Number(expense.amount))}
              </p>
            </div>
          ))}
          
          {expenses.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No recent expenses
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
