
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
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Business Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <Skeleton className="h-8 w-24 mx-auto mb-2 bg-white/20" />
              <Skeleton className="h-4 w-16 mx-auto bg-white/20" />
            </div>
            <div className="text-center">
              <Skeleton className="h-8 w-24 mx-auto mb-2 bg-white/20" />
              <Skeleton className="h-4 w-16 mx-auto bg-white/20" />
            </div>
            <div className="text-center">
              <Skeleton className="h-8 w-24 mx-auto mb-2 bg-white/20" />
              <Skeleton className="h-4 w-16 mx-auto bg-white/20" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isGrowthPositive = revenueData.monthlyGrowth >= 0;

  return (
    <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Business Performance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">
              {formatCurrency(revenueData.totalRevenue, 'IDR')}
            </div>
            <div className="text-sm opacity-90">Total Income</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold">
              {formatCurrency(revenueData.posRevenue, 'IDR')}
            </div>
            <div className="text-sm opacity-90">POS Sales</div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-xl font-bold">
              {isGrowthPositive ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {Math.abs(revenueData.monthlyGrowth).toFixed(1)}%
            </div>
            <div className="text-sm opacity-90">Monthly Growth</div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-white/20">
          <div className="text-center">
            <div className="text-lg font-semibold">
              Orders Revenue: {formatCurrency(revenueData.orderRevenue, 'IDR')}
            </div>
            <div className="text-sm opacity-90">From completed orders</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
