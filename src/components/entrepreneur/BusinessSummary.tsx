import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { useBusinessRevenue } from '@/hooks/entrepreneur/useBusinessRevenue';
import { Skeleton } from '@/components/ui/skeleton';

export function BusinessSummary() {
  const { revenueData, loading } = useBusinessRevenue();

  if (loading) {
    return (
      <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 border-b">
          <CardTitle className="flex items-center gap-3 text-slate-800">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            Business Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-xl">
                <Skeleton className="h-8 w-28 mb-2" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const isGrowthPositive = revenueData.monthlyGrowth >= 0;

  return (
    <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="flex items-center gap-3 text-slate-800">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
          Business Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-emerald-50 rounded-xl">
            <div className="flex items-center gap-2 mb-1.5">
              {isGrowthPositive ? (
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              <span className={`text-xl sm:text-2xl font-bold ${
                isGrowthPositive ? 'text-emerald-600' : 'text-red-500'
              }`}>
                {Math.abs(revenueData.monthlyGrowth).toFixed(1)}%
              </span>
            </div>
            <div className="text-sm font-medium text-slate-600">Monthly Growth</div>
            <div className="text-xs text-slate-500 mt-1.5">
              Compared to last month
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="text-xl sm:text-2xl font-bold text-slate-800 mb-1.5">
              {formatCurrency(revenueData.totalRevenue, 'IDR')}
            </div>
            <div className="text-sm font-medium text-slate-600">Total Revenue</div>
            <div className="text-xs text-slate-500 mt-1.5">
              Current month
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl">
            <div className="text-xl sm:text-2xl font-bold text-slate-800 mb-1.5">
              {formatCurrency(revenueData.posRevenue + revenueData.orderRevenue, 'IDR')}
            </div>
            <div className="text-sm font-medium text-slate-600">Sales Revenue</div>
            <div className="text-xs text-slate-500 mt-1.5">
              POS + Orders
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
