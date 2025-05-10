import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { categoryIcons } from '@/components/dashboard/DashboardData';

interface AddTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded: () => void;
  initialCategory?: string;
  initialType?: 'income' | 'expense';
}

const CATEGORIES = [
  { label: 'Food', value: 'food', icon: '🍔' },
  { label: 'Transport', value: 'transport', icon: '🚗' },
  { label: 'Entertainment', value: 'entertainment', icon: '🎬' },
  { label: 'Shopping', value: 'shopping', icon: '🛍️' },
  { label: 'Bills', value: 'bills', icon: '📄' },
  { label: 'Salary', value: 'salary', icon: '💰' },
  { label: 'Gift', value: 'gift', icon: '🎁' },
  { label: 'Business', value: 'Business', icon: '💼' },
  { label: 'Other', value: 'other', icon: '📦' }
];

const AddTransactionDialog = ({ isOpen, onClose, onTransactionAdded, initialCategory = '', initialType = 'expense' }: AddTransactionDialogProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [transaction, setTransaction] = useState({
    type: initialType,
    amount: '',
    category: initialCategory,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when initialType or initialCategory changes
  useEffect(() => {
    setTransaction(prev => ({
      ...prev,
      type: initialType,
      category: initialCategory
    }));
  }, [initialType, initialCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (!transaction.amount || !transaction.category) {
        setError('Please fill in all required fields');
        return;
      }
      
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: transaction.type,
          amount: parseFloat(transaction.amount),
          category: transaction.category,
          description: transaction.description,
          date: transaction.date,
          currency: 'IDR'
        });
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Your transaction has been added.",
      });
      
      onClose();
      onTransactionAdded();
      
      // Reset form
      setTransaction({
        type: initialType,
        amount: '',
        category: initialCategory,
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      
    } catch (error: any) {
      console.error('Error adding transaction:', error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Record your income or expense transaction.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <RadioGroup 
              value={transaction.type}
              onValueChange={(value) => setTransaction(prev => ({ ...prev, type: value as 'income' | 'expense' }))}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="cursor-pointer">
                  Expense
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="cursor-pointer">
                  Income
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (IDR) *</Label>
            <Input 
              id="amount" 
              value={transaction.amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setTransaction(prev => ({ ...prev, amount: value }));
              }}
              placeholder="50000"
              required
            />
            {transaction.amount && (
              <p className="text-sm text-muted-foreground">
                Rp {parseInt(transaction.amount).toLocaleString('id-ID')}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select 
              value={transaction.category}
              onValueChange={(value) => setTransaction(prev => ({ ...prev, category: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.filter(cat => 
                  transaction.type === 'income' ? 
                    ['salary', 'gift', 'Business', 'other'].includes(cat.value) : 
                    !['salary'].includes(cat.value)
                ).map(category => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      <span>{category.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={transaction.description}
              onChange={(e) => setTransaction(prev => ({ ...prev, description: e.target.value }))}
              placeholder="What was this transaction for?"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date"
              value={transaction.date}
              onChange={(e) => setTransaction(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Transaction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
