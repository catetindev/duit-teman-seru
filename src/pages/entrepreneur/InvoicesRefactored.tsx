import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'; // Changed from Sheet
import { Card, CardContent } from '@/components/ui/card';
// Removed Sheet imports: Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle
import { InvoiceFormRefactored } from '@/components/finance/invoices/InvoiceFormRefactored';
import { InvoicesList } from '@/components/finance/invoices/InvoicesList';
import { InvoicePdf } from '@/components/finance/invoices/InvoicePdf';
import { InvoiceHeader } from '@/components/finance/invoices/InvoiceHeader';
import { InvoiceStatusFilter } from '@/components/finance/invoices/InvoiceStatusFilter';
import { Button } from '@/components/ui/button';
import { useInvoices } from '@/hooks/finance/useInvoices';
import { Invoice, InvoiceFormData } from '@/types/finance';
import { Customer, Product } from '@/types/entrepreneur';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText } from 'lucide-react';
import { useInvoiceCustomization } from '@/contexts/InvoiceCustomizationContext';

const InvoicesRefactored = () => {
  const {
    isPremium
  } = useAuth();
  const {
    toast
  } = useToast();
  const {
    logoUrl,
    showLogo,
    businessName
  } = useInvoiceCustomization();

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
    documentTitle: `Faktur_${selectedInvoice?.invoice_number || 'unknown'}`,
    onAfterPrint: () => {
      toast({
        title: 'PDF Siap',
        description: 'Faktur Anda telah berhasil dibuat'
      });
    },
    contentRef: pdfRef
  });

  // Fetch customers and products
  const fetchData = async () => {
    try {
      setLoading({
        customers: true,
        products: true
      });

      // Fetch customers
      const {
        data: customersData,
        error: customersError
      } = await supabase.from('customers').select('*');
      if (customersError) throw customersError;
      setCustomers(customersData as Customer[]);

      // Fetch products
      const {
        data: productsData,
        error: productsError
      } = await supabase.from('products').select('*');
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
      setLoading({
        customers: false,
        products: false
      });
    }
  };

  // Handle creating a new invoice
  const handleAddInvoice = async () => {
    if (customers.length === 0) {
      toast({
        title: 'Tidak Ada Pelanggan',
        description: 'Silakan tambahkan pelanggan sebelum membuat faktur',
        variant: 'destructive'
      });
      return;
    }
    const invoiceNumber = await generateInvoiceNumber();
    setSelectedInvoice(null); // Ensure we are in "create" mode
    setIsFormOpen(true);
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
          title: 'Faktur Diperbarui',
          description: `Faktur ${data.invoice_number} telah diperbarui`
        });
      } else {
        await addInvoice(data);
        toast({
          title: 'Faktur Dibuat',
          description: `Faktur ${data.invoice_number} telah dibuat`
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
    if (window.confirm('Apakah Anda yakin ingin menghapus faktur ini?')) {
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
    const customer = (selectedInvoice as any).customers || customers.find(c => c.id === selectedInvoice.customer_id);
    return customer;
  };

  // Create a function to properly cast Invoice to InvoiceFormData
  const prepareInvoiceForForm = (invoice: Invoice): Partial<InvoiceFormData> => {
    // Parse items if they're a string
    const items = Array.isArray(invoice.items) ? invoice.items : JSON.parse(typeof invoice.items === 'string' ? invoice.items : JSON.stringify(invoice.items));

    // Ensure status is a valid InvoiceStatus type
    const status = invoice.status as any;
    return {
      ...invoice,
      items,
      status,
      payment_due_date: new Date(invoice.payment_due_date)
    };
  };
  return <DashboardLayout isPremium={isPremium}>
      <div className="space-y-6">
        {/* Header */}
        <InvoiceHeader onAddInvoice={handleAddInvoice} />

        {/* Status Filters with the content inside it now */}
        <InvoiceStatusFilter value={selectedFilter} onChange={handleFilterChange}>
          <div className="space-y-4">
            {/* Invoice List for current filter */}
            <InvoicesList invoices={selectedFilter === 'All' ? invoices : invoices.filter(inv => inv.status === selectedFilter)} onViewInvoice={handleViewInvoice} onEditInvoice={handleEditInvoice} onDeleteInvoice={handleDeleteInvoice} onDownloadPdf={handleDownloadPdf} />
          </div>
        </InvoiceStatusFilter>

        {/* Hidden div for PDF generation */}
        <div className="hidden">
          {selectedInvoice && getCurrentCustomer() && <InvoicePdf ref={pdfRef} invoice={selectedInvoice} customer={getCurrentCustomer() as Customer} />}
        </div>

        {/* Invoice Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="!duration-200 !transition-all !data-[state=closed]:slide-out-to-bottom !data-[state=open]:slide-in-from-bottom w-[90vw] sm:max-w-lg lg:max-w-2xl p-0 rounded-lg border shadow-lg">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-xl font-semibold">{selectedInvoice ? 'Edit Faktur' : 'Buat Faktur Baru'}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1.5">
                {selectedInvoice ? `Mengedit Faktur #${selectedInvoice.invoice_number}` : 'Masukkan detail faktur baru Anda'}
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 pb-6 overflow-y-auto scrollbar-thin max-h-[calc(100vh-12rem)]">
              <InvoiceFormRefactored 
                defaultValues={selectedInvoice ? prepareInvoiceForForm(selectedInvoice) : { invoice_number: invoicesLoading ? 'Loading...' : generateInvoiceNumber() } as Partial<InvoiceFormData>}
                customers={customers} 
                products={products} 
                onSubmit={handleFormSubmit} 
                onCancel={() => setIsFormOpen(false)} 
                loading={loading.customers || loading.products || invoicesLoading}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Invoice PDF Viewer Dialog */}
        <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
          <DialogContent className="max-w-4xl">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {selectedInvoice && getCurrentCustomer() && <div className="relative">
                    <Button className="absolute top-4 right-4" onClick={handlePrint}>
                      <FileText className="h-4 w-4 mr-2" />
                      Unduh PDF
                    </Button>
                    <InvoicePdf invoice={selectedInvoice} customer={getCurrentCustomer() as Customer} />
                  </div>}
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>;
};
export default InvoicesRefactored;