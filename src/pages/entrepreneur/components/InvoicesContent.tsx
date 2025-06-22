
import React from 'react';
import { EntrepreneurInvoicesList } from '@/components/finance/invoices/EntrepreneurInvoicesList';
import { InvoiceStatusFilter } from '@/components/finance/invoices/InvoiceStatusFilter';
import { Invoice } from '@/types/finance';

interface InvoicesContentProps {
  invoices: Invoice[];
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  onViewInvoice: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (id: string) => void;
  onDownloadPdf: (invoice: Invoice) => void;
}

export function InvoicesContent({
  invoices,
  selectedFilter,
  onFilterChange,
  onViewInvoice,
  onEditInvoice,
  onDeleteInvoice,
  onDownloadPdf
}: InvoicesContentProps) {
  const filteredInvoices = selectedFilter === 'All' 
    ? invoices 
    : invoices.filter(inv => inv.status === selectedFilter);

  return (
    <InvoiceStatusFilter value={selectedFilter} onChange={onFilterChange}>
      <div className="space-y-4">
        <EntrepreneurInvoicesList 
          invoices={filteredInvoices}
          onViewInvoice={onViewInvoice}
          onEditInvoice={onEditInvoice}
          onDeleteInvoice={onDeleteInvoice}
          onDownloadPdf={onDownloadPdf}
        />
      </div>
    </InvoiceStatusFilter>
  );
}
