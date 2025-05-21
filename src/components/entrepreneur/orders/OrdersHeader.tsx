
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface OrdersHeaderProps {
  onAddNew: () => void;
}

export function OrdersHeader({ onAddNew }: OrdersHeaderProps) {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
      <h1 className="text-2xl font-bold mb-4 md:mb-0">{t('order.title')}</h1>
      <Button onClick={onAddNew} className="flex items-center gap-2">
        <Plus className="h-4 w-4" /> {t('order.new')}
      </Button>
    </div>
  );
}
