
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface PosLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  title?: string;
}

export function PosLayout({ leftPanel, rightPanel, title = "Point of Sale" }: PosLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{title}</h1>
          <p className="text-slate-600">Kelola penjualan dan transaksi dengan mudah</p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-h-[calc(100vh-200px)]">
          {/* Left Panel - Products */}
          <div className="xl:col-span-8">
            <Card className="h-full bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-800">Produk</CardTitle>
                <Separator />
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-320px)] px-4 sm:px-6 pb-6">
                  {leftPanel}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Cart & Payment */}
          <div className="xl:col-span-4">
            <div className="h-full sticky top-6">
              {rightPanel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
