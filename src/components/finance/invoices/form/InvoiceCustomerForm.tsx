
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, User } from 'lucide-react';
import { Customer } from '@/types/entrepreneur';
import { UseFormReturn } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface InvoiceCustomerFormProps {
  form: UseFormReturn<any>;
  customers: Customer[];
  defaultInvoiceNumber?: string;
  loading?: boolean;
  onCustomerAdded?: () => void;
}

export function InvoiceCustomerForm({ 
  form, 
  customers = [],
  defaultInvoiceNumber,
  loading,
  onCustomerAdded
}: InvoiceCustomerFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleAddCustomer = async () => {
    if (!newCustomer.name.trim()) {
      toast({
        title: 'Error',
        description: 'Customer name is required',
        variant: 'destructive'
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
        variant: 'destructive'
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          name: newCustomer.name.trim(),
          email: newCustomer.email.trim() || null,
          phone: newCustomer.phone.trim() || null,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Customer added successfully',
      });

      // Reset form
      setNewCustomer({ name: '', email: '', phone: '' });
      setIsAddingCustomer(false);

      // Select the newly added customer
      form.setValue('customer_id', data.id);

      // Trigger refresh if callback provided
      if (onCustomerAdded) {
        onCustomerAdded();
      }

    } catch (error: any) {
      console.error('Error adding customer:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to add customer',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Invoice Number */}
      <FormField
        control={form.control}
        name="invoice_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Invoice Number</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., INV-001" 
                {...field} 
                disabled={!!defaultInvoiceNumber}
                className={defaultInvoiceNumber ? "bg-muted" : ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Customer Selection */}
      <FormField
        control={form.control}
        name="customer_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center justify-between">
              Customer
              <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
                <DialogTrigger asChild>
                  <Button 
                    type="button"
                    size="sm" 
                    variant="outline"
                    className="h-7 px-2 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add New
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Add New Customer
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name *</label>
                      <Input
                        placeholder="Customer name"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        type="email"
                        placeholder="customer@email.com"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        placeholder="Phone number"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button 
                        onClick={handleAddCustomer}
                        disabled={submitting || !newCustomer.name.trim()}
                        className="flex-1"
                      >
                        {submitting ? 'Adding...' : 'Add Customer'}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setIsAddingCustomer(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={loading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="max-h-[300px]">
                {!customers || customers.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No customers yet. Add your first customer above.
                  </div>
                ) : (
                  customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{customer.name}</span>
                        {customer.phone && (
                          <span className="text-xs text-muted-foreground">
                            {customer.phone}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
