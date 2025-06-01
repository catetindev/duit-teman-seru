
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Customer, Order, Product } from '@/types/entrepreneur';
import { DateRange } from 'react-day-picker';
import { useAuth } from '@/contexts/AuthContext';

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const fetchData = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching orders data for user:', user.id);
      
      // Fetch orders with customer information
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          customers:customer_id (id, name, email, phone)
        `)
        .eq('user_id', user.id)
        .order('order_date', { ascending: false });
      
      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      console.log('Raw orders data:', ordersData);

      // Fetch customers for filter
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id);
      
      if (customersError) {
        console.error('Error fetching customers:', customersError);
        throw customersError;
      }
      
      // Fetch products for the form
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);
      
      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw productsError;
      }

      // Transform orders data to handle the customer relationship
      const transformedOrders = ordersData?.map((order: any) => {
        console.log('Processing order:', order.id, order);
        
        // Parse products JSON if it exists
        let parsedProducts = [];
        try {
          if (order.products && typeof order.products === 'string') {
            parsedProducts = JSON.parse(order.products);
          } else if (order.products && Array.isArray(order.products)) {
            parsedProducts = order.products;
          }
        } catch (error) {
          console.error('Error parsing products for order:', order.id, error);
          parsedProducts = [];
        }

        return {
          ...order,
          customer: order.customers,
          products: parsedProducts
        };
      }) || [];

      console.log('Transformed orders:', transformedOrders);

      setOrders(transformedOrders);
      setCustomers(customersData as Customer[]);
      setProducts(productsData as Product[]);
    } catch (error: any) {
      console.error('Error in fetchData:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter orders based on search, status, customer and date
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      false;
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const matchesCustomer = customerFilter === 'all' || order.customer_id === customerFilter;
    
    const matchesDate = !dateRange?.from || (
      new Date(order.order_date) >= dateRange.from &&
      (!dateRange.to || new Date(order.order_date) <= dateRange.to)
    );
    
    return matchesSearch && matchesStatus && matchesCustomer && matchesDate;
  });

  return {
    orders: filteredOrders,
    allOrders: orders,
    customers,
    products,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    customerFilter,
    setCustomerFilter,
    dateRange,
    setDateRange,
    fetchData,
  };
}
