
import React from 'react';
import { Customer } from '@/types/entrepreneur';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Users } from 'lucide-react';
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
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-slate-600">Loading customers...</span>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center p-12">
        <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-800 mb-2">No customers found</h3>
        <p className="text-slate-600 mb-4">Add your first customer to get started!</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Customer</TableHead>
            <TableHead className="w-[200px]">Contact</TableHead>
            <TableHead className="w-[150px]">Tags</TableHead>
            <TableHead className="w-[120px]">Last Order</TableHead>
            <TableHead className="min-w-[200px]">Notes</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>
                <div className="font-medium text-slate-800">{customer.name}</div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {customer.phone && <div className="text-sm text-slate-800">{customer.phone}</div>}
                  {customer.email && <div className="text-sm text-slate-500">{customer.email}</div>}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {customer.tags && customer.tags.length > 0 ? (
                    customer.tags.map((tag, index) => (
                      <Badge key={index} variant={getTagVariant(tag)} className="text-xs">
                        {tag}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-slate-400 text-sm">No tags</span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {customer.last_order_date ? (
                  <span className="text-sm text-slate-600">
                    {formatDate(new Date(customer.last_order_date))}
                  </span>
                ) : (
                  <span className="text-slate-400 text-sm">Never</span>
                )}
              </TableCell>
              <TableCell>
                {customer.notes ? (
                  <div className="max-w-xs truncate text-sm text-slate-600" title={customer.notes}>
                    {customer.notes}
                  </div>
                ) : (
                  <span className="text-slate-400 text-sm">No notes</span>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(customer)}
                    className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(customer.id)}
                    className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                  >
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
