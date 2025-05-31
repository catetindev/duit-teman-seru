
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IncomeExpenseChart } from '@/components/finance/reports/IncomeExpenseChart';
import { ExpensesTable } from '@/components/finance/expenses/ExpensesTable';
import { ExpenseCategoryChart } from '@/components/finance/reports/ExpenseCategoryChart';
import { RecentExpenses } from '@/components/finance/expenses/RecentExpenses';
import { IncomeOverview } from '@/components/finance/reports/IncomeOverview';
import { BusinessExpense, FinanceSummary, ExpenseCategory } from '@/types/finance';

interface ProfitLossTabsContentProps {
  selectedTab: string;
  onTabChange: (value: string) => void;
  chartData: any[];
  summary: FinanceSummary;
  expenseCategories: ExpenseCategory[];
  expenses: BusinessExpense[];
  onAddExpense: () => void;
  onEditExpense: (expense: BusinessExpense) => void;
  onDeleteExpense: (id: string) => void;
}

export const ProfitLossTabsContent = ({
  selectedTab,
  onTabChange,
  chartData,
  summary,
  expenseCategories,
  expenses,
  onAddExpense,
  onEditExpense,
  onDeleteExpense
}: ProfitLossTabsContentProps) => {
  return (
    <Tabs 
      defaultValue="overview" 
      value={selectedTab}
      onValueChange={onTabChange}
      className="w-full space-y-2 sm:space-y-3 lg:space-y-4"
    >
      <div className="w-full overflow-x-auto">
        <TabsList className="inline-flex min-w-max h-8 sm:h-9 md:h-10">
          <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-3">
            Overview
          </TabsTrigger>
          <TabsTrigger value="income" className="text-xs sm:text-sm px-2 sm:px-3">
            Income
          </TabsTrigger>
          <TabsTrigger value="expenses" className="text-xs sm:text-sm px-2 sm:px-3">
            Expenses
          </TabsTrigger>
        </TabsList>
      </div>
      
      {/* Overview Tab */}
      <TabsContent value="overview" className="w-full space-y-2 sm:space-y-3 lg:space-y-4">
        <div className="w-full overflow-hidden">
          <IncomeExpenseChart data={chartData} />
        </div>
        
        <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-1 md:grid-cols-2">
          <div className="w-full overflow-hidden">
            <ExpenseCategoryChart data={expenseCategories} />
          </div>
          
          <div className="w-full overflow-hidden">
            <RecentExpenses 
              expenses={expenses} 
              onViewAll={() => onTabChange('expenses')} 
            />
          </div>
        </div>
      </TabsContent>
      
      {/* Income Tab */}
      <TabsContent value="income" className="w-full space-y-2 sm:space-y-3 lg:space-y-4">
        <div className="w-full overflow-hidden">
          <IncomeOverview summary={summary} />
        </div>
      </TabsContent>
      
      {/* Expenses Tab */}
      <TabsContent value="expenses" className="w-full space-y-2 sm:space-y-3 lg:space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3">
          <h3 className="text-sm sm:text-base lg:text-lg font-medium">Expenses</h3>
          <Button 
            onClick={onAddExpense}
            className="w-full sm:w-auto h-8 sm:h-9 lg:h-10 text-xs sm:text-sm"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Add Expense
          </Button>
        </div>
        
        <div className="w-full overflow-x-auto">
          <ExpensesTable 
            expenses={expenses}
            onEdit={onEditExpense}
            onDelete={onDeleteExpense}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};
