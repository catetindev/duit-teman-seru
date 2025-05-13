import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface BadgeCardProps {
  name: string;
  description: string;
  icon: string;
  isLocked?: boolean;
  isNew?: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  name,
  description,
  icon,
  isLocked = false,
  isNew = false,
}) => {
  return (
    <Card className={`p-4 relative overflow-hidden transition-shadow card-hover ${isLocked ? 'opacity-60 grayscale' : ''}`}>
      {isNew && (
        <Badge className="absolute top-2 right-2 bg-green-500 text-white text-xs">New!</Badge>
      )}
      <CardContent className="p-0 flex items-center space-x-4">
        <div className="text-4xl flex-shrink-0">{icon}</div>
        <div>
          <h3 className="text-md font-semibold">{name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </div>
      </CardContent>
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <Lock className="h-8 w-8 text-white" />
        </div>
      )}
    </Card>
  );
};

export default BadgeCard;