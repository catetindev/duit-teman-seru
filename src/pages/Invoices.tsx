
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
        <div className="min-h-screen bg-slate-50">
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="w-full max-w-md bg-white border border-slate-200">
              <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <Lock className="h-16 w-16 text-slate-400 mb-4" />
                <h3 className="text-xl font-bold mb-2 text-slate-900">Invoice Generator</h3>
                <p className="text-slate-600 mb-6">
                  Switch to Entrepreneur mode to access invoice generation.
                </p>
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50"
                >
                  Go to Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header Section */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-slate-900">Invoice Generator</h1>
            <p className="text-slate-600 text-lg">Create and manage professional invoices for your business</p>
          </div>
          
          {/* Content Section */}
          <div className="bg-white border border-slate-200 p-6 sm:p-8">
            <InvoicesList
              invoices={invoices}
              customers={customers}
              products={products}
              loading={loading}
              onInvoiceChange={fetchInvoices}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
