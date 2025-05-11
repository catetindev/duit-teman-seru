
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface InvoiceHeaderProps {
  onAddInvoice: () => void;
}

export function InvoiceHeader({ onAddInvoice }: InvoiceHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
        <p className="text-muted-foreground">
          Create, manage, and download professional invoices
        </p>
      </div>
      <Button onClick={onAddInvoice}>
        <Plus className="h-4 w-4 mr-2" />
        New Invoice
      </Button>
    </div>
  );
}
