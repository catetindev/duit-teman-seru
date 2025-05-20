
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTopProducts } from '@/hooks/finance/useTopProducts';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/formatUtils';
import { Package, TrendingUp } from 'lucide-react';

export function TopProductsList() {
  const { topProducts, loading } = useTopProducts();

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!topProducts.length) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Top Performing Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <Package className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No product data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium flex items-center">
          <TrendingUp className="h-4 w-4 mr-2 text-amber-500" />
          Top Performing Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topProducts.slice(0, 3).map((product, index) => (
            <div key={product.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-6 h-6 flex items-center justify-center rounded-full mr-2 ${
                  index === 0 
                    ? 'bg-amber-100 text-amber-700' 
                    : index === 1 
                    ? 'bg-gray-100 text-gray-700' 
                    : 'bg-amber-50 text-amber-600'
                }`}>
                  {index + 1}
                </div>
                <span className="font-medium text-sm truncate max-w-[140px]">{product.name}</span>
              </div>
              <span className="text-right text-sm font-semibold">
                {formatCurrency(product.revenue, 'IDR')}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
