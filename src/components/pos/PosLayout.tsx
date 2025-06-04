
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 sm:p-8 lg:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{title}</h1>
          <p className="text-slate-600 text-lg">Kelola penjualan dan transaksi dengan mudah</p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 min-h-[calc(100vh-280px)]">
          {/* Left Panel - Products */}
          <div className="xl:col-span-8">
            <Card className="h-full bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-6">
                <CardTitle className="text-xl text-slate-800">Produk</CardTitle>
                <Separator />
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-400px)] px-6 pb-6">
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
