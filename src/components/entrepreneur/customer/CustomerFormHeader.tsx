
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CustomerFormHeaderProps {
  isEditMode: boolean;
}

export function CustomerFormHeader({ isEditMode }: CustomerFormHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>{isEditMode ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
    </DialogHeader>
  );
}
