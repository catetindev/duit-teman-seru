
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  currency: 'IDR' | 'USD';
  target_date?: string;
  emoji?: string;
}

const GoalsPage = () => {
  const { t } = useLanguage();
  const { isPremium } = useAuth();
  const { goals, loading, deleteGoal } = useDashboardData();
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  
  const handleDeleteGoal = (id: string) => {
    setGoalToDelete(id);
  };
  
  const confirmDeleteGoal = async () => {
    if (goalToDelete) {
      await deleteGoal(goalToDelete);
      setGoalToDelete(null);
    }
  };

  const formatCurrency = (amount: number, currency: 'IDR' | 'USD') => {
    return currency === 'IDR' 
      ? `Rp${amount.toLocaleString('id-ID')}` 
      : `$${amount.toLocaleString('en-US')}`;
  };

  const calculateProgress = (saved: number, target: number) => {
    return Math.min(Math.round((saved / target) * 100), 100);
  };

  if (loading.goals) {
    return (
      <DashboardLayout isPremium={isPremium}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{t('goals.title')}</h1>
        <p className="text-muted-foreground mt-1">Track progress towards your financial goals</p>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-medium mb-2">{t('goals.empty')}</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Setting clear goals helps you stay motivated and focused on your financial journey.
            </p>
            <Button onClick={() => window.location.href = '/dashboard'}>
              {t('goals.add')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.saved_amount, goal.target_amount);
            
            return (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{goal.emoji}</span>
                      <CardTitle>{goal.title}</CardTitle>
                    </div>
                    <Button
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">
                        Saved: {formatCurrency(goal.saved_amount, goal.currency)}
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(goal.target_amount, goal.currency)}
                      </span>
                    </div>
                    <Progress value={progress} />
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 text-sm">
                    <span className="font-medium">{progress}%</span>
                    {goal.target_date && (
                      <span className="text-muted-foreground">Target: {goal.target_date}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      <AlertDialog open={!!goalToDelete} onOpenChange={(open) => !open && setGoalToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your savings goal and this action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGoal} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default GoalsPage;
