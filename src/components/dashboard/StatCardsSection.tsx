
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { Skeleton } from '@/components/ui/skeleton';

interface Stats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
}

interface StatCardsSectionProps {
  stats: Stats | null;
  loading: boolean;
}

const StatCardsSection = ({ stats, loading }: StatCardsSectionProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl">
            <CardContent className="p-6">
              <Skeleton className="h-4 w-20 mb-3" />
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-3 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Income',
      value: formatCurrency(stats?.totalIncome || 0, 'IDR'),
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      change: '+12.5%',
      changeColor: 'text-emerald-600'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(stats?.totalExpenses || 0, 'IDR'),
      icon: TrendingDown,
      gradient: 'from-red-500 to-rose-600',
      bgGradient: 'from-red-50 to-rose-50',
      change: '-3.2%',
      changeColor: 'text-red-600'
    },
    {
      title: 'Current Balance',
      value: formatCurrency(stats?.balance || 0, 'IDR'),
      icon: Wallet,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      change: '+8.1%',
      changeColor: 'text-blue-600'
    },
    {
      title: 'Monthly Income',
      value: formatCurrency(stats?.monthlyIncome || 0, 'IDR'),
      icon: DollarSign,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      change: '+15.3%',
      changeColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="group bg-white/70 backdrop-blur-sm border-0 rounded-2xl hover:bg-white/80 transition-all duration-300 hover:scale-[1.02]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`px-2 py-1 rounded-lg text-xs font-medium ${card.changeColor} bg-gradient-to-r ${card.bgGradient}`}>
                {card.change}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600 uppercase tracking-wide">
                {card.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 break-all">
                {card.value}
              </h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatCardsSection;
