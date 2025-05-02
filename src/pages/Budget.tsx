
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import ExpenseCard from '@/components/ui/ExpenseCard';
import { Button } from '@/components/ui/button';
import { Plus, Wallet, PieChart, BarChart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/components/dashboard/DashboardData';

// Interface for budget items
interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  currency: 'IDR' | 'USD';
  icon?: string;
}

// Sample budget data with standard categories
const sampleBudgets: Budget[] = [
  { id: '1', category: 'Food', limit: 1500000, spent: 1250000, currency: 'IDR', icon: '🍔' },
  { id: '2', category: 'Transport', limit: 800000, spent: 600000, currency: 'IDR', icon: '🚗' },
  { id: '3', category: 'Entertainment', limit: 500000, spent: 450000, currency: 'IDR', icon: '🎬' },
  { id: '4', category: 'Shopping', limit: 1000000, spent: 300000, currency: 'IDR', icon: '🛍️' },
  { id: '5', category: 'Bills', limit: 2000000, spent: 2100000, currency: 'IDR', icon: '📄' },
];

// Sample category options with emojis
const categoryOptions = [
  { name: 'Food', icon: '🍔' },
  { name: 'Transport', icon: '🚗' },
  { name: 'Entertainment', icon: '🎬' },
  { name: 'Shopping', icon: '🛍️' },
  { name: 'Bills', icon: '📄' },
  { name: 'Rent', icon: '🏠' },
  { name: 'Health', icon: '💊' },
  { name: 'Education', icon: '📚' },
  { name: 'Other', icon: '📦' },
];

const BudgetPage = () => {
  const { t } = useLanguage();
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Budget summary calculations
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const remainingBudget = totalBudget - totalSpent;
  const percentUsed = Math.min(Math.round((totalSpent / totalBudget) * 100), 100);
  
  // New budget form state
  const [newBudget, setNewBudget] = useState({
    category: '',
    icon: '📦',
    limit: '',
    currency: 'IDR',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // In a real app, you would fetch budget data here
    // For now, we're using sample data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newBudget.category || !newBudget.limit) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would call an API here
    const newBudgetItem: Budget = {
      id: Date.now().toString(),
      category: newBudget.category,
      limit: parseFloat(newBudget.limit),
      spent: 0,
      currency: newBudget.currency as 'IDR' | 'USD',
      icon: newBudget.icon,
    };
    
    setBudgets([...budgets, newBudgetItem]);
    
    toast({
      title: "Budget created!",
      description: `New budget for ${newBudget.category} has been created.`,
    });
    
    // Reset form and close dialog
    setNewBudget({
      category: '',
      icon: '📦',
      limit: '',
      currency: 'IDR',
    });
    setIsCreateDialogOpen(false);
  };
  
  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
    
    toast({
      title: "Budget deleted",
      description: "The budget category has been removed",
    });
  };
  
  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('nav.budget')}</h1>
          <p className="text-muted-foreground mt-1">Manage your monthly spending limits by category</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus size={16} className="mr-1" />
          Add Category Budget
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid gap-6">
          <Card className="h-32 animate-pulse">
            <CardContent className="p-0 h-full bg-gray-100 dark:bg-gray-800"></CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="h-24 animate-pulse">
                <CardContent className="p-0 h-full bg-gray-100 dark:bg-gray-800"></CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : budgets.length > 0 ? (
        <div className="grid gap-6">
          {/* Monthly Budget Overview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Monthly Budget Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
                  <p className="text-2xl font-semibold">
                    {formatCurrency(totalBudget, 'IDR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
                  <p className="text-2xl font-semibold">
                    {formatCurrency(totalSpent, 'IDR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                  <p className={`text-2xl font-semibold ${remainingBudget < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {formatCurrency(remainingBudget, 'IDR')}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span className={remainingBudget < 0 ? 'text-red-500' : ''}>{percentUsed}%</span>
                </div>
                <Progress 
                  value={percentUsed} 
                  className={`h-3 ${remainingBudget < 0 ? 'bg-red-500' : percentUsed > 80 ? 'bg-orange-500' : 'bg-primary'}`}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Budget Categories */}
          <div className="mt-6">
            <h2 className="text-lg font-medium mb-3">Budget by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {budgets.map((budget) => (
                <ExpenseCard
                  key={budget.id}
                  category={budget.category}
                  spent={budget.spent}
                  budget={budget.limit}
                  currency={budget.currency}
                  icon={budget.icon}
                  onDelete={() => handleDeleteBudget(budget.id)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Card className="border-dashed bg-muted/50 flex flex-col items-center justify-center p-10 text-center">
          <div className="text-3xl mb-3">💰</div>
          <CardTitle className="mb-2">Control your spending!</CardTitle>
          <CardDescription className="mb-4">Set your monthly limits</CardDescription>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus size={16} className="mr-1" />
            Add Category Budget
          </Button>
        </Card>
      )}
      
      {/* Create Budget Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new budget category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateBudget}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="category" className="text-right">Category</Label>
                <div className="col-span-3">
                  <select
                    id="category"
                    value={newBudget.category}
                    onChange={(e) => {
                      const selected = categoryOptions.find(cat => cat.name === e.target.value);
                      setNewBudget({
                        ...newBudget, 
                        category: e.target.value,
                        icon: selected ? selected.icon : '📦'
                      });
                    }}
                    className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md"
                  >
                    <option value="">Select a category</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="limit" className="text-right">Monthly Limit</Label>
                <div className="col-span-3 flex gap-2">
                  <select 
                    value={newBudget.currency}
                    onChange={(e) => setNewBudget({...newBudget, currency: e.target.value})}
                    className="bg-background border border-input rounded-md px-3 py-2 text-sm"
                  >
                    <option value="IDR">IDR</option>
                    <option value="USD">USD</option>
                  </select>
                  <Input
                    id="limit"
                    type="number"
                    value={newBudget.limit}
                    onChange={(e) => setNewBudget({...newBudget, limit: e.target.value})}
                    placeholder="1000000"
                    className="flex-1"
                  />
                </div>
                {newBudget.limit && (
                  <div className="col-span-3 col-start-2 text-sm text-muted-foreground">
                    {formatCurrency(parseFloat(newBudget.limit) || 0, newBudget.currency as 'IDR' | 'USD')}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Budget"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default BudgetPage;
