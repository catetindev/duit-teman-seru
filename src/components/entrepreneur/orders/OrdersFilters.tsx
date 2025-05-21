
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Filter, Search } from 'lucide-react';
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

  // Handle DateRange type correctly
  const handleDateChange = (newDateRange: DateRange | undefined) => {
    setDateRange(newDateRange);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('order.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>
              {statusFilter === 'all' ? t('order.allStatuses') : t(`order.status.${statusFilter.toLowerCase()}`)}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('order.allStatuses')}</SelectItem>
          <SelectItem value="Pending">{t('order.status.pending')}</SelectItem>
          <SelectItem value="Paid">{t('order.status.paid')}</SelectItem>
          <SelectItem value="Canceled">{t('order.status.canceled')}</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={customerFilter} onValueChange={setCustomerFilter}>
        <SelectTrigger>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>
              {customerFilter === 'all' ? t('order.allCustomers') : 
               customers.find(c => c.id === customerFilter)?.name || 'Customer'}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t('order.allCustomers')}</SelectItem>
          {customers.map(customer => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <DatePicker
        date={dateRange}
        onSelect={handleDateChange}
        preText="Date: "
        placeholder={t('order.selectDates')}
      />
      
      {dateRange?.from && (
        <div className="md:col-span-4 flex items-center">
          <span className="text-sm">
            {t('order.filteredByDate')}: {formatDateRange(dateRange.from, dateRange.to || dateRange.from)}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setDateRange(undefined)}
            className="ml-2 h-6 text-xs"
          >
            {t('order.clear')}
          </Button>
        </div>
      )}
    </div>
  );
}
