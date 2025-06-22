
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InvoiceForm } from './form/InvoiceForm';
import { Customer, Product } from '@/types/entrepreneur';
import { Invoice } from '@/types/finance';

interface InvoiceFormDialogProps {
  open: boolean;
  onClose: () => void;
  customers: Customer[];
  products: Product[];
  invoice?: Invoice | null;
  onSuccess: () => void;
}

export function InvoiceFormDialog({
  open,
  onClose,
  customers,
  products,
  invoice,
  onSuccess
}: InvoiceFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {invoice ? 'Edit Invoice' : 'Create New Invoice'}
          </DialogTitle>
          <DialogDescription>
            {invoice 
              ? 'Update the invoice details and save your changes.' 
              : 'Fill in the form below to create a new invoice for your customer.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <InvoiceForm
          customers={customers}
          products={products}
          invoice={invoice}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
