
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, TrendingUp, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFinancialData } from '@/hooks/finance/useFinancialData';

export default function FinancialReports() {
  const { isPremium } = useAuth();
  const { isEntrepreneurMode } = useEntrepreneurMode();
  const [selectedTab, setSelectedTab] = useState('overview');
  
  const {
    summary,
    expenseCategories,
    topProducts,
    loading,
    fetchFinancialData
  } = useFinancialData();

  // Mock data for now - you can integrate with actual hooks later
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
              <h3 className="text-xl font-bold mb-2">Laporan Keuangan</h3>
              <p className="text-gray-600 mb-6">
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
      <div className="min-h-screen bg-gray-50">
        {/* Clean Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-6 mb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Laporan Keuangan
                </h1>
                <p className="text-gray-600 mt-2 text-lg">Dashboard lengkap untung rugi dan analisis bisnis</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
                  <span className="text-blue-700 font-medium">Financial Insights</span>
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
                    <div className="h-12 w-12 rounded-lg bg-green-600 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
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
                    <div className="h-12 w-12 rounded-lg bg-red-600 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-white" />
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
                    <div className="h-12 w-12 rounded-lg bg-blue-600 flex items-center justify-center">
                      <PieChart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Laba Bersih</p>
                      <p className={`text-2xl font-bold ${mockSummary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        Rp {mockSummary.netProfit.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-purple-600 flex items-center justify-center">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Margin Profit</p>
                      <p className={`text-2xl font-bold ${mockSummary.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
                <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
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
                      <div className="text-center py-12">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Ringkasan Keuangan</h3>
                        <p className="text-gray-600">Lihat performa bisnis Anda dalam satu pandangan</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="income">
                    <div className="space-y-6">
                      <div className="text-center py-12">
                        <h3 className="text-2xl font-bold text-green-600 mb-4">Analisis Pendapatan</h3>
                        <p className="text-gray-600">Detail sumber pendapatan bisnis Anda</p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="expenses">
                    <div className="space-y-6">
                      <div className="text-center py-12">
                        <h3 className="text-2xl font-bold text-red-600 mb-4">Analisis Pengeluaran</h3>
                        <p className="text-gray-600">Breakdown pengeluaran berdasarkan kategori</p>
                      </div>
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
}
