
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatUtils";
import TransactionActions from "@/components/transactions/TransactionActions";
import { useCallback } from "react";

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
  className?: string;
  showEmpty?: boolean;
  onUpdate?: () => void;
  isLoading?: boolean;
}

const categoryIcons: Record<string, string> = {
  'food': '🍔',
  'transport': '🚗',
  'entertainment': '🎬',
  'shopping': '🛍️',
  'bills': '📄',
  'salary': '💰',
  'gift': '🎁',
  'other': '📦'
};

const TransactionList = ({ 
  transactions, 
  className, 
  showEmpty = true, 
  onUpdate = () => {}, 
  isLoading = false 
}: TransactionListProps) => {
  const { t } = useLanguage();

  const handleUpdate = useCallback(() => {
    console.log('Transaction update requested from list');
    onUpdate();
  }, [onUpdate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-sm text-muted-foreground">{t('transactions.loading')}</p>
      </div>
    );
  }

  if (transactions.length === 0 && showEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <span className="text-4xl mb-4">📋</span>
        <p className="text-muted-foreground">{t('transactions.empty')}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)} data-testid="transaction-list">
      {transactions.map((transaction) => (
        <div 
          key={transaction.id}
          className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center justify-between"
          data-testid={`transaction-item-${transaction.id}`}
        >
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-lg",
              transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
            )}>
              {transaction.icon || categoryIcons[transaction.category] || '💸'}
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
            <TransactionActions transaction={transaction} onUpdate={handleUpdate} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
