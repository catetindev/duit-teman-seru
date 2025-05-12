
import React, { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface InvoiceStatusFilterProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}

export function InvoiceStatusFilter({ value, onChange, children }: InvoiceStatusFilterProps) {
  return (
    <Tabs 
      value={value} 
      onValueChange={onChange}
      className="mb-4"
    >
      <TabsList>
        <TabsTrigger value="All">All</TabsTrigger>
        <TabsTrigger value="Paid">Paid</TabsTrigger>
        <TabsTrigger value="Unpaid">Unpaid</TabsTrigger>
        <TabsTrigger value="Overdue">Overdue</TabsTrigger>
      </TabsList>
      
      {/* Now we properly render TabsContent within the Tabs component */}
      <TabsContent value={value}>
        {children}
      </TabsContent>
    </Tabs>
  );
}
