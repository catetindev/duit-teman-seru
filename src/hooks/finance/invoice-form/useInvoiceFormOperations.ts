
import { Customer, Product } from '@/types/entrepreneur';
import { UseFormReturn, UseFieldArrayReturn } from 'react-hook-form';
import { InvoiceFormData } from '@/components/finance/invoices/form/invoiceFormSchema';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface UseInvoiceFormOperationsProps {
  form: UseFormReturn<InvoiceFormData>;
  append: UseFieldArrayReturn<InvoiceFormData, 'items'>['append'];
  products: Product[];
  calculateTotals: () => void;
}

export function useInvoiceFormOperations({
  form,
  append,
  products,
  calculateTotals
}: UseInvoiceFormOperationsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);

  const refreshCustomers = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setCustomers(data || []);
    } catch (error) {
      console.error('Error refreshing customers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load customers',
        variant: 'destructive'
      });
    }
  };

  const addProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    append({
      description: product.name,
      quantity: 1,
      price: Number(product.price),
      total: Number(product.price)
    });
    
    setTimeout(calculateTotals, 100);
  };

  const addEmptyItem = () => {
    append({
      description: '',
      quantity: 1,
      price: 0,
      total: 0
    });
  };

  return {
    customers,
    setCustomers,
    refreshCustomers,
    addProduct,
    addEmptyItem
  };
}
