
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { InvoiceFormModal } from '@/components/finance/invoices/InvoiceFormModal';
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
      <InvoiceFormModal
        open={isFormOpen}
        onClose={onFormClose}
        customers={customers}
        products={products}
        invoice={selectedInvoice}
        onSuccess={onFormSubmit}
      />

      <Dialog open={isPdfOpen} onOpenChange={onPdfClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Invoice Preview</DialogTitle>
            <DialogDescription>
              Preview and download your invoice as a PDF document.
            </DialogDescription>
          </DialogHeader>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              {selectedInvoice && currentCustomer && (
                <div className="relative">
                  <Button
                    className="absolute top-4 right-4"
                    onClick={onPrint}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <InvoicePdf 
                    invoice={selectedInvoice}
                    customer={currentCustomer}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}
