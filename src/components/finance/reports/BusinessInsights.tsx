
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
    if (expenseCategories.length === 0) return 'Marketing';
    return expenseCategories[0].category;
  };

  const getTopProduct = () => {
    if (topProducts.length === 0) return 'Product A';
    return topProducts[0].name;
  };

  const getProfitStatus = () => {
    const profitMargin = summary.totalIncome ? (((summary.totalIncome - summary.totalExpenses) / summary.totalIncome) * 100) : 0;
    return {
      isPositive: profitMargin > 0,
      margin: profitMargin,
      netProfit: summary.totalIncome - summary.totalExpenses
    };
  };

  const profitStatus = getProfitStatus();

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-sm sm:text-base lg:text-lg">Business Insights</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Rekomendasi berdasarkan data bisnis Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {/* Profit Status Insight */}
        <div className={`p-3 sm:p-4 border rounded-lg ${
          profitStatus.isPositive 
            ? 'bg-emerald-50 border-emerald-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base">
            {profitStatus.isPositive ? (
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
            Status Profitabilitas
          </h3>
          <p className="text-xs sm:text-sm mt-1">
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
        {expenseCategories.length > 0 && (
          <div className="p-3 sm:p-4 border rounded-lg bg-amber-50 border-amber-200">
            <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
              Optimasi Pengeluaran
            </h3>
            <p className="text-xs sm:text-sm mt-1">
              Kategori "{getTopExpenseCategory()}" merupakan pengeluaran terbesar 
              ({expenseCategories[0]?.percentage.toFixed(1)}%). 
              Evaluasi efisiensi di kategori ini untuk meningkatkan profit.
            </p>
          </div>
        )}
        
        {/* Product Performance */}
        {topProducts.length > 0 && (
          <div className="p-3 sm:p-4 border rounded-lg bg-blue-50 border-blue-200">
            <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base">
              <Target className="h-3 w-3 sm:h-4 sm:w-4" />
              Peluang Pertumbuhan
            </h3>
            <p className="text-xs sm:text-sm mt-1">
              Produk "{getTopProduct()}" berkontribusi signifikan terhadap revenue. 
              Pertimbangkan untuk memperluas lini produk serupa atau meningkatkan stok.
            </p>
          </div>
        )}

        {/* General Advice */}
        <div className="p-3 sm:p-4 border rounded-lg bg-purple-50 border-purple-200">
          <h3 className="font-medium flex items-center gap-2 text-sm sm:text-base">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            Rekomendasi Strategis
          </h3>
          <p className="text-xs sm:text-sm mt-1">
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
      </CardContent>
    </Card>
  );
};
