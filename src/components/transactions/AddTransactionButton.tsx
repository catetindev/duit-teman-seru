
import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import AddTransactionDialog from '@/components/dashboard/AddTransactionDialog';

interface AddTransactionButtonProps {
  onSuccess: () => void;
}

const AddTransactionButton = ({ onSuccess }: AddTransactionButtonProps) => {
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  return (
    <>
      <Button 
        className="gap-2"
        onClick={() => setIsDialogOpen(true)}
      >
        <PlusCircle className="h-4 w-4" />
        Add Transaction
      </Button>
      
      <AddTransactionDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        onTransactionAdded={() => {
          onSuccess();
          setIsDialogOpen(false);
        }}
      />
    </>
  );
};

export default AddTransactionButton;
