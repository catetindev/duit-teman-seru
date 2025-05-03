
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { z } from 'zod';
import TransactionEditDialog from './TransactionEditDialog';
import TransactionDeleteDialog from './TransactionDeleteDialog';
import { Transaction, TransactionFormSchema } from './transaction-types';

interface TransactionActionsProps {
  transaction: Transaction;
  onUpdate: () => void;
}

const TransactionActions = ({ transaction, onUpdate }: TransactionActionsProps) => {
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (values: z.infer<typeof TransactionFormSchema>) => {
    setIsSubmitting(true);
    try {
      console.log('Updating transaction with ID:', transaction.id, 'New values:', values);
      
      const { error } = await supabase
        .from('transactions')
        .update({
          type: values.type,
          amount: values.amount,
          currency: values.currency,
          category: values.category,
          description: values.description,
          date: values.date,
        })
        .eq('id', transaction.id);
      
      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
      
      setIsEditOpen(false);
      
      // Call onUpdate immediately and don't rely on setTimeout
      onUpdate();
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update transaction",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      console.log('Deleting transaction with ID:', transaction.id);
      
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transaction.id);
      
      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      
      setIsDeleteOpen(false);
      
      // Call onUpdate immediately and don't rely on setTimeout
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete transaction",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex items-center gap-1">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-gray-500 hover:text-blue-500 hover:bg-blue-50"
        onClick={() => setIsEditOpen(true)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-gray-500 hover:text-red-500 hover:bg-red-50"
        onClick={() => setIsDeleteOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      
      {/* Edit Transaction Dialog */}
      <TransactionEditDialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleSubmit}
        transaction={transaction}
        isSubmitting={isSubmitting}
      />
      
      {/* Delete Confirmation Dialog */}
      <TransactionDeleteDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default TransactionActions;
