
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface InvoiceDialogActionsProps {
  isEditMode: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function InvoiceDialogActions({ 
  isEditMode, 
  isSubmitting, 
  onCancel 
}: InvoiceDialogActionsProps) {
  return (
    <div className="flex justify-end gap-3 pt-4 border-t">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="bg-purple-600 hover:bg-purple-700"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditMode ? 'Update Invoice' : 'Create Invoice'}
      </Button>
    </div>
  );
}
