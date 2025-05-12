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
import { formatCurrency, formatDate } from '@/utils/formatUtils'; // Updated import

interface ExpensesTableProps {
  expenses: BusinessExpense[];
  onEdit: (expense: BusinessExpense) => void;
  onDelete: (id: string) => void;
}

export function ExpensesTable({ expenses, onEdit, onDelete }: ExpensesTableProps) {
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
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
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No expenses found
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.title}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs bg-muted">
                      {expense.category}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(new Date(expense.date))}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(Number(expense.amount), 'IDR')}
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
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}