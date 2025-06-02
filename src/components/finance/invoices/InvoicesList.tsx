
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, Edit, Trash2, Download } from 'lucide-react';
import { Invoice } from '@/types/finance';
import { Customer, Product } from '@/types/entrepreneur';
import { formatCurrency } from '@/utils/formatUtils';
import { InvoiceFormDialog } from './InvoiceFormDialog';

interface InvoicesListProps {
  invoices: Invoice[];
  customers: Customer[];
  products: Product[];
  loading: boolean;
  onInvoiceChange: () => void;
}

export function InvoicesList({ 
  invoices, 
  customers, 
  products, 
  loading, 
  onInvoiceChange 
}: InvoicesListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleCreateNew = () => {
    setSelectedInvoice(null);
    setIsFormOpen(true);
  };

  const handleEdit = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedInvoice(null);
    onInvoiceChange();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Unpaid':
        return 'bg-red-100 text-red-800';
      case 'Overdue':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading invoices...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Invoices</CardTitle>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Invoice
          </Button>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No invoices found</p>
              <Button onClick={handleCreateNew} variant="outline">
                Create your first invoice
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => {
                const customer = customers.find(c => c.id === invoice.customer_id);
                return (
                  <div key={invoice.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-medium">{invoice.invoice_number}</h3>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Customer: {customer?.name || 'Unknown'}</p>
                          <p>Due: {new Date(invoice.payment_due_date).toLocaleDateString()}</p>
                          <p className="font-medium text-purple-700">
                            Total: {formatCurrency(Number(invoice.total), 'IDR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleEdit(invoice)}
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <InvoiceFormDialog
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        customers={customers}
        products={products}
        invoice={selectedInvoice}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}
