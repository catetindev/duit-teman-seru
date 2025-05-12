import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { BusinessExpense } from '@/types/finance';
import { formatCurrency, formatDate } from '@/utils/formatUtils';
import { Card, CardContent } from '@/components/ui/card'; // Import Card components
import { Badge } from '@/components/ui/badge'; // Import Badge component
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile hook

interface ExpensesTableProps {
  expenses: BusinessExpense[];
  onEdit: (expense: BusinessExpense) => void;
  onDelete: (id: string) => void;
}

export function ExpensesTable({ expenses, onEdit, onDelete }: ExpensesTableProps) {
  const isMobile = useIsMobile(); // Use the hook

  if (expenses.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="mb-4">No expenses found for this period.</p>
      </div>
    );
  }

  // Render mobile card view
  if (isMobile) {
    return (
      <div className="md:hidden space-y-4">
        {expenses.map((expense) => (
          <Card key={expense.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-base leading-tight">{expense.title}</h3>
                  <Badge variant="secondary" className="text-xs mt-1">{expense.category}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(expense)} className="h-7 w-7">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(expense.id)} className="h-7 w-7 text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                 <span className="text-muted-foreground">{formatDate(new Date(expense.date))}</span>
                 <span className="font-semibold text-lg text-red-500">
                   -{formatCurrency(Number(expense.amount), 'IDR')}
                 </span>
              </div>

              {expense.notes && (
                <div className="mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
                  {expense.notes}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Render desktop table view
  return (
    <div className="hidden md:block border rounded-md overflow-hidden">
      {/* Removed overflow-x-auto here as we now have a mobile view */}
      <div>
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.title}</TableCell>
                <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {expense.category}
                    </Badge>
                </TableCell>
                <TableCell>{formatDate(new Date(expense.date))}</TableCell>
                <TableCell className="text-right font-medium text-red-500">
                  -{formatCurrency(Number(expense.amount), 'IDR')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(expense)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => onDelete(expense.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}