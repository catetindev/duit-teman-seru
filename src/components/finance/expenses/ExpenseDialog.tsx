
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BusinessExpense } from '@/types/finance';
import { ExpenseForm } from './ExpenseForm';

interface ExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  expense?: BusinessExpense;
  categories: string[];
  onSubmit: (data: Omit<BusinessExpense, 'id' | 'user_id' | 'created_at'>) => void;
}

export function ExpenseDialog({
  open,
  onClose,
  expense,
  categories,
  onSubmit
}: ExpenseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {expense ? 'Edit Expense' : 'Add New Expense'}
          </DialogTitle>
        </DialogHeader>
        <ExpenseForm
          expense={expense}
          categories={categories}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
