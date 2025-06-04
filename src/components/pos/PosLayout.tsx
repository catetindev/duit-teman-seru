
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface PosLayoutProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  title?: string;
}

export function PosLayout({ leftPanel, rightPanel, title = "Kasir Digital" }: PosLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/50 px-6 sm:px-8 lg:px-10 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
                💳 {title}
              </h1>
              <p className="text-slate-600 text-lg mt-2">Kelola penjualan dan transaksi dengan mudah</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border border-green-200">
                <span className="text-green-700 font-medium">🟢 Online</span>
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
            <Card className="h-full bg-white/70 backdrop-blur-sm border-0 shadow-xl shadow-blue-100/50">
              <CardHeader className="pb-6 border-b border-slate-100">
                <CardTitle className="text-xl text-slate-800 flex items-center gap-3">
                  🛍️ Produk
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
