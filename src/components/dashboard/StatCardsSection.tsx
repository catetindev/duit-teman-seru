
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardStats } from '@/hooks/useDashboardData';

interface StatCardsSectionProps {
  stats: DashboardStats | null;
  loading: boolean;
}

const StatCardsSection = ({ stats, loading }: StatCardsSectionProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="bg-white border border-slate-200">
            <CardContent className="p-4">
              <Skeleton className="h-4 w-20 mb-2" />
              <Skeleton className="h-6 w-24 mb-2" />
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
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-100',
      change: '+12.5%',
      changeColor: 'text-emerald-600 bg-emerald-50'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(stats?.totalExpenses || 0, 'IDR'),
      icon: TrendingDown,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
      change: '-3.2%',
      changeColor: 'text-red-600 bg-red-50'
    },
    {
      title: 'Current Balance',
      value: formatCurrency(stats?.balance || 0, 'IDR'),
      icon: Wallet,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
      change: '+8.1%',
      changeColor: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Savings Rate',
      value: `${stats?.savingsRate || 0}%`,
      icon: DollarSign,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-100',
      change: '+15.3%',
      changeColor: 'text-purple-600 bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="bg-white border border-slate-200 hover:border-slate-300 transition-colors">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <div className={`px-2 py-1 rounded-lg text-xs font-medium ${card.changeColor}`}>
                {card.change}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-600">
                {card.title}
              </p>
              <h3 className="text-xl font-bold text-slate-900 break-all">
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
