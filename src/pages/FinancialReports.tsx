
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, TrendingUp, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import existing components
import { ProfitLossTabsContent } from '@/components/finance/profit-loss/ProfitLossTabsContent';
import { ProfitLossHeader } from '@/components/finance/profit-loss/ProfitLossHeader';
import { ProfitLossSummary } from '@/components/finance/profit-loss/ProfitLossSummary';
import { useProfitLoss } from '@/hooks/finance/useProfitLoss';

export default function FinancialReports() {
  const { isPremium } = useAuth();
  const { isEntrepreneurMode } = useEntrepreneurMode();
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const {
    summary,
    chartData,
    expenseCategories,
    expenses,
    selectedMonth,
    selectedYear,
    loading,
    handleMonthChange,
    handleYearChange,
    handleAddExpense,
    handleEditExpense,
    handleDeleteExpense,
    setIsExpenseDialogOpen,
    isExpenseDialogOpen,
    selectedExpense,
    setSelectedExpense
  } = useProfitLoss();

  // Show locked state if not in entrepreneur mode
  if (!isEntrepreneurMode) {
    return (
      <DashboardLayout isPremium={isPremium}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Lock className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">📊 Laporan Keuangan</h3>
              <p className="text-muted-foreground mb-6">
                Aktifkan Mode Bisnis untuk akses laporan keuangan lengkap.
              </p>
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                variant="outline"
              >
                Ke Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Modern Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 px-6 py-6 mb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
                  📊 Laporan Keuangan
                </h1>
                <p className="text-slate-600 mt-2 text-lg">Dashboard lengkap untung rugi dan analisis bisnis</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border border-green-200">
                  <span className="text-green-700 font-medium">💰 Financial Insights</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg shadow-green-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Pendapatan</p>
                      <p className="text-2xl font-bold text-green-600">Rp {summary.totalIncome.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg shadow-red-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Pengeluaran</p>
                      <p className="text-2xl font-bold text-red-600">Rp {summary.totalExpenses.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg shadow-blue-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                      <PieChart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Laba Bersih</p>
                      <p className={`text-2xl font-bold ${summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Rp {summary.netProfit.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg shadow-purple-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Margin Profit</p>
                      <p className={`text-2xl font-bold ${summary.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {summary.profitMargin.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-8">
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      📈 Overview
                    </TabsTrigger>
                    <TabsTrigger value="income" className="flex items-center gap-2">
                      💰 Pendapatan
                    </TabsTrigger>
                    <TabsTrigger value="expenses" className="flex items-center gap-2">
                      📊 Pengeluaran
                    </TabsTrigger>
                  </TabsList>

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
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
