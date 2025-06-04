
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, PiggyBank, ShoppingCart, FileText } from 'lucide-react';
import { useBusinessSummary } from '@/hooks/entrepreneur/useBusinessSummary';
import { formatCurrency } from '@/utils/formatUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function BusinessSummary() {
  const { 
    totalIncome, 
    totalRevenue,
    posRevenue,
    orderRevenue,
    totalExpenses, 
    netProfit, 
    profitMargin, 
    loading 
  } = useBusinessSummary();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white border border-slate-200 rounded-2xl">
            <CardContent className="p-4 lg:p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Business Income',
      tooltip: 'Pendapatan yang dicatat melalui form Business Income saja. Tidak termasuk POS Sales atau Orders.',
      value: formatCurrency(totalIncome, 'IDR'),
      icon: FileText,
      color: 'emerald',
      change: '+12.5%'
    },
    {
      title: 'Total Revenue',
      tooltip: 'Gabungan semua sumber pendapatan: Business Income + POS Sales + Orders',
      value: formatCurrency(totalRevenue, 'IDR'),
      icon: DollarSign,
      color: 'blue',
      change: `POS: ${formatCurrency(posRevenue, 'IDR')} | Orders: ${formatCurrency(orderRevenue, 'IDR')}`
    },
    {
      title: 'Total Expenses',
      tooltip: 'Total pengeluaran bisnis dari semua sumber',
      value: formatCurrency(totalExpenses, 'IDR'),
      icon: TrendingDown,
      color: 'red',
      change: '-3.2%'
    },
    {
      title: 'Net Profit',
      tooltip: 'Laba bersih dihitung dari Total Revenue dikurangi Total Expenses',
      value: formatCurrency(netProfit, 'IDR'),
      icon: netProfit >= 0 ? TrendingUp : TrendingDown,
      color: netProfit >= 0 ? 'emerald' : 'red',
      change: `Margin: ${profitMargin.toFixed(1)}%`
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      emerald: 'from-emerald-400 to-emerald-600 text-emerald-600',
      blue: 'from-blue-400 to-blue-600 text-blue-600',
      red: 'from-red-400 to-red-600 text-red-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {cards.map((card, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 cursor-help">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex flex-col min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-600 mb-1 truncate">{card.title}</p>
                      <h4 className="text-xl lg:text-2xl font-bold text-slate-800 break-all">{card.value}</h4>
                    </div>
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${getColorClasses(card.color).split(' ')[0]} ${getColorClasses(card.color).split(' ')[1]} flex items-center justify-center ml-2 flex-shrink-0`}>
                      <card.icon className="h-5 lg:h-6 w-5 lg:w-6 text-white" />
                    </div>
                  </div>
                  <p className={`text-xs font-medium ${getColorClasses(card.color).split(' ')[2]} truncate`}>
                    {card.change}
                  </p>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="text-sm">{card.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
