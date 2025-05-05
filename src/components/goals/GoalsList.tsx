
import React from 'react';
import { motion } from 'framer-motion';
import GoalCard from '../ui/GoalCard';
import { Goal } from '@/hooks/goals/types';

interface GoalsListProps {
  goals: Goal[];
  formatCurrency: (amount: number, currency: 'IDR' | 'USD') => string;
  calculateProgress: (goal: Goal) => number;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onCollaborate: (goal: Goal) => void;
  isPremium: boolean;
}

const GoalsList = ({
  goals,
  formatCurrency,
  calculateProgress,
  onEdit,
  onDelete,
  onCollaborate,
  isPremium,
}: GoalsListProps) => {
  // Handle direct delete
  const handleDelete = (goalId: string) => {
    onDelete(goalId);
  };

  if (goals.length === 0) {
    return (
      <div className="mt-10 text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-xl">
        <div className="text-5xl mb-6">✨</div>
        <h3 className="text-xl font-bold mb-3">No Savings Goals Yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Create your first savings goal and start tracking your progress.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pb-6">
      {goals.map((goal, index) => (
        <motion.div
          key={goal.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <GoalCard
            id={goal.id}
            title={goal.title}
            targetAmount={goal.target_amount}
            currentAmount={goal.saved_amount}
            targetDate={goal.target_date}
            currency={goal.currency}
            isPremium={isPremium}
            emoji={goal.emoji}
            onEdit={() => onEdit(goal)}
            onDelete={handleDelete}
            onCollaborate={() => onCollaborate(goal)}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default GoalsList;
