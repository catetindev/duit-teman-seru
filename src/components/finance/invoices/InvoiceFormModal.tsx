
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
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {invoice ? 'Edit Invoice' : 'Buat Invoice Baru'}
          </DialogTitle>
        </DialogHeader>

        <InvoiceCustomizationProvider>
          <InvoiceForm
            customers={customers}
            products={products}
            invoice={invoice}
            onSuccess={onSuccess}
            onClose={onClose}
          />
        </InvoiceCustomizationProvider>
      </DialogContent>
    </Dialog>
  );
}
