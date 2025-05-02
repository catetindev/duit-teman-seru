
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

interface TransactionFiltersProps {
  isPremium: boolean;
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
}

const TransactionFilters = ({
  isPremium, 
  timeFilter, 
  setTimeFilter, 
  categoryFilter, 
  setCategoryFilter
}: TransactionFiltersProps) => {
  const { t } = useLanguage();

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'food', label: '🍔 Food' },
    { value: 'shopping', label: '🛍️ Shopping' },
    { value: 'entertainment', label: '🎮 Entertainment' },
    { value: 'bills', label: '🧾 Bills' },
    { value: 'salary', label: '💰 Salary' },
    { value: 'transport', label: '🚗 Transport' },
    { value: 'health', label: '💊 Health' },
    { value: 'education', label: '📚 Education' },
    { value: 'other', label: '💸 Other' }
  ];

  const timeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  return (
    <Card className="p-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {isPremium && (
          <div className="w-full sm:w-1/2">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        <div className="w-full sm:w-1/2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {!isPremium && (
        <div className="mt-3 p-2 bg-purple-100 dark:bg-purple-900/30 text-xs rounded text-center">
          ✨ <span className="font-medium">{t('action.upgrade')}</span> to access time filters and more features
        </div>
      )}
    </Card>
  );
};

export default TransactionFilters;
