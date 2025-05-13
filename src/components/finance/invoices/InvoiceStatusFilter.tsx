import React, { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils'; // Import cn utility

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
      <TabsList className={cn(
        "w-full grid grid-cols-2 sm:grid-cols-4", // Use grid for mobile, switch to 4 columns on sm+
        "bg-muted/60 rounded-full p-1 mb-2" // Existing styles
      )}>
        <TabsTrigger value="All" className="rounded-full">All</TabsTrigger>
        <TabsTrigger value="Paid" className="rounded-full">Paid</TabsTrigger>
        <TabsTrigger value="Unpaid" className="rounded-full">Unpaid</TabsTrigger>
        <TabsTrigger value="Overdue" className="rounded-full">Overdue</TabsTrigger>
      </TabsList>
      
      {/* Now we properly render TabsContent within the Tabs component */}
      <TabsContent value={value}>
        {children}
      </TabsContent>
    </Tabs>
  );
}