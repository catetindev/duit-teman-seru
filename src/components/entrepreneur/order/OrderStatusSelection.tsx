
import React from 'react';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Order } from '@/types/entrepreneur';

interface OrderStatusSelectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function OrderStatusSelection({ value, onChange }: OrderStatusSelectionProps) {
  return (
    <div>
      <Label htmlFor="status">Payment Status</Label>
      <Select
        value={value}
        onValueChange={(value) => onChange(value as Order['status'])}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Paid">Paid</SelectItem>
          <SelectItem value="Canceled">Canceled</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
