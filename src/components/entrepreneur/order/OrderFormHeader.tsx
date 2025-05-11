
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface OrderFormHeaderProps {
  isEditMode: boolean;
}

export function OrderFormHeader({ isEditMode }: OrderFormHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>{isEditMode ? 'Edit Order' : 'Create New Order'}</DialogTitle>
    </DialogHeader>
  );
}
