
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Settings } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface OrdersHeaderProps {
  onAddNew: () => void;
}

export function OrdersHeader({ onAddNew }: OrdersHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="w-full flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between gap-3">
      {/* Left side with toggle and title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 flex-shrink-0">
          <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
          Orders & Transactions
        </h1>
      </div>
      
      {/* Right side with add button */}
      <Button 
        onClick={onAddNew} 
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-3 sm:px-4 py-2 h-8 sm:h-9 md:h-10 text-sm md:text-base flex-shrink-0"
      >
        <Plus className="h-3 w-3 sm:h-4 sm:w-4" /> 
        <span className="hidden xs:inline">{t('order.new')}</span>
        <span className="xs:hidden">Add</span>
      </Button>
    </div>
  );
}
