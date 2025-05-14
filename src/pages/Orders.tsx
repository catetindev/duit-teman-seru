import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Filter, Plus, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Customer, Order, Product } from '@/types/entrepreneur';
import OrderList from '@/components/entrepreneur/OrderList';
import OrderFormDialog from '@/components/entrepreneur/OrderFormDialog';
import { DateRange } from 'react-day-picker';
import { DatePicker } from '@/components/ui/date-picker';
import { formatDateRange } from '@/utils/formatUtils';
import { useLanguage } from '@/hooks/useLanguage';
import { updateProductStock } from '@/utils/inventoryUtils';

export default function Orders() {
  const { isPremium } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [customerFilter, setCustomerFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      
      // Fetch orders with customer information
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          customers:customer_id (id, name)
        `);
      
      if (ordersError) throw ordersError;

      // Fetch customers for filter
      const { data: customersData, error: customersError } = await supabase
        .from('customers')
        .select('*');
      
      if (customersError) throw customersError;
      
      // Fetch products for the form
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*');
      
      if (productsError) throw productsError;

      // Transform orders data
      const transformedOrders = ordersData.map((order: any) => ({
        ...order,
        customer: order.customers
      }));

      setOrders(transformedOrders);
      setCustomers(customersData as Customer[]);
      setProducts(productsData as Product[]);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAddNew = () => {
    setSelectedOrder(null);
    setIsFormOpen(true);
  };

  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Get order details first to check status and restore stock if needed
      const { data: orderToDelete, error: fetchError } = await supabase
        .from('orders')
        .select('payment_proof_url, status, products')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;

      // If order was paid, restore the stock
      if (orderToDelete && orderToDelete.status === 'Paid') {
        const productsData = orderToDelete.products;
        if (Array.isArray(productsData)) {
          await updateProductStock(productsData, false); // false = restore stock
        }
      }
      
      // Delete payment proof if exists
      if (orderToDelete?.payment_proof_url) {
        const imagePath = orderToDelete.payment_proof_url.split('/').pop();
        if (imagePath) {
          await supabase.storage.from('products').remove([imagePath]);
        }
      }
      
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setOrders(orders.filter(order => order.id !== id));
      toast({
        title: 'Success',
        description: 'Order deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete order',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (id: string, status: Order['status']) => {
    try {
      // Get current order data first
      const { data: currentOrder, error: fetchError } = await supabase
        .from('orders')
        .select('status, products')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      // Handle stock changes based on status change
      if (currentOrder) {
        const previousStatus = currentOrder.status;
        const newStatus = status;
        
        // If order was canceled and is now marked as paid, reduce stock
        if (previousStatus === 'Canceled' && newStatus === 'Paid') {
          await updateProductStock(currentOrder.products, true);
        }
        // If order was paid and is now canceled, restore stock
        else if (previousStatus === 'Paid' && newStatus === 'Canceled') {
          await updateProductStock(currentOrder.products, false);
        }
      }
      
      setOrders(orders.map(order => 
        order.id === id ? { ...order, status } : order
      ));
      
      toast({
        title: 'Status Updated',
        description: `Order status changed to ${t(`order.status.${status.toLowerCase()}`)}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitSuccess = () => {
    fetchData();
    setIsFormOpen(false);
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      order.customer?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    const matchesCustomer = customerFilter === 'all' || order.customer_id === customerFilter;
    
    const matchesDate = !dateRange?.from || (
      new Date(order.order_date) >= dateRange.from &&
      (!dateRange.to || new Date(order.order_date) <= dateRange.to)
    );
    
    return matchesSearch && matchesStatus && matchesCustomer && matchesDate;
  });

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">{t('order.title')}</h1>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> {t('order.new')}
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('order.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>
                  {statusFilter === 'all' ? t('order.allStatuses') : t(`order.status.${statusFilter.toLowerCase()}`)}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('order.allStatuses')}</SelectItem>
              <SelectItem value="Pending">{t('order.status.pending')}</SelectItem>
              <SelectItem value="Paid">{t('order.status.paid')}</SelectItem>
              <SelectItem value="Canceled">{t('order.status.canceled')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={customerFilter} onValueChange={setCustomerFilter}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>
                  {customerFilter === 'all' ? t('order.allCustomers') : 
                   customers.find(c => c.id === customerFilter)?.name || 'Customer'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('order.allCustomers')}</SelectItem>
              {customers.map(customer => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <DatePicker
            date={dateRange}
            onSelect={setDateRange}
            preText="Date: "
            placeholder={t('order.selectDates')}
          />
          
          {dateRange?.from && (
            <div className="md:col-span-4 flex items-center">
              <span className="text-sm">
                {t('order.filteredByDate')}: {formatDateRange(dateRange.from, dateRange.to || dateRange.from)}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setDateRange(undefined)}
                className="ml-2 h-6 text-xs"
              >
                {t('order.clear')}
              </Button>
            </div>
          )}
        </div>
        
        {/* Orders List */}
        <OrderList 
          orders={filteredOrders}
          loading={loading} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />

        {/* Order Form Dialog */}
        <OrderFormDialog 
          open={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          order={selectedOrder} 
          onSubmitSuccess={handleSubmitSuccess}
          customers={customers}
          products={products}
        />
      </div>
    </DashboardLayout>
  );
}
