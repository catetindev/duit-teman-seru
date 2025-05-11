
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Customer } from '@/types/entrepreneur';

interface CustomerSelectionProps {
  customers: Customer[];
  selectedCustomerId: string;
  onCustomerChange: (value: string) => void;
  error?: string;
}

export function CustomerSelection({ 
  customers, 
  selectedCustomerId, 
  onCustomerChange,
  error
}: CustomerSelectionProps) {
  return (
    <div>
      <Label htmlFor="customer">Customer *</Label>
      <Select
        value={selectedCustomerId}
        onValueChange={onCustomerChange}
      >
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <SelectValue placeholder="Select customer" />
        </SelectTrigger>
        <SelectContent>
          {customers.map(customer => (
            <SelectItem key={customer.id} value={customer.id}>
              {customer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
