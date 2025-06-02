
import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { InvoiceFormModal } from '@/components/finance/invoices/InvoiceFormModal';
import { EntrepreneurInvoicesList } from '@/components/finance/invoices/EntrepreneurInvoicesList';
import { InvoicePdf } from '@/components/finance/invoices/InvoicePdf';
import { InvoiceHeader } from '@/components/finance/invoices/InvoiceHeader';
import { InvoiceStatusFilter } from '@/components/finance/invoices/InvoiceStatusFilter';
import { InvoiceCustomizationProvider } from '@/contexts/InvoiceCustomizationContext';
import { Button } from '@/components/ui/button';
import { useInvoices } from '@/hooks/finance/useInvoices';
import { Invoice, InvoiceFormData } from '@/types/finance';
import { Customer, Product } from '@/types/entrepreneur';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Invoices = () => {
  const { isPremium } = useAuth();
  const { toast } = useToast();

  // States for invoice management
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState({
    customers: true,
    products: true
  });
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  // Ref for PDF generation
  const pdfRef = useRef<HTMLDivElement>(null);

  // Invoice hooks
  const { 
    invoices, 
    loading: invoicesLoading, 
    fetchInvoices,
    generateInvoiceNumber,
    addInvoice,
    updateInvoice,
    deleteInvoice
  } = useInvoices();

  // Print functionality
  const handlePrint = useReactToPrint({
    documentTitle: `Invoice_${selectedInvoice?.invoice_number || 'unknown'}`,
    onAfterPrint: () => {
      toast({
        title: 'PDF Ready',
        description: 'Your invoice has been generated successfully'
      });
    },
    contentRef: pdfRef,
  });

  // Fetch customers and products
  const fetchData = async () => {
    try {
      setLoading({ customers: true, products: true });

      // Fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*');
      
      if (customersError) throw customersError;
      setCustomers(customersData as Customer[]);

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');
      
      if (productsError) throw productsError;
      setProducts(productsData as Product[]);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading({ customers: false, products: false });
    }
  };

  // Handle creating a new invoice
  const handleAddInvoice = async () => {
    if (customers.length === 0) {
      toast({
        title: 'No Customers',
        description: 'Please add customers before creating invoices',
        variant: 'destructive'
      });
      return;
    }

    setSelectedInvoice(null);
    setIsFormOpen(true);
  };

  // Handle form submission
  const handleFormSubmit = async () => {
    setIsFormOpen(false);
    fetchInvoices(selectedFilter !== 'All' ? selectedFilter : undefined);
  };

  // Handle invoice actions
  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsPdfOpen(true);
  };

  const handleEditInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsFormOpen(true);
  };

  const handleDeleteInvoice = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      await deleteInvoice(id);
      fetchInvoices(selectedFilter !== 'All' ? selectedFilter : undefined);
    }
  };

  const handleDownloadPdf = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  // Filter invoices by status
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    fetchInvoices(value !== 'All' ? value : undefined);
  };

  // Initial data loading
  useEffect(() => {
    fetchData();
    fetchInvoices();
  }, []);

  // Get customer for selected invoice
  const getCurrentCustomer = () => {
    if (!selectedInvoice) return null;
    const customer = (selectedInvoice as any).customers || 
      customers.find(c => c.id === selectedInvoice.customer_id);
    return customer;
  };

  return (
    <InvoiceCustomizationProvider>
      <DashboardLayout isPremium={isPremium}>
        <div className="space-y-6">
          {/* Header */}
          <InvoiceHeader onAddInvoice={handleAddInvoice} />

          {/* Status Filters with the content inside it now */}
          <InvoiceStatusFilter value={selectedFilter} onChange={handleFilterChange}>
            <div className="space-y-4">
              {/* Invoice List for current filter */}
              <EntrepreneurInvoicesList 
                invoices={selectedFilter === 'All' 
                  ? invoices 
                  : invoices.filter(inv => inv.status === selectedFilter)} 
                onViewInvoice={handleViewInvoice}
                onEditInvoice={handleEditInvoice}
                onDeleteInvoice={handleDeleteInvoice}
                onDownloadPdf={handleDownloadPdf}
              />
            </div>
          </InvoiceStatusFilter>

          {/* Hidden div for PDF generation */}
          <div className="hidden">
            {selectedInvoice && getCurrentCustomer() && (
              <InvoicePdf 
                ref={pdfRef}
                invoice={selectedInvoice}
                customer={getCurrentCustomer() as Customer}
              />
            )}
          </div>

          {/* Invoice Form Modal */}
          <InvoiceFormModal
            open={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            customers={customers}
            products={products}
            invoice={selectedInvoice}
            onSuccess={handleFormSubmit}
          />

          {/* Invoice PDF Viewer Dialog */}
          <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
            <DialogContent className="max-w-4xl">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {selectedInvoice && getCurrentCustomer() && (
                    <div className="relative">
                      <Button
                        className="absolute top-4 right-4"
                        onClick={handlePrint}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <InvoicePdf 
                        invoice={selectedInvoice}
                        customer={getCurrentCustomer() as Customer}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </InvoiceCustomizationProvider>
  );
};

export default Invoices;
