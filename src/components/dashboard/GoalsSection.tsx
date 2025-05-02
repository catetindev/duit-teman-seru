
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import GoalCard from '@/components/ui/GoalCard';
import { PlusCircle } from 'lucide-react';

interface Goal {
  name: string;
  target: number;
  current: number;
  currency: 'IDR' | 'USD';
  deadline?: string;
  emoji?: string;
}

interface GoalsSectionProps {
  goals: Goal[];
  isPremium: boolean;
}

const GoalsSection = ({ goals, isPremium }: GoalsSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('goals.title')}</h2>
        {isPremium && (
          <Button variant="outline" size="sm" className="gap-1">
            <PlusCircle size={16} />
            <span>{t('goals.add')}</span>
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {goals.map((goal, index) => (
          <GoalCard
            key={index}
            name={goal.name}
            target={goal.target}
            current={goal.current}
            currency={goal.currency}
            deadline={goal.deadline}
            emoji={goal.emoji}
          />
        ))}
        
        {!isPremium && (
          <div className="bg-muted/50 rounded-xl p-4 mt-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Upgrade to premium for unlimited savings goals! ✨
            </p>
            <Button size="sm" className="gradient-bg-purple">
              Upgrade Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsSection;
