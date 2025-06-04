
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, TrendingUp, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFinancialData } from '@/hooks/finance/useFinancialData';
import { useBusinessChartData } from '@/hooks/entrepreneur/useBusinessChartData';
import { IncomeExpenseChart } from '@/components/finance/reports/IncomeExpenseChart';
import { ExpenseCategoryChart } from '@/components/finance/reports/ExpenseCategoryChart';
import { IncomeOverview } from '@/components/finance/reports/IncomeOverview';
import { BusinessInsights } from '@/components/finance/reports/BusinessInsights';

const ProfitLoss = () => {
  const { isPremium } = useAuth();
  const { isEntrepreneurMode } = useEntrepreneurMode();
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const {
    summary,
    expenseCategories,
    topProducts,
    loading: financialLoading,
    fetchFinancialData
  } = useFinancialData();

  const {
    chartData,
    loading: chartLoading,
    timeframe,
    setTimeframe
  } = useBusinessChartData();

  // Show locked state if not in entrepreneur mode
  if (!isEntrepreneurMode) {
    return (
      <DashboardLayout isPremium={isPremium}>
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <Card className="w-full max-w-md border border-gray-200">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Lock className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Laporan Untung Rugi</h3>
              <p className="text-gray-600 mb-6 text-sm">
                Aktifkan Mode Bisnis untuk akses laporan untung rugi lengkap.
              </p>
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                variant="outline"
                className="w-full"
              >
                Ke Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate real summary data
  const realSummary = {
    totalIncome: summary?.totalIncome || 0,
    totalExpenses: summary?.totalExpenses || 0,
    netProfit: (summary?.totalIncome || 0) - (summary?.totalExpenses || 0),
    profitMargin: summary?.totalIncome ? (((summary.totalIncome - (summary.totalExpenses || 0)) / summary.totalIncome) * 100) : 0
  };

  // Transform chart data for different views
  const transformedChartData = chartData.map(item => ({
    name: item.month,
    income: item.income,
    expenses: item.expense,
    profit: item.income - item.expense
  }));

  const isLoading = financialLoading || chartLoading;

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="min-h-screen bg-gray-50">
        {/* Clean Header - Responsive */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  Laporan Untung Rugi
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
                  Analisis lengkap performa keuangan bisnis Anda
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-4">
                <select 
                  value={timeframe} 
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="3months">3 Bulan</option>
                  <option value="6months">6 Bulan</option>
                  <option value="year">1 Tahun</option>
                </select>
                <div className="bg-blue-50 px-2 sm:px-4 py-1 sm:py-2 rounded-lg border border-blue-200">
                  <span className="text-blue-700 font-medium text-xs sm:text-sm">Financial Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Summary Cards - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-600">Total Pendapatan</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                        Rp {realSummary.totalIncome.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-red-100 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-red-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-600">Total Pengeluaran</p>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
                        Rp {realSummary.totalExpenses.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <PieChart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-600">Laba Bersih</p>
                      <p className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${realSummary.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        Rp {realSummary.netProfit.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-gray-600">Margin Profit</p>
                      <p className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${realSummary.profitMargin >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {realSummary.profitMargin.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs - Responsive */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                  <div className="w-full overflow-x-auto mb-4 sm:mb-6 lg:mb-8">
                    <TabsList className="grid w-full min-w-max grid-cols-3 bg-gray-50 h-9 sm:h-10">
                      <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-4">
                        Overview
                      </TabsTrigger>
                      <TabsTrigger value="income" className="text-xs sm:text-sm px-2 sm:px-4">
                        Pendapatan
                      </TabsTrigger>
                      <TabsTrigger value="expenses" className="text-xs sm:text-sm px-2 sm:px-4">
                        Pengeluaran
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="overview">
                    <div className="space-y-4 sm:space-y-6">
                      <div className="mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">Ringkasan Keuangan</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Lihat performa bisnis Anda dalam satu pandangan</p>
                      </div>
                      
                      {/* Financial Trend Chart - Responsive */}
                      <div className="w-full overflow-hidden">
                        {isLoading ? (
                          <Card className="border border-gray-200">
                            <CardContent className="p-6 flex items-center justify-center h-[300px] sm:h-[400px]">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </CardContent>
                          </Card>
                        ) : (
                          <IncomeExpenseChart 
                            data={transformedChartData} 
                            title={`Tren Keuangan ${timeframe === '3months' ? '3' : timeframe === '6months' ? '6' : '12'} Bulan Terakhir`}
                            height={window.innerWidth < 640 ? 300 : 400}
                          />
                        )}
                      </div>
                      
                      {/* Bottom section - Responsive Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8">
                        <div className="w-full overflow-hidden">
                          <ExpenseCategoryChart data={expenseCategories} />
                        </div>
                        
                        <div className="w-full overflow-hidden">
                          <BusinessInsights 
                            expenseCategories={expenseCategories}
                            topProducts={topProducts}
                            summary={realSummary}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="income">
                    <div className="space-y-4 sm:space-y-6">
                      <div className="mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-700 mb-2">Analisis Pendapatan</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Detail sumber pendapatan bisnis Anda</p>
                      </div>
                      
                      <div className="w-full overflow-hidden">
                        <IncomeOverview summary={realSummary} />
                      </div>
                      
                      {/* Income trend chart - Responsive */}
                      <Card className="border border-gray-200">
                        <CardContent className="p-4 sm:p-6">
                          <h4 className="text-base sm:text-lg font-semibold mb-4 text-gray-900">Tren Pendapatan</h4>
                          <div className="w-full overflow-hidden">
                            {isLoading ? (
                              <div className="flex items-center justify-center h-[250px] sm:h-[300px]">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                              </div>
                            ) : (
                              <IncomeExpenseChart 
                                data={transformedChartData.map(item => ({ 
                                  ...item, 
                                  expenses: 0, 
                                  profit: 0 
                                }))} 
                                title="Pendapatan Bulanan"
                                height={window.innerWidth < 640 ? 250 : 300}
                              />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="expenses">
                    <div className="space-y-4 sm:space-y-6">
                      <div className="mb-4 sm:mb-6">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-700 mb-2">Analisis Pengeluaran</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Breakdown pengeluaran berdasarkan kategori</p>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="w-full overflow-hidden">
                          <ExpenseCategoryChart data={expenseCategories} />
                        </div>
                        
                        <Card className="border border-gray-200">
                          <CardContent className="p-4 sm:p-6">
                            <h4 className="text-base sm:text-lg font-semibold mb-4 text-gray-900">Tren Pengeluaran</h4>
                            <div className="w-full overflow-hidden">
                              {isLoading ? (
                                <div className="flex items-center justify-center h-[250px] sm:h-[300px]">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                              ) : (
                                <IncomeExpenseChart 
                                  data={transformedChartData.map(item => ({ 
                                    ...item, 
                                    income: 0, 
                                    profit: 0 
                                  }))} 
                                  title="Pengeluaran Bulanan"
                                  height={window.innerWidth < 640 ? 250 : 300}
                                />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Expense breakdown table - Responsive */}
                      <Card className="border border-gray-200">
                        <CardContent className="p-4 sm:p-6">
                          <h4 className="text-base sm:text-lg font-semibold mb-4 text-gray-900">Detail Pengeluaran</h4>
                          <div className="space-y-2 sm:space-y-3">
                            {expenseCategories.length > 0 ? (
                              expenseCategories.map((category, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                  <span className="font-medium text-gray-900 text-sm sm:text-base truncate">{category.category}</span>
                                  <div className="text-right ml-2">
                                    <span className="font-bold text-gray-900 text-sm sm:text-base">
                                      Rp {category.amount.toLocaleString('id-ID')}
                                    </span>
                                    <span className="text-xs sm:text-sm text-gray-500 ml-1 sm:ml-2">
                                      ({category.percentage.toFixed(1)}%)
                                    </span>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8">
                                <p className="text-gray-500 text-sm sm:text-base">Belum ada data pengeluaran</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfitLoss;
