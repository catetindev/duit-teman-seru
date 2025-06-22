
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface InvoiceDialogHeaderProps {
  isEditMode: boolean;
}

export function InvoiceDialogHeader({ isEditMode }: InvoiceDialogHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>
        {isEditMode ? 'Edit Invoice' : 'Create New Invoice'}
      </DialogTitle>
    </DialogHeader>
  );
}
