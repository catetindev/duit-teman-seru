
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl sm:rounded-3xl">
            <CardContent className="p-6 sm:p-8">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 sm:h-10 w-32 mb-3" />
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
      gradient: 'from-emerald-400 via-emerald-500 to-teal-500',
      iconBg: 'from-emerald-500 to-teal-600',
      change: '+12.5%',
      changeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200'
    },
    {
      title: 'Sales Revenue',
      tooltip: 'Pendapatan dari POS Sales dan Orders (tidak termasuk manual income untuk menghindari duplikasi)',
      value: formatCurrency(totalRevenue, 'IDR'),
      icon: DollarSign,
      gradient: 'from-blue-400 via-blue-500 to-indigo-500',
      iconBg: 'from-blue-500 to-indigo-600',
      change: `POS: ${formatCurrency(posRevenue, 'IDR')} | Orders: ${formatCurrency(orderRevenue, 'IDR')}`,
      changeColor: 'text-blue-700 bg-blue-50 border-blue-200'
    },
    {
      title: 'Total Expenses',
      tooltip: 'Total pengeluaran bisnis dari semua sumber',
      value: formatCurrency(totalExpenses, 'IDR'),
      icon: TrendingDown,
      gradient: 'from-rose-400 via-rose-500 to-pink-500',
      iconBg: 'from-rose-500 to-pink-600',
      change: '-3.2%',
      changeColor: 'text-rose-700 bg-rose-50 border-rose-200'
    }
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {cards.map((card, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Card className="group relative overflow-hidden bg-white/70 backdrop-blur-sm border-0 rounded-2xl sm:rounded-3xl cursor-help hover:bg-white/80 transition-all duration-300 hover:scale-[1.02]">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <CardContent className="p-6 sm:p-8 relative">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                        {card.title}
                      </p>
                      <h4 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-1 break-all">
                        {card.value}
                      </h4>
                    </div>
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold border ${card.changeColor}`}>
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
