
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-800">Customers</h1>
            <p className="text-slate-600 text-lg">Manage your customer database</p>
          </div>
          <Button onClick={handleAddNew} className="w-full sm:w-auto px-6 py-3">
            <Plus className="h-5 w-5 mr-2" /> Add New Customer
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 py-3 text-base"
            />
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5" />
              <span className="text-base font-medium">Filter by tag:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {tagFilter && (
                <Badge 
                  className="cursor-pointer px-4 py-2 text-sm"
                  onClick={() => setTagFilter(null)}
                  variant="default"
                >
                  Clear filter
                </Badge>
              )}
              {availableTags.map(tag => (
                <Badge 
                  key={tag} 
                  className="cursor-pointer px-4 py-2 text-sm"
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
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <CustomerList 
            customers={filteredCustomers}
            loading={loading} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </div>

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
