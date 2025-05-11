import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { InvoiceForm } from '@/components/finance/invoices/InvoiceForm';
import { InvoicesList } from '@/components/finance/invoices/InvoicesList';
import { InvoicePdf } from '@/components/finance/invoices/InvoicePdf';
import { useInvoices } from '@/hooks/finance/useInvoices';
import { Invoice, InvoiceFormData, InvoiceStatus } from '@/types/finance';
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

    const invoiceNumber = await generateInvoiceNumber();
    setSelectedInvoice(null);
    setIsFormOpen(true);
    
    // Pre-fill form with default values
    // Implementation details will depend on your form structure
  };

  // Handle form submission
  const handleFormSubmit = async (data: InvoiceFormData) => {
    try {
      if (selectedInvoice) {
        await updateInvoice({
          ...data,
          id: selectedInvoice.id
        });
        toast({
          title: 'Invoice Updated',
          description: `Invoice ${data.invoice_number} has been updated`
        });
      } else {
        await addInvoice(data);
        toast({
          title: 'Invoice Created',
          description: `Invoice ${data.invoice_number} has been created`
        });
      }
      setIsFormOpen(false);
      fetchInvoices(selectedFilter !== 'All' ? selectedFilter : undefined);
    } catch (error: any) {
      console.error('Error saving invoice:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
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
    // Look up customer from the nested customers data in the invoice
    const customer = (selectedInvoice as any).customers || 
      customers.find(c => c.id === selectedInvoice.customer_id);
    return customer;
  };

  // Create a function to properly cast Invoice to InvoiceFormData
  const prepareInvoiceForForm = (invoice: Invoice): Partial<InvoiceFormData> => {
    // Parse items if they're a string
    const items = Array.isArray(invoice.items) 
      ? invoice.items 
      : JSON.parse(typeof invoice.items === 'string' 
          ? invoice.items 
          : JSON.stringify(invoice.items));
    
    // Ensure status is a valid InvoiceStatus type
    const status = invoice.status as InvoiceStatus;
    
    return {
      ...invoice,
      items,
      status,
      payment_due_date: new Date(invoice.payment_due_date)
    };
  };

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground">
              Create, manage, and download professional invoices
            </p>
          </div>
          <Button onClick={handleAddInvoice}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>

        {/* Status Filters */}
        <Tabs 
          defaultValue="All" 
          value={selectedFilter}
          onValueChange={handleFilterChange}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Paid">Paid</TabsTrigger>
            <TabsTrigger value="Unpaid">Unpaid</TabsTrigger>
            <TabsTrigger value="Overdue">Overdue</TabsTrigger>
          </TabsList>

          <TabsContent value="All" className="space-y-4">
            <InvoicesList 
              invoices={invoices} 
              onViewInvoice={handleViewInvoice}
              onEditInvoice={handleEditInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onDownloadPdf={handleDownloadPdf}
            />
          </TabsContent>

          <TabsContent value="Paid" className="space-y-4">
            <InvoicesList 
              invoices={invoices.filter(inv => inv.status === 'Paid')} 
              onViewInvoice={handleViewInvoice}
              onEditInvoice={handleEditInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onDownloadPdf={handleDownloadPdf}
            />
          </TabsContent>

          <TabsContent value="Unpaid" className="space-y-4">
            <InvoicesList 
              invoices={invoices.filter(inv => inv.status === 'Unpaid')} 
              onViewInvoice={handleViewInvoice}
              onEditInvoice={handleEditInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onDownloadPdf={handleDownloadPdf}
            />
          </TabsContent>

          <TabsContent value="Overdue" className="space-y-4">
            <InvoicesList 
              invoices={invoices.filter(inv => inv.status === 'Overdue')} 
              onViewInvoice={handleViewInvoice}
              onEditInvoice={handleEditInvoice}
              onDeleteInvoice={handleDeleteInvoice}
              onDownloadPdf={handleDownloadPdf}
            />
          </TabsContent>
        </Tabs>

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

        {/* Invoice Form Sheet */}
        <Sheet 
          open={isFormOpen} 
          onOpenChange={setIsFormOpen}
        >
          <SheetContent side="right" className="w-full sm:w-[600px] md:w-[900px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{selectedInvoice ? 'Edit Invoice' : 'Create New Invoice'}</SheetTitle>
              <SheetDescription>
                {selectedInvoice
                  ? `Editing Invoice #${selectedInvoice.invoice_number}`
                  : 'Enter the details for your new invoice'}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <InvoiceForm
                defaultValues={selectedInvoice ? prepareInvoiceForForm(selectedInvoice) : undefined}
                customers={customers}
                products={products}
                onSubmit={handleFormSubmit}
                onCancel={() => setIsFormOpen(false)}
                loading={loading.customers || loading.products}
              />
            </div>
          </SheetContent>
        </Sheet>

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
  );
};

export default Invoices;
