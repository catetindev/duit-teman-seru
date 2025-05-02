
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'teal' | 'purple' | 'orange';
  className?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  variant = 'default',
  className 
}: StatCardProps) => {
  const getVariantClasses = () => {
    switch(variant) {
      case 'teal':
        return 'bg-gradient-to-br from-teal-500 to-teal-600 text-white';
      case 'purple':
        return 'bg-gradient-to-br from-purple-500 to-purple-600 text-white';
      case 'orange':
        return 'bg-gradient-to-br from-orange-500 to-orange-600 text-white';
      default:
        return 'bg-white dark:bg-gray-800';
    }
  };

  return (
    <div 
      className={cn(
        "rounded-xl p-4 shadow-sm card-hover",
        getVariantClasses(),
        className
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className={cn(
            "text-sm font-medium mb-1",
            variant === 'default' ? 'text-muted-foreground' : 'text-white/80'
          )}>
            {title}
          </p>
          <h4 className="text-2xl font-bold">{value}</h4>
          
          {trend && (
            <div className={cn(
              "mt-2 text-xs font-medium inline-flex items-center",
              trend.isPositive ? 'text-green-500' : 'text-red-500',
              variant !== 'default' && 'text-white/90'
            )}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        
        {icon && (
          <div className={cn(
            "p-2 rounded-lg",
            variant === 'default' ? 'bg-muted' : 'bg-white/10'
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
