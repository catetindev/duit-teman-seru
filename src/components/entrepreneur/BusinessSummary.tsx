
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingDown, DollarSign, FileText } from 'lucide-react';
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
    loading 
  } = useBusinessSummary();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white border border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-32 mb-3" />
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
      tooltip: 'Revenue recorded through Business Income form only. Does not include POS Sales or Orders.',
      value: formatCurrency(totalIncome, 'IDR'),
      icon: FileText,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      change: '+12.5%',
      changeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      title: 'Sales Revenue',
      tooltip: 'Revenue from POS Sales and Orders (excludes manual income to avoid duplication)',
      value: formatCurrency(totalRevenue, 'IDR'),
      icon: DollarSign,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      change: `POS: ${formatCurrency(posRevenue, 'IDR')} | Orders: ${formatCurrency(orderRevenue, 'IDR')}`,
      changeColor: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      title: 'Total Expenses',
      tooltip: 'Total business expenses from all sources',
      value: formatCurrency(totalExpenses, 'IDR'),
      icon: TrendingDown,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-100',
      change: '-3.2%',
      changeColor: 'text-rose-700 bg-rose-50 border-rose-200'
    }
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Card className="group bg-white border border-slate-200 cursor-help hover:border-slate-300 transition-colors">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                        {card.title}
                      </p>
                      <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 break-all">
                        {card.value}
                      </h4>
                    </div>
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                      <card.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${card.iconColor}`} />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold border ${card.changeColor}`}>
                      {card.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs bg-slate-900 text-white border-slate-700 text-sm">
              <p>{card.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
