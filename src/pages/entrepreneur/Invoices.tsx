import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { InvoiceCustomizationProvider } from '@/contexts/InvoiceCustomizationContext';
import { useInvoices } from '@/hooks/finance/useInvoices';
import { Invoice } from '@/types/finance';
import { Customer, Product } from '@/types/entrepreneur';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { InvoicesHeader } from './components/InvoicesHeader';
import { InvoicesContent } from './components/InvoicesContent';
import { InvoiceModals } from './components/InvoiceModals';
import { InvoicePdf } from '@/components/finance/invoices/InvoicePdf';

const Invoices = () => {
  const { isPremium } = useAuth();
  const { toast } = useToast();

  // States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState({ customers: true, products: true });
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const pdfRef = useRef<HTMLDivElement>(null);

  const { 
    invoices, 
    loading: invoicesLoading, 
    fetchInvoices,
    deleteInvoice
  } = useInvoices();

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

  const fetchData = async () => {
    try {
      setLoading({ customers: true, products: true });

      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*');
      
      if (customersError) throw customersError;
      setCustomers(customersData as Customer[]);

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

  const handleFormSubmit = async () => {
    setIsFormOpen(false);
    fetchInvoices(selectedFilter !== 'All' ? selectedFilter : undefined);
  };

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

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    fetchInvoices(value !== 'All' ? value : undefined);
  };

  const getCurrentCustomer = () => {
    if (!selectedInvoice) return null;
    const customer = (selectedInvoice as any).customers || 
      customers.find(c => c.id === selectedInvoice.customer_id);
    return customer;
  };

  useEffect(() => {
    fetchData();
    fetchInvoices();
  }, []);

  return (
    <InvoiceCustomizationProvider>
      <DashboardLayout isPremium={isPremium}>
        <div className="space-y-6">
          <InvoicesHeader onAddInvoice={handleAddInvoice} />

          <InvoicesContent
            invoices={invoices}
            selectedFilter={selectedFilter}
            onFilterChange={handleFilterChange}
            onViewInvoice={handleViewInvoice}
            onEditInvoice={handleEditInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onDownloadPdf={handleDownloadPdf}
          />

          <div className="hidden">
            {selectedInvoice && getCurrentCustomer() && (
              <InvoicePdf 
                ref={pdfRef}
                invoice={selectedInvoice}
                customer={getCurrentCustomer() as Customer}
              />
            )}
          </div>

          <InvoiceModals
            isFormOpen={isFormOpen}
            isPdfOpen={isPdfOpen}
            selectedInvoice={selectedInvoice}
            customers={customers}
            products={products}
            currentCustomer={getCurrentCustomer()}
            onFormClose={() => setIsFormOpen(false)}
            onPdfClose={() => setIsPdfOpen(false)}
            onFormSubmit={handleFormSubmit}
            onPrint={handlePrint}
          />
        </div>
      </DashboardLayout>
    </InvoiceCustomizationProvider>
  );
};

export default Invoices;
