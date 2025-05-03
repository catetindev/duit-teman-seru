
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription 
} from '@/components/ui/dialog';
import { Transaction } from './transaction-types';
import { TransactionFormValues } from './transaction-form-schema';
import TransactionForm from './TransactionForm';

interface TransactionEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
  transaction: Transaction;
  isSubmitting: boolean;
}

const TransactionEditDialog = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  transaction, 
  isSubmitting 
}: TransactionEditDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Make changes to your transaction details below.
          </DialogDescription>
        </DialogHeader>
        
        <TransactionForm 
          onSubmit={onSubmit}
          transaction={transaction}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TransactionEditDialog;
