
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Customer } from '@/types/entrepreneur';
import { Loader2 } from 'lucide-react';
import { TagsInput } from './TagsInput';

type FormErrors = {
  [key: string]: string;
};

interface CustomerFormProps {
  formData: Partial<Customer> & { name: string };
  errors: FormErrors;
  submitting: boolean;
  availableTags: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  onSelectTag: (tag: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
  isEditMode: boolean;
}

export function CustomerForm({
  formData,
  errors,
  submitting,
  availableTags,
  onInputChange,
  onAddTag,
  onRemoveTag,
  onSelectTag,
  onSubmit,
  onClose,
  isEditMode,
}: CustomerFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name || ''}
          onChange={onInputChange}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ''}
            onChange={onInputChange}
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={onInputChange}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>
      
      <TagsInput
        selectedTags={formData.tags || []}
        availableTags={availableTags}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        onSelectTag={onSelectTag}
      />
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={onInputChange}
          placeholder="Add customer notes here..."
          rows={3}
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={submitting}>
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? 'Update Customer' : 'Add Customer'}
        </Button>
      </div>
    </form>
  );
}
