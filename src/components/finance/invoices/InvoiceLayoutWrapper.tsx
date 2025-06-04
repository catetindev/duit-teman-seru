
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface InvoiceLayoutWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function InvoiceLayoutWrapper({ 
  title, 
  description, 
  children, 
  actions 
}: InvoiceLayoutWrapperProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">{title}</h1>
              {description && (
                <p className="text-slate-600">{description}</p>
              )}
            </div>
            {actions && (
              <div className="flex gap-2">
                {actions}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <Card className="bg-white shadow-sm border-slate-200">
          <CardContent className="p-6">
            {children}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
