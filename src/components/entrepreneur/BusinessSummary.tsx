
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
      <Card className="bg-white border-0 shadow-sm rounded-2xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-slate-800">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            Business Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <Skeleton className="h-8 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <Skeleton className="h-8 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-xl">
              <Skeleton className="h-8 w-24 mx-auto mb-2" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isGrowthPositive = revenueData.monthlyGrowth >= 0;

  return (
    <Card className="bg-white border-0 shadow-sm rounded-2xl overflow-hidden">
      <CardHeader className="pb-4 bg-emerald-50">
        <CardTitle className="flex items-center gap-3 text-slate-800">
          <div className="h-10 w-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
          Business Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div className="text-center p-4 bg-emerald-50 rounded-xl">
            <div className="text-xl md:text-2xl font-bold text-slate-800 mb-1">
              {formatCurrency(revenueData.totalRevenue, 'IDR')}
            </div>
            <div className="text-sm font-medium text-slate-600">Total Income</div>
            <div className="text-xs text-slate-500 mt-1">
              Includes all revenue sources
            </div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-xl md:text-2xl font-bold text-slate-800 mb-1">
              {formatCurrency(revenueData.posRevenue, 'IDR')}
            </div>
            <div className="text-sm font-medium text-slate-600">POS Sales</div>
            <div className="text-xs text-slate-500 mt-1">
              Point of sale transactions
            </div>
          </div>
          
          <div className="text-center p-4 bg-violet-50 rounded-xl">
            <div className="flex items-center justify-center gap-2 text-xl md:text-2xl font-bold text-slate-800 mb-1">
              {isGrowthPositive ? (
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-500" />
              )}
              <span className={isGrowthPositive ? 'text-emerald-600' : 'text-red-500'}>
                {Math.abs(revenueData.monthlyGrowth).toFixed(1)}%
              </span>
            </div>
            <div className="text-sm font-medium text-slate-600">Monthly Growth</div>
            <div className="text-xs text-slate-500 mt-1">
              Compared to last month
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
