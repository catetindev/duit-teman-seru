
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Budget, ValidCurrency } from '@/hooks/goals/types';
import { useLanguage } from '@/hooks/useLanguage';

interface BudgetFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: FormValues) => Promise<void>;
  selectedBudget: Budget | null;
}

// Define the form values interface
interface FormValues {
  category: string;
  amount: number;
  currency: ValidCurrency;
}

const BudgetForm = ({ open, onOpenChange, onSubmit, selectedBudget }: BudgetFormProps) => {
  const { t } = useLanguage();
  
  const form = useForm<FormValues>({
    defaultValues: {
      category: selectedBudget?.category || '',
      amount: selectedBudget?.amount || 0,
      currency: selectedBudget?.currency || 'IDR'
    }
  });

  // Handle form submission
  const handleSubmit = async (values: FormValues) => {
    await onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{selectedBudget ? t('budget.editTitle') : t('budget.createTitle')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="category">{t('budget.category')}</Label>
            <Input 
              id="category" 
              {...form.register("category", { required: true })}
              placeholder={t('budget.categoryPlaceholder')}
            />
          </div>
          
          <div>
            <Label htmlFor="amount">{t('budget.amount')}</Label>
            <Input 
              id="amount" 
              type="number" 
              {...form.register("amount", { 
                required: true,
                valueAsNumber: true,
                min: 0
              })}
              placeholder="0"
            />
          </div>
          
          <div>
            <Label htmlFor="currency">{t('budget.currency')}</Label>
            <Select 
              onValueChange={(value) => form.setValue("currency", value as ValidCurrency)}
              defaultValue={form.getValues("currency")}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('budget.selectCurrency')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="IDR">IDR - Indonesian Rupiah</SelectItem>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button type="submit">
              {selectedBudget ? t('common.update') : t('common.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetForm;
