
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/types/entrepreneur';
import { Filter, Plus, Search } from 'lucide-react';
import CustomerList from '@/components/entrepreneur/CustomerList';
import CustomerFormDialog from '@/components/entrepreneur/CustomerFormDialog';
import { Badge } from '@/components/ui/badge';

export default function Customers() {
  const { isPremium } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*');
      
      if (error) throw error;

      if (data) {
        setCustomers(data as Customer[]);
        
        // Extract all unique tags
        const allTags = data.flatMap((customer: Customer) => customer.tags || []);
        const uniqueTags = [...new Set(allTags)];
        setAvailableTags(uniqueTags);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch customers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCustomers(customers.filter(customer => customer.id !== id));
      toast({
        title: 'Success',
        description: 'Customer deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete customer',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitSuccess = () => {
    fetchCustomers();
    setIsFormOpen(false);
  };

  // Filter customers based on search query and tag filter
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      (customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery));
    
    const matchesTag = 
      !tagFilter || 
      (customer.tags && customer.tags.includes(tagFilter));
    
    return matchesSearch && matchesTag;
  });

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Customers</h1>
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add New Customer
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter by tag:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {tagFilter && (
                <Badge 
                  className="cursor-pointer"
                  onClick={() => setTagFilter(null)}
                  variant="default"
                >
                  Clear filter
                </Badge>
              )}
              {availableTags.map(tag => (
                <Badge 
                  key={tag} 
                  className="cursor-pointer"
                  onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
                  variant={tagFilter === tag ? 'default' : 'outline'}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        {/* Customer List */}
        <CustomerList 
          customers={filteredCustomers}
          loading={loading} 
          onEdit={handleEdit} 
          onDelete={handleDelete} 
        />

        {/* Customer Form Dialog */}
        <CustomerFormDialog 
          open={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          customer={selectedCustomer} 
          onSubmitSuccess={handleSubmitSuccess}
          availableTags={availableTags}
        />
      </div>
    </DashboardLayout>
  );
}
