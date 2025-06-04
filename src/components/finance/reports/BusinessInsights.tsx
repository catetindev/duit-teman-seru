
import React from 'react';
import { ExpenseCategory, TopProduct, FinanceSummary } from '@/types/finance';
import { TrendingUp, TrendingDown, AlertTriangle, Target } from 'lucide-react';
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
  // Generate insights based on real data
  const getTopExpenseCategory = () => {
    if (expenseCategories.length === 0) return null;
    return expenseCategories[0];
  };

  const getTopProduct = () => {
    if (topProducts.length === 0) return null;
    return topProducts[0];
  };

  const getProfitStatus = () => {
    const netProfit = summary.totalIncome - summary.totalExpenses;
    const profitMargin = summary.totalIncome > 0 ? ((netProfit / summary.totalIncome) * 100) : 0;
    return {
      isPositive: netProfit > 0,
      margin: profitMargin,
      netProfit: netProfit
    };
  };

  const profitStatus = getProfitStatus();
  const topExpenseCategory = getTopExpenseCategory();
  const topProduct = getTopProduct();

  return (
    <Card className="h-full bg-white border border-slate-200">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-sm sm:text-base lg:text-lg text-slate-900">Business Insights</CardTitle>
        <CardDescription className="text-xs sm:text-sm text-slate-600">
          Rekomendasi berdasarkan data bisnis Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Profit Status Insight */}
        <div className={`p-3 sm:p-4 border border-slate-200 ${
          profitStatus.isPositive 
            ? 'bg-green-50' 
            : 'bg-red-50'
        }`}>
          <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base text-slate-900">
            {profitStatus.isPositive ? (
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
            )}
            Status Profitabilitas
          </h3>
          <p className="text-xs sm:text-sm mt-1 text-slate-700">
            {profitStatus.isPositive ? (
              <>
                Bisnis Anda profitable dengan margin {profitStatus.margin.toFixed(1)}% 
                dan laba bersih {formatCurrency(profitStatus.netProfit, 'IDR')}.
              </>
            ) : (
              <>
                Bisnis mengalami kerugian {formatCurrency(Math.abs(profitStatus.netProfit), 'IDR')}. 
                Perlu evaluasi strategi bisnis dan efisiensi operasional.
              </>
            )}
          </p>
        </div>

        {/* Expense Optimization */}
        {topExpenseCategory && (
          <div className="p-3 sm:p-4 border border-slate-200 bg-amber-50">
            <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base text-slate-900">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
              Optimasi Pengeluaran
            </h3>
            <p className="text-xs sm:text-sm mt-1 text-slate-700">
              Kategori "{topExpenseCategory.category}" merupakan pengeluaran terbesar 
              ({topExpenseCategory.percentage.toFixed(1)}%). 
              Evaluasi efisiensi di kategori ini untuk meningkatkan profit.
            </p>
          </div>
        )}
        
        {/* Product Performance */}
        {topProduct && (
          <div className="p-3 sm:p-4 border border-slate-200 bg-blue-50">
            <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base text-slate-900">
              <Target className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
              Peluang Pertumbuhan
            </h3>
            <p className="text-xs sm:text-sm mt-1 text-slate-700">
              Produk "{topProduct.name}" berkontribusi signifikan terhadap revenue. 
              Pertimbangkan untuk memperluas lini produk serupa atau meningkatkan stok.
            </p>
          </div>
        )}

        {/* General Advice */}
        <div className="p-3 sm:p-4 border border-slate-200 bg-purple-50">
          <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base text-slate-900">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
            Rekomendasi Strategis
          </h3>
          <p className="text-xs sm:text-sm mt-1 text-slate-700">
            {summary.totalIncome > 0 ? (
              <>
                Dengan total pendapatan {formatCurrency(summary.totalIncome, 'IDR')}, 
                fokus pada diversifikasi produk dan optimasi margin profit.
              </>
            ) : (
              <>
                Mulai dengan mencatat semua transaksi bisnis untuk mendapatkan 
                insight yang lebih akurat tentang performa keuangan.
              </>
            )}
          </p>
        </div>

        {/* No Data State */}
        {!topExpenseCategory && !topProduct && summary.totalIncome === 0 && (
          <div className="p-3 sm:p-4 border border-slate-200 bg-slate-50 text-center">
            <p className="text-xs sm:text-sm text-slate-600">
              Belum ada data yang cukup untuk memberikan insight bisnis. 
              Mulai dengan menambah transaksi untuk mendapatkan analisis yang lebih akurat.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
