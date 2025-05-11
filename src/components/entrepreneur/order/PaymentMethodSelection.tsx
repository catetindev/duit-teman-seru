
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

interface PaymentMethodSelectionProps {
  value: string;
  onChange: (value: string) => void;
}

export function PaymentMethodSelection({ value, onChange }: PaymentMethodSelectionProps) {
  return (
    <div>
      <Label htmlFor="payment_method">Payment Method</Label>
      <Select
        value={value}
        onValueChange={(value) => onChange(value as Order['payment_method'])}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select payment method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Cash">Cash</SelectItem>
          <SelectItem value="Transfer">Transfer</SelectItem>
          <SelectItem value="QRIS">QRIS</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
