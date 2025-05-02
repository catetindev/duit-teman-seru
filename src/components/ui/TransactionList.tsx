
import { useLanguage } from "@/hooks/useLanguage";
import { cn } from "@/lib/utils";

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
}

const formatCurrency = (amount: number, currency: 'IDR' | 'USD'): string => {
  if (currency === 'IDR') {
    return `Rp${amount.toLocaleString('id-ID')}`;
  }
  return `$${amount.toLocaleString('en-US')}`;
};

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

const TransactionList = ({ transactions, className, showEmpty = true }: TransactionListProps) => {
  const { t } = useLanguage();

  if (transactions.length === 0 && showEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <span className="text-4xl mb-4">📋</span>
        <p className="text-muted-foreground">{t('transactions.empty')}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {transactions.map((transaction) => (
        <div 
          key={transaction.id}
          className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center justify-between"
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
          <div className={cn(
            "font-semibold",
            transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
          )}>
            {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount, transaction.currency)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
