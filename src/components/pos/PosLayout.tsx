
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
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200 px-6 sm:px-8 lg:px-10 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {title}
              </h1>
              <p className="text-gray-600 text-lg mt-2">Kelola penjualan dan transaksi dengan mudah</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <span className="text-green-700 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left Panel */}
          <div className="xl:col-span-8">
            <Card className="h-full bg-white border border-gray-200">
              <CardHeader className="pb-6 border-b border-gray-100">
                <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                  Produk
                </CardTitle>
                <Separator />
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-400px)] px-6 pb-6">
                  {leftPanel}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel */}
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
