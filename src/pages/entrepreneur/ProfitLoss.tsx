
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, TrendingUp, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFinancialData } from '@/hooks/finance/useFinancialData';
import { IncomeExpenseChart } from '@/components/finance/reports/IncomeExpenseChart';
import { ExpenseCategoryChart } from '@/components/finance/reports/ExpenseCategoryChart';
import { IncomeOverview } from '@/components/finance/reports/IncomeOverview';

const ProfitLoss = () => {
  const { isPremium } = useAuth();
  const { isEntrepreneurMode } = useEntrepreneurMode();
  
  const {
    summary,
    expenseCategories,
    topProducts,
    loading,
    fetchFinancialData
  } = useFinancialData();

  // Mock data for charts
  const mockChartData = [
    { name: 'Jan', income: 15000000, expenses: 8500000, profit: 6500000 },
    { name: 'Feb', income: 18000000, expenses: 9200000, profit: 8800000 },
    { name: 'Mar', income: 16500000, expenses: 8800000, profit: 7700000 },
    { name: 'Apr', income: 20000000, expenses: 10500000, profit: 9500000 },
    { name: 'May', income: 22000000, expenses: 11000000, profit: 11000000 },
    { name: 'Jun', income: 19500000, expenses: 9800000, profit: 9700000 },
  ];

  const mockSummary = {
    totalIncome: summary?.totalIncome || 15000000,
    totalExpenses: summary?.totalExpenses || 8500000,
    netProfit: (summary?.totalIncome || 15000000) - (summary?.totalExpenses || 8500000),
    profitMargin: summary?.profitMargin || 43.3
  };

  // Show locked state if not in entrepreneur mode
  if (!isEntrepreneurMode) {
    return (
      <DashboardLayout isPremium={isPremium}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md border border-gray-200">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Lock className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-bold mb-2">Laporan Untung Rugi</h3>
              <p className="text-gray-600 mb-6">
                Aktifkan Mode Bisnis untuk akses laporan untung rugi lengkap.
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
      <div className="min-h-screen bg-gray-50">
        {/* Clean Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6 mb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Laporan Untung Rugi
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Analisis lengkap performa keuangan bisnis Anda</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <span className="text-blue-700 font-medium">Financial Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Pendapatan</p>
                      <p className="text-2xl font-bold text-gray-900">Rp {mockSummary.totalIncome.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-red-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Pengeluaran</p>
                      <p className="text-2xl font-bold text-gray-900">Rp {mockSummary.totalExpenses.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <PieChart className="h-6 w-6 text-blue-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Laba Bersih</p>
                      <p className={`text-2xl font-bold ${mockSummary.netProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        Rp {mockSummary.netProfit.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-purple-700" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Margin Profit</p>
                      <p className={`text-2xl font-bold ${mockSummary.profitMargin >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {mockSummary.profitMargin.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Card className="bg-white border border-gray-200">
              <CardContent className="p-8">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-50">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="income" className="flex items-center gap-2">
                      Pendapatan
                    </TabsTrigger>
                    <TabsTrigger value="expenses" className="flex items-center gap-2">
                      Pengeluaran
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview">
                    <div className="space-y-6">
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Ringkasan Keuangan</h3>
                        <p className="text-gray-600">Lihat performa bisnis Anda dalam satu pandangan</p>
                      </div>
                      
                      {/* Financial Trend Chart */}
                      <IncomeExpenseChart 
                        data={mockChartData} 
                        title="Tren Keuangan 6 Bulan Terakhir"
                        height={400}
                      />
                      
                      {/* Bottom section with expense breakdown */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                        <ExpenseCategoryChart data={expenseCategories} />
                        
                        <Card className="border border-gray-200">
                          <CardContent className="p-6">
                            <h4 className="text-lg font-semibold mb-4 text-gray-900">Insight Bisnis</h4>
                            <div className="space-y-4">
                              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                <h5 className="font-medium text-green-800 mb-2">Performa Positif</h5>
                                <p className="text-sm text-green-700">
                                  Margin profit Anda {mockSummary.profitMargin.toFixed(1)}% menunjukkan bisnis yang sehat
                                </p>
                              </div>
                              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h5 className="font-medium text-blue-800 mb-2">Rekomendasi</h5>
                                <p className="text-sm text-blue-700">
                                  Pertahankan tren positif dan fokus pada efisiensi operasional
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="income">
                    <div className="space-y-6">
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-green-700 mb-2">Analisis Pendapatan</h3>
                        <p className="text-gray-600">Detail sumber pendapatan bisnis Anda</p>
                      </div>
                      
                      <IncomeOverview summary={mockSummary} />
                      
                      {/* Income trend chart */}
                      <Card className="border border-gray-200">
                        <CardContent className="p-6">
                          <h4 className="text-lg font-semibold mb-4 text-gray-900">Tren Pendapatan</h4>
                          <IncomeExpenseChart 
                            data={mockChartData.map(item => ({ 
                              ...item, 
                              expenses: 0, 
                              profit: 0 
                            }))} 
                            title="Pendapatan Bulanan"
                            height={300}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="expenses">
                    <div className="space-y-6">
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-red-700 mb-2">Analisis Pengeluaran</h3>
                        <p className="text-gray-600">Breakdown pengeluaran berdasarkan kategori</p>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <ExpenseCategoryChart data={expenseCategories} />
                        
                        <Card className="border border-gray-200">
                          <CardContent className="p-6">
                            <h4 className="text-lg font-semibold mb-4 text-gray-900">Tren Pengeluaran</h4>
                            <IncomeExpenseChart 
                              data={mockChartData.map(item => ({ 
                                ...item, 
                                income: 0, 
                                profit: 0 
                              }))} 
                              title="Pengeluaran Bulanan"
                              height={300}
                            />
                          </CardContent>
                        </Card>
                      </div>
                      
                      {/* Expense breakdown table */}
                      <Card className="border border-gray-200">
                        <CardContent className="p-6">
                          <h4 className="text-lg font-semibold mb-4 text-gray-900">Detail Pengeluaran</h4>
                          <div className="space-y-3">
                            {expenseCategories.map((category, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="font-medium text-gray-900">{category.category}</span>
                                <div className="text-right">
                                  <span className="font-bold text-gray-900">
                                    Rp {category.amount.toLocaleString('id-ID')}
                                  </span>
                                  <span className="text-sm text-gray-500 ml-2">
                                    ({category.percentage.toFixed(1)}%)
                                  </span>
                                </div>
                              </div>
                            ))}
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
