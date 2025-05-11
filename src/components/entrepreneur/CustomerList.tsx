
import React from 'react';
import { Customer } from '@/types/entrepreneur';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/formatUtils';

interface CustomerListProps {
  customers: Customer[];
  loading: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
}

// Helper to determine tag color
const getTagVariant = (tag: string) => {
  switch (tag.toLowerCase()) {
    case 'new':
      return 'default';
    case 'frequent':
    case 'regular':
      return 'secondary';
    case 'vip':
      return 'success';  
    case 'late payment':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function CustomerList({ customers, loading, onEdit, onDelete }: CustomerListProps) {
  if (loading) {
    return <div className="flex justify-center p-8">Loading customers...</div>;
  }

  if (customers.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="mb-4">No customers found. Add your first customer!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Last Order</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="font-medium">{customer.name}</div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {customer.phone && <div className="text-sm">{customer.phone}</div>}
                  {customer.email && <div className="text-sm text-muted-foreground">{customer.email}</div>}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {customer.tags && customer.tags.length > 0 ? (
                    customer.tags.map((tag, index) => (
                      <Badge key={index} variant={getTagVariant(tag)}>
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-sm">No tags</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {customer.last_order_date ? (
                  formatDate(new Date(customer.last_order_date))
                ) : (
                  <span className="text-muted-foreground">Never</span>
                )}
              </TableCell>
              <TableCell>
                {customer.notes ? (
                  <div className="max-w-xs truncate text-sm">{customer.notes}</div>
                ) : (
                  <span className="text-muted-foreground text-sm">No notes</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(customer)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(customer.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
