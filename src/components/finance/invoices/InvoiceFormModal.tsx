
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Customer, Product } from '@/types/entrepreneur';
import { Invoice } from '@/types/finance';
import { InvoiceForm } from './form/InvoiceForm';
import { InvoiceCustomizationProvider } from '@/contexts/InvoiceCustomizationContext';

interface InvoiceFormModalProps {
  open: boolean;
  onClose: () => void;
  customers: Customer[];
  products: Product[];
  invoice?: Invoice | null;
  onSuccess: () => void;
}

export function InvoiceFormModal({
  open,
  onClose,
  customers,
  products,
  invoice,
  onSuccess
}: InvoiceFormModalProps) {
  const handleClose = () => {
    console.log('Invoice form modal closing');
    onClose();
  };

  const handleSuccess = () => {
    console.log('Invoice form submitted successfully');
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {invoice ? 'Edit Invoice' : 'Create New Invoice'}
          </DialogTitle>
        </DialogHeader>

        <InvoiceCustomizationProvider>
          <InvoiceForm
            customers={customers}
            products={products}
            invoice={invoice}
            onSuccess={handleSuccess}
            onClose={handleClose}
          />
        </InvoiceCustomizationProvider>
      </DialogContent>
    </Dialog>
  );
}
