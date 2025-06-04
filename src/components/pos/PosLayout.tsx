
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
    <div className="min-h-screen bg-slate-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {title}
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-1">Manage sales and transactions easily</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                <span className="text-green-700 font-medium text-sm">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Panel */}
          <div className="xl:col-span-8">
            <Card className="h-full bg-white border border-slate-200">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-lg text-slate-900 flex items-center gap-3">
                  Products
                </CardTitle>
                <Separator />
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-300px)] px-4 sm:px-6 pb-4 sm:pb-6">
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
