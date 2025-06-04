
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InvoicesList } from '@/components/finance/invoices/InvoicesList';
import { useInvoices } from '@/hooks/finance/useInvoices';

export default function Invoices() {
  const { isPremium } = useAuth();
  const { isEntrepreneurMode } = useEntrepreneurMode();
  
  const {
    invoices,
    customers,
    products,
    loading,
    fetchInvoices
  } = useInvoices();

  // Show locked state if not in entrepreneur mode
  if (!isEntrepreneurMode) {
    return (
      <DashboardLayout isPremium={isPremium}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Lock className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">Invoice Generator</h3>
              <p className="text-muted-foreground mb-6">
                Switch to Entrepreneur mode to access invoice generation.
              </p>
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                variant="outline"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gradient">Invoice Generator</h1>
          <p className="text-muted-foreground text-lg">Create and manage professional invoices for your business</p>
        </div>
        
        {/* Content Section */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-6 sm:p-8">
          <InvoicesList
            invoices={invoices}
            customers={customers}
            products={products}
            loading={loading}
            onInvoiceChange={fetchInvoices}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
