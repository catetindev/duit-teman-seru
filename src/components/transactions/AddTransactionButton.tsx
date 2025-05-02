
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
        className="fixed bottom-6 right-6 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 w-14 h-14 p-0"
        onClick={() => setIsDialogOpen(true)}
      >
        <PlusCircle className="h-6 w-6" />
        <span className="sr-only">{t('transactions.add')}</span>
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
