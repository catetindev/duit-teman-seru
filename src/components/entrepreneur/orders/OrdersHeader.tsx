
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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left side with toggle and title */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-9 w-9 md:h-10 md:w-10">
          <Settings className="h-4 w-4" />
        </Button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
          Orders & Transactions
        </h1>
      </div>
      
      {/* Right side with add button */}
      <Button 
        onClick={onAddNew} 
        className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 h-9 md:h-10 text-sm md:text-base"
      >
        <Plus className="h-4 w-4" /> 
        <span className="hidden sm:inline">{t('order.new')}</span>
        <span className="sm:hidden">Add</span>
      </Button>
    </div>
  );
}
