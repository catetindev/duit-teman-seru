
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    { value: 'food', label: '🍔 Food & Dining' },
    { value: 'shopping', label: '🛍️ Shopping' },
    { value: 'entertainment', label: '🎮 Entertainment' },
    { value: 'bills', label: '🧾 Bills & Utilities' },
    { value: 'salary', label: '💰 Salary & Income' },
    { value: 'transport', label: '🚗 Transportation' },
    { value: 'health', label: '💊 Health & Medical' },
    { value: 'education', label: '📚 Education' },
    { value: 'business', label: '💼 Business' },
    { value: 'other', label: '📦 Other' }
  ];

  const timeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  return (
    <Card className="shadow-sm border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          Filters
          {!isPremium && (
            <Badge variant="outline" className="text-xs">
              Premium Required
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Time Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Time Period</label>
            <Select 
              value={timeFilter} 
              onValueChange={setTimeFilter}
              disabled={!isPremium}
            >
              <SelectTrigger className="h-10">
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
          
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-10">
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
          <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-purple-600 dark:text-purple-400">✨</span>
              <span className="font-medium text-purple-700 dark:text-purple-300">
                Upgrade to Premium
              </span>
              <span className="text-purple-600 dark:text-purple-400">
                to unlock advanced time filters and analytics
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionFilters;
