
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Search, X } from 'lucide-react';
import { Customer } from '@/types/entrepreneur';
import { DatePicker } from '@/components/ui/date-picker';
import { DateRange } from 'react-day-picker';
import { formatDateRange } from '@/utils/formatUtils';
import { useLanguage } from '@/hooks/useLanguage';

interface OrdersFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  customerFilter: string;
  setCustomerFilter: (customerId: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
  customers: Customer[];
}

export function OrdersFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  customerFilter,
  setCustomerFilter,
  dateRange,
  setDateRange,
  customers
}: OrdersFiltersProps) {
  const { t } = useLanguage();

  const handleDateChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
  };

  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Search Bar - Full Width on Mobile */}
      <div className="w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 h-9 sm:h-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-sm"
          />
        </div>
      </div>
      
      {/* Filters Row - Responsive Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full h-9 sm:h-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 min-w-0">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">
                {statusFilter === 'all' ? 'All Status' : statusFilter}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
        
        {/* Customer Filter */}
        <Select value={customerFilter} onValueChange={setCustomerFilter}>
          <SelectTrigger className="w-full h-9 sm:h-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-2 min-w-0">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm truncate">
                {customerFilter === 'all' ? 'All Customers' : 
                 customers.find(c => c.id === customerFilter)?.name || 'Customer'}
              </span>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Customers</SelectItem>
            {customers.map(customer => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {/* Date Range Picker */}
        <div className="w-full">
          <DatePicker
            date={dateRange}
            onSelect={handleDateChange}
            preText=""
            placeholder="Select dates"
          />
        </div>
        
        {/* Clear Filters Button */}
        {(searchQuery || statusFilter !== 'all' || customerFilter !== 'all' || dateRange) && (
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setCustomerFilter('all');
              setDateRange(undefined);
            }}
            className="w-full h-9 sm:h-10 text-xs sm:text-sm"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Clear All
          </Button>
        )}
      </div>
      
      {/* Active filters indicator */}
      {dateRange?.from && (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
          <span>Date range: {formatDateRange(dateRange.from, dateRange.to || dateRange.from)}</span>
        </div>
      )}
    </div>
  );
}
