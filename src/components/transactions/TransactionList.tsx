
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrency } from '@/utils/formatUtils';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import TransactionActions from './TransactionActions';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: 'IDR' | 'USD';
  category: string;
  description: string;
  date: string;
  icon?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onUpdate?: () => void;
}

const categoryIcons: Record<string, string> = {
  'food': '🍔',
  'transport': '🚗',
  'entertainment': '🎬',
  'shopping': '🛍️',
  'bills': '📄',
  'salary': '💰',
  'gift': '🎁',
  'business': '💼',
  'health': '💊',
  'education': '📚',
  'other': '📦'
};

const TransactionList = ({ transactions, isLoading = false, onUpdate = () => {} }: TransactionListProps) => {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-4"></div>
        <p className="text-sm text-muted-foreground">{t('transactions.loading')}</p>
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <Card className="border-dashed border-2 border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-2xl">💸</span>
          </div>
          <h3 className="text-lg font-semibold mb-2">{t('transactions.emptyTitle')}</h3>
          <p className="text-muted-foreground max-w-sm">
            No transactions found. Start by adding your first business expense.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <Card 
          key={transaction.id} 
          className="group hover:shadow-md transition-all duration-200 border-border/50 hover:border-border"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              {/* Left Section - Icon and Details */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium border-2",
                  transaction.type === 'income' 
                    ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
                    : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                )}>
                  {transaction.icon || categoryIcons[transaction.category.toLowerCase()] || '💸'}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground truncate">
                      {transaction.description}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className="text-xs font-medium shrink-0"
                    >
                      {transaction.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              {/* Right Section - Amount and Actions */}
              <div className="flex items-center gap-3 shrink-0">
                <div className={cn(
                  "font-semibold text-lg",
                  transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                )}>
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount, transaction.currency)}
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <TransactionActions transaction={transaction} onUpdate={onUpdate} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TransactionList;
