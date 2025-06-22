
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InvoiceForm } from '@/components/finance/invoices/form/InvoiceForm';
import { InvoicePdf } from '@/components/finance/invoices/InvoicePdf';
import { Invoice } from '@/types/finance';
import { Customer, Product } from '@/types/entrepreneur';

interface InvoiceModalsProps {
  isFormOpen: boolean;
  isPdfOpen: boolean;
  selectedInvoice: Invoice | null;
  customers: Customer[];
  products: Product[];
  currentCustomer: Customer | null;
  onFormClose: () => void;
  onPdfClose: () => void;
  onFormSubmit: () => void;
  onPrint: () => void;
}

export function InvoiceModals({
  isFormOpen,
  isPdfOpen,
  selectedInvoice,
  customers,
  products,
  currentCustomer,
  onFormClose,
  onPdfClose,
  onFormSubmit,
  onPrint
}: InvoiceModalsProps) {
  return (
    <>
      {/* Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={onFormClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedInvoice ? 'Edit Invoice' : 'Create New Invoice'}
            </DialogTitle>
          </DialogHeader>
          
          <InvoiceForm
            customers={customers}
            products={products}
            invoice={selectedInvoice}
            onSuccess={onFormSubmit}
            onClose={onFormClose}
          />
        </DialogContent>
      </Dialog>

      {/* PDF Preview Modal */}
      <Dialog open={isPdfOpen} onOpenChange={onPdfClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Invoice Preview
              <Button onClick={onPrint} className="ml-4">
                Print PDF
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          {selectedInvoice && currentCustomer && (
            <InvoicePdf 
              invoice={selectedInvoice}
              customer={currentCustomer}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
