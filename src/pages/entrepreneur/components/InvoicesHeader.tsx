
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface InvoicesHeaderProps {
  onAddInvoice: () => void;
}

export function InvoicesHeader({ onAddInvoice }: InvoicesHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold">Invoices</h1>
        <p className="text-muted-foreground">
          Manage your business invoices
        </p>
      </div>
      <Button onClick={onAddInvoice} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        New Invoice
      </Button>
    </div>
  );
}
