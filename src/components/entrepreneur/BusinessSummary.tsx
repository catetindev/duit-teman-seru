
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
    loading 
  } = useBusinessSummary();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl">
            <CardContent className="p-8">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-10 w-32 mb-3" />
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
      gradient: 'from-emerald-500 via-emerald-600 to-teal-600',
      iconBg: 'bg-emerald-500',
      change: '+12.5%',
      changeColor: 'text-emerald-600'
    },
    {
      title: 'Sales Revenue',
      tooltip: 'Pendapatan dari POS Sales dan Orders (tidak termasuk manual income untuk menghindari duplikasi)',
      value: formatCurrency(totalRevenue, 'IDR'),
      icon: DollarSign,
      gradient: 'from-blue-500 via-blue-600 to-indigo-600',
      iconBg: 'bg-blue-500',
      change: `POS: ${formatCurrency(posRevenue, 'IDR')} | Orders: ${formatCurrency(orderRevenue, 'IDR')}`,
      changeColor: 'text-blue-600'
    },
    {
      title: 'Total Expenses',
      tooltip: 'Total pengeluaran bisnis dari semua sumber',
      value: formatCurrency(totalExpenses, 'IDR'),
      icon: TrendingDown,
      gradient: 'from-rose-500 via-rose-600 to-pink-600',
      iconBg: 'bg-rose-500',
      change: '-3.2%',
      changeColor: 'text-rose-600'
    }
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {cards.map((card, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Card className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-3xl cursor-help hover:scale-105">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                
                <CardContent className="p-8 relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wider">
                        {card.title}
                      </p>
                      <h4 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-1 break-all">
                        {card.value}
                      </h4>
                    </div>
                    <div className={`w-16 h-16 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${card.changeColor} bg-slate-50 border border-slate-100`}>
                      {card.change}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs bg-slate-900 text-white border-slate-700">
              <p className="text-sm">{card.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
