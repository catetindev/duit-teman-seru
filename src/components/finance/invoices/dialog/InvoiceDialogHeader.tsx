
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface InvoiceDialogHeaderProps {
  isEditMode: boolean;
}

export function InvoiceDialogHeader({ isEditMode }: InvoiceDialogHeaderProps) {
  return (
    <DialogHeader>
      <DialogTitle>
        {isEditMode ? 'Edit Invoice' : 'Create New Invoice'}
      </DialogTitle>
      <DialogDescription>
        {isEditMode 
          ? 'Update the invoice details and save your changes.' 
          : 'Fill in the form below to create a new invoice for your customer.'
        }
      </DialogDescription>
    </DialogHeader>
  );
}
