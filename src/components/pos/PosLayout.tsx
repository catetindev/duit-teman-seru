
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{title}</h1>
          <p className="text-slate-600">Kelola transaksi penjualan dengan mudah</p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Products */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-800">Produk</CardTitle>
                <Separator />
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-320px)] px-6 pb-6">
                  {leftPanel}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Cart & Payment */}
          <div className="lg:col-span-1">
            <div className="h-full">
              {rightPanel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
