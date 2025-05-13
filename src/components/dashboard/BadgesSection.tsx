import React from 'react';
import BadgeCard from '@/components/ui/BadgeCard';

interface Badge {
  name: string;
  description: string;
  icon: string;
  isLocked?: boolean;
  isNew?: boolean;
}

interface BadgesSectionProps {
  badges: Badge[];
}

const BadgesSection = ({ badges }: BadgesSectionProps) => {
  if (badges.length === 0) return null;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5">
      <h2 className="text-xl font-bold mb-4">Your Badges</h2>
      <div className="grid grid-cols-2 gap-3">
        {badges.map((badge, index) => (
          <BadgeCard
            key={index}
            name={badge.name}
            description={badge.description}
            icon={badge.icon}
            isLocked={badge.isLocked}
            isNew={badge.isNew}
          />
        ))}
      </div>
    </div>
  );
};

export default BadgesSection;