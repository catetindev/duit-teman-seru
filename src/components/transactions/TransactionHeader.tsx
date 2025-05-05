
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

interface TransactionHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onAddTransaction: () => void;
}

const TransactionHeader = ({
  searchQuery,
  setSearchQuery,
  onAddTransaction
}: TransactionHeaderProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl font-bold">{t('nav.transactions')}</h1>
      
      <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
        <div className="relative w-full md:w-60">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search Transactions"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>
        
        <Button 
          onClick={onAddTransaction}
          className="gap-2"
          size={isMobile ? "sm" : "default"}
        >
          <PlusCircle className="h-4 w-4" />
          Add Transaction
        </Button>
      </div>
    </div>
  );
};

export default TransactionHeader;
