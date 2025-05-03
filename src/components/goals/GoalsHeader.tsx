
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';

interface GoalsHeaderProps {
  onAddGoal: () => void;
  isPremium: boolean;
  goalsCount: number;
}

const GoalsHeader: React.FC<GoalsHeaderProps> = ({ onAddGoal, isPremium, goalsCount }) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold">{t('goals.title')}</h1>
        <p className="text-muted-foreground mt-1">Track progress towards your financial goals</p>
      </div>
      <div className="flex items-center gap-2">
        <Button 
          className="flex items-center gap-2"
          onClick={onAddGoal}
          disabled={!isPremium && goalsCount >= 1}
        >
          <Plus size={16} />
          <span>Add Goal</span>
        </Button>
        <Link to="/goals/collaboration-docs">
          <Button variant="outline" className="flex items-center gap-2">
            <BookOpen size={16} />
            <span>Documentation</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default GoalsHeader;
