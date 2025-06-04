
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

  const deleteOrder = useCallback(async (orderId: string) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive',
      });
      return false;
    }

    try {
      console.log('Deleting order:', orderId);
      
      // Check if this is a POS order
      if (orderId.startsWith('pos-')) {
        const cleanId = orderId.replace('pos-', '');
        
        // Delete POS transaction
        const { error: posError } = await supabase
          .from('pos_transactions')
          .delete()
          .eq('id', cleanId)
          .eq('user_id', user.id);
          
        if (posError) throw posError;
        
        // Delete linked order if exists
        const { error: orderError } = await supabase
          .from('orders')
          .delete()
          .eq('pos_transaction_id', cleanId)
          .eq('user_id', user.id);
          
        if (orderError) {
          console.warn('Could not delete linked order:', orderError);
        }
      } else {
        // Regular order deletion
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', orderId)
          .eq('user_id', user.id);
          
        if (error) throw error;
      }
      
      toast({
        title: 'Success',
        description: 'Order deleted successfully',
      });
      
      // Refresh data
      await fetchData();
      return true;
    } catch (error: any) {
      console.error('Error deleting order:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete order',
        variant: 'destructive',
      });
      return false;
    }
  }, [user?.id]);

  const fetchData = useCallback(async () => {
    if (!user?.id) {
      console.log('No user ID available');
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

      console.log('Raw orders data from database:', ordersData);

      // Also fetch POS transactions that might not be linked to orders
      const { data: posTransactions, error: posError } = await supabase
        .from('pos_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('waktu_transaksi', { ascending: false });

      if (posError) {
        console.error('Error fetching POS transactions:', posError);
        // Don't throw, just log the error as POS data is supplementary
      }

      console.log('POS transactions data:', posTransactions);

      // Fetch customers for filter
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id);
      
      if (customersError) {
        console.error('Error fetching customers:', customersError);
        throw customersError;
      }
      
      console.log('Customers data:', customersData);
      
      // Fetch products for the form
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id);
      
      if (productsError) {
        console.error('Error fetching products:', productsError);
        throw productsError;
      }

      console.log('Products data:', productsData);

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

        const transformedOrder = {
          ...order,
          customer: order.customers,
          products: parsedProducts
        };
        
        console.log('Transformed order:', transformedOrder);
        return transformedOrder;
      }) || [];

      // Create orders from POS transactions that aren't already linked
      const posOrdersToAdd = [];
      if (posTransactions) {
        for (const posTransaction of posTransactions) {
          // Check if this POS transaction is already linked to an order
          const existingOrder = transformedOrders.find(order => order.pos_transaction_id === posTransaction.id);
          
          if (!existingOrder) {
            console.log('Creating order from unlinked POS transaction:', posTransaction.id);
            
            // Find or create customer for POS transaction
            let customer = null;
            if (posTransaction.nama_pembeli) {
              customer = customersData?.find(c => c.name === posTransaction.nama_pembeli);
              if (!customer) {
                // Create a virtual customer for display purposes
                customer = {
                  id: 'pos-customer-' + posTransaction.id,
                  name: posTransaction.nama_pembeli,
                  email: null,
                  phone: null,
                  user_id: user.id,
                  created_at: posTransaction.created_at,
                  notes: null,
                  tags: [],
                  last_order_date: null
                };
              }
            }

            // Parse POS products
            let posProducts = [];
            try {
              if (posTransaction.produk && Array.isArray(posTransaction.produk)) {
                posProducts = posTransaction.produk.map((item: any) => ({
                  product_id: item.id,
                  quantity: item.qty,
                  name: item.nama,
                  price: item.harga
                }));
              }
            } catch (error) {
              console.error('Error parsing POS products:', error);
            }

            const posOrder = {
              id: 'pos-' + posTransaction.id,
              order_date: posTransaction.waktu_transaksi,
              customer_id: customer?.id || null,
              customer: customer,
              products: posProducts,
              total: posTransaction.total,
              status: 'Paid' as const,
              payment_method: posTransaction.metode_pembayaran,
              user_id: user.id,
              payment_proof_url: null,
              pos_transaction_id: posTransaction.id,
              created_at: posTransaction.created_at
            };

            posOrdersToAdd.push(posOrder);
          }
        }
      }

      // Combine regular orders with POS orders
      const allOrders = [...transformedOrders, ...posOrdersToAdd];
      
      console.log('Final combined orders:', allOrders);

      setOrders(allOrders);
      setCustomers(customersData as Customer[]);
      
      // Cast products with proper type
      const typedProducts = (productsData || []).map(product => ({
        ...product,
        type: product.type as 'product' | 'service'
      })) as Product[];
      setProducts(typedProducts);
      
      if (allOrders.length === 0) {
        console.log('No orders found for user - this might be normal if no orders/POS transactions have been created yet');
      } else {
        console.log(`Found ${allOrders.length} total orders (${transformedOrders.length} regular orders + ${posOrdersToAdd.length} POS orders) for user`);
      }
      
    } catch (error: any) {
      console.error('Error in fetchData:', error);
      
      // More specific error handling
      if (error.code === 'PGRST116') {
        console.log('RLS policy might be preventing data access. Check if user is authenticated properly.');
        toast({
          title: 'Authentication Issue',
          description: 'Please make sure you are logged in properly.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch data',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    console.log('useOrders: Effect triggered, user ID:', user?.id);
    if (user?.id) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [fetchData, user?.id]);

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

  console.log('Filtered orders:', filteredOrders);

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
    deleteOrder,
  };
}
