
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInvoicesFetch } from './useInvoicesFetch';
import { useInvoiceOperations } from './useInvoiceOperations';
import { useInvoiceAnalytics } from './useInvoiceAnalytics';
import { Customer, Product } from '@/types/entrepreneur';
import { supabase } from '@/integrations/supabase/client';

export function useInvoices() {
  const { user } = useAuth();
  const { invoices, loading, setInvoices, fetchInvoices } = useInvoicesFetch();
  const { operationLoading, generateInvoiceNumber, addInvoice, updateInvoice, deleteInvoice } = 
    useInvoiceOperations(setInvoices);
  const { calculateInvoiceTotals } = useInvoiceAnalytics(invoices);
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Wrap fetchInvoices with user context
  const fetchUserInvoices = async (status?: string) => {
    return user ? await fetchInvoices(user.id, status) : [];
  };

  // Wrap addInvoice with user context
  const addUserInvoice = async (data: any) => {
    return user ? await addInvoice(user.id, data) : null;
  };

  // Fetch customers and products
  const fetchCustomersAndProducts = async () => {
    if (!user?.id) return;
    
    try {
      // Fetch customers
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id);
      
      if (customersError) throw customersError;
      setCustomers(customersData || []);

      // Fetch products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);
      
      if (productsError) throw productsError;
      
      // Cast the type property to match our Product interface
      const typedProducts = (productsData || []).map(product => ({
        ...product,
        type: product.type as 'product' | 'service'
      })) as Product[];
      
      setProducts(typedProducts);
    } catch (error) {
      console.error('Error fetching customers and products:', error);
    }
  };

  // Load invoices, customers, and products when user changes
  useEffect(() => {
    if (user) {
      fetchUserInvoices();
      fetchCustomersAndProducts();
    }
  }, [user]);

  return {
    invoices,
    customers,
    products,
    loading: loading || operationLoading,
    fetchInvoices: fetchUserInvoices,
    generateInvoiceNumber,
    addInvoice: addUserInvoice,
    updateInvoice,
    deleteInvoice,
    calculateInvoiceTotals
  };
}
