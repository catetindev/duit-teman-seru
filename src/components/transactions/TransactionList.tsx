
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { formatCurrency } from '@/hooks/useDashboardData';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import TransactionActions from './TransactionActions';

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

const TransactionList = ({ transactions, isLoading = false, onUpdate = () => {} }: TransactionListProps) => {
  const { t } = useLanguage();
  
  if (isLoading) {
    return (
      <div className="py-10 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">{t('transactions.loading')}</p>
      </div>
    );
  }
  
  if (transactions.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <span className="text-5xl mb-4">💸</span>
        <h3 className="text-xl font-bold">{t('transactions.emptyTitle')}</h3>
        <p className="text-muted-foreground mt-2">Your wallet is safe... for now 👀</p>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="p-4 hover:shadow-md transition-shadow card-hover">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-xl",
                transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
              )}>
                {transaction.icon || '💸'}
              </div>
              <div>
                <h4 className="font-medium">{transaction.description}</h4>
                <p className="text-xs text-muted-foreground">{transaction.category} • {transaction.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={cn(
                "font-semibold",
                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
              )}>
                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount, transaction.currency)}
              </div>
              <TransactionActions transaction={transaction} onUpdate={onUpdate} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default TransactionList;
