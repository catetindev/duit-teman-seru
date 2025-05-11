
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InvoiceStatusFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function InvoiceStatusFilter({ value, onChange }: InvoiceStatusFilterProps) {
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
    </Tabs>
  );
}
