
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { Customer } from '@/types/entrepreneur';
import { toast } from '@/hooks/use-toast';
import { CustomerFormHeader } from './customer/CustomerFormHeader';
import { CustomerForm } from './customer/CustomerForm';

interface CustomerFormDialogProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSubmitSuccess: () => void;
  availableTags: string[];
}

type FormErrors = {
  [key: string]: string;
};

// Common customer tags
const COMMON_TAGS = ['New', 'Regular', 'VIP', 'Late Payment', 'Frequent'];

export default function CustomerFormDialog({ 
  open, 
  onClose, 
  customer, 
  onSubmitSuccess,
  availableTags 
}: CustomerFormDialogProps) {
  const isEditMode = !!customer;
  
  const [formData, setFormData] = useState<Partial<Customer> & { name: string }>({
    name: '',
    phone: '',
    email: '',
    notes: '',
    tags: []
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [newTag, setNewTag] = useState('');
  
  // Combine predefined tags with existing tags from database
  const allAvailableTags = [...new Set([...COMMON_TAGS, ...availableTags])];

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        notes: customer.notes,
        tags: customer.tags || []
      });
    } else {
      resetForm();
    }
  }, [customer]);

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      notes: '',
      tags: []
    });
    setNewTag('');
    setErrors({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddTag = (newTag: string) => {
    if (!newTag.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), newTag.trim()]
    }));
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSelectTag = (tag: string) => {
    if (formData.tags?.includes(tag)) {
      handleRemoveTag(tag);
    } else {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      const userData = {
        ...formData,
        user_id: isEditMode ? customer!.user_id : (await supabase.auth.getUser()).data.user?.id,
      };

      if (isEditMode) {
        // Update existing customer
        const { error } = await supabase
          .from('customers')
          .update(userData)
          .eq('id', customer!.id);
          
        if (error) throw error;
        
        toast({ title: 'Success', description: 'Customer updated successfully' });
      } else {
        // Add new customer
        const { error } = await supabase
          .from('customers')
          .insert(userData);
          
        if (error) throw error;
        
        toast({ title: 'Success', description: 'Customer added successfully' });
      }
      
      onSubmitSuccess();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save customer',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[90vh] overflow-y-auto">
        <CustomerFormHeader isEditMode={isEditMode} />
        
        <CustomerForm
          formData={formData}
          errors={errors}
          submitting={submitting}
          availableTags={allAvailableTags}
          onInputChange={handleInputChange}
          onAddTag={handleAddTag}
          onRemoveTag={handleRemoveTag}
          onSelectTag={handleSelectTag}
          onSubmit={handleSubmit}
          onClose={onClose}
          isEditMode={isEditMode}
        />
      </DialogContent>
    </Dialog>
  );
}
