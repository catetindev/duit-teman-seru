
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { PlusCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GoalCard from '@/components/ui/GoalCard';
import AddGoalDialog from '@/components/goals/AddGoalDialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Goal } from '@/hooks/goals/types';

interface GoalsSectionProps {
  goals: Goal[];
  isPremium?: boolean;
  onGoalAdded: () => void;
  loading?: boolean;
  onUpgradeClick?: () => void;
}

const GoalsSection = ({ 
  goals, 
  isPremium = false, 
  onGoalAdded,
  loading = false,
  onUpgradeClick
}: GoalsSectionProps) => {
  const { t } = useLanguage();
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  
  const canAddMoreGoals = isPremium || goals.length === 0;
  
  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <CardHeader className="p-0 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-bold">{t('goals.title')}</CardTitle>
          {canAddMoreGoals && (
            <Button 
              onClick={() => setIsAddGoalOpen(true)} 
              variant="outline" 
              size="sm"
              className="gap-1"
            >
              <PlusCircle size={16} />
              <span>{t('goals.add')}</span>
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            {isPremium && <Skeleton className="h-32 w-full" />}
          </div>
        ) : goals.length > 0 ? (
          <div className="space-y-4">
            {goals.map((goal) => (
              <GoalCard 
                key={goal.id} 
                id={goal.id}
                title={goal.title}
                targetAmount={goal.target_amount}
                currentAmount={goal.saved_amount}
                targetDate={goal.target_date}
                currency={goal.currency}
                isPremium={isPremium}
                emoji={goal.emoji}
                onUpdate={onGoalAdded}
              />
            ))}
            
            {!isPremium && goals.length === 1 && (
              <div className="mt-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-900/30">
                <h4 className="font-medium flex items-center gap-2 mb-2">
                  <TrendingUp size={16} className="text-purple-500" />
                  <span>Want to add more goals?</span>
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Upgrade to Premium to create multiple savings goals and track all your dreams.
                </p>
                <Button 
                  onClick={onUpgradeClick}
                  size="sm" 
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED]"
                >
                  Upgrade to Premium
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
              <TrendingUp size={24} className="text-purple-500" />
            </div>
            <h3 className="font-medium mb-2">{t('goals.empty.title')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('goals.empty.description')}
            </p>
            <Button 
              onClick={() => setIsAddGoalOpen(true)}
              variant="outline"
            >
              {t('goals.empty.cta')}
            </Button>
          </div>
        )}
      </CardContent>

      <AddGoalDialog
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onGoalAdded={onGoalAdded}
        onUpgradeNeeded={onUpgradeClick}
      />
    </Card>
  );
};

export default React.memo(GoalsSection);
