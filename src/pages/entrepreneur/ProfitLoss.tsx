
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { ExpenseDialog } from '@/components/finance/expenses/ExpenseDialog';
import { ProfitLossHeader } from '@/components/finance/profit-loss/ProfitLossHeader';
import { ProfitLossSummary } from '@/components/finance/profit-loss/ProfitLossSummary';
import { ProfitLossDateControls } from '@/components/finance/profit-loss/ProfitLossDateControls';
import { ProfitLossTabsContent } from '@/components/finance/profit-loss/ProfitLossTabsContent';
import { useProfitLossLogic } from '@/hooks/finance/useProfitLossLogic';

const ProfitLoss = () => {
  const { isPremium } = useAuth();
  
  const {
    selectedTab,
    setSelectedTab,
    isExpenseDialogOpen,
    setIsExpenseDialogOpen,
    selectedExpense,
    setSelectedExpense,
    dateRange,
    chartData,
    expenses,
    categories,
    summary,
    expenseCategories,
    financialDataLoading,
    handleDateRangeChange,
    handleExportExcel,
    handleExportPdf,
    handleExpenseSubmit,
    handleEditExpense,
    handleDeleteExpense,
    handleAddExpense
  } = useProfitLossLogic();

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="min-h-screen w-full overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-6 space-y-2 sm:space-y-3 lg:space-y-6 pb-20 sm:pb-6">
          
          {/* Header */}
          <ProfitLossHeader
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
          />

          {/* Date Range Options */}
          <ProfitLossDateControls onSelect={handleDateRangeChange} />

          {/* Summary Cards */}
          <ProfitLossSummary 
            summary={summary}
            loading={financialDataLoading} 
          />

          {/* Tabs Content */}
          <ProfitLossTabsContent
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            chartData={chartData}
            summary={summary}
            expenseCategories={expenseCategories}
            expenses={expenses}
            onAddExpense={handleAddExpense}
            onEditExpense={handleEditExpense}
            onDeleteExpense={handleDeleteExpense}
          />
          
          {/* Expense Dialog */}
          <ExpenseDialog
            open={isExpenseDialogOpen}
            onClose={() => {
              setIsExpenseDialogOpen(false);
              setSelectedExpense(undefined);
            }}
            expense={selectedExpense}
            categories={categories}
            onSubmit={handleExpenseSubmit}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfitLoss;
