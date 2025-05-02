
import { cn } from "@/lib/utils";

interface BadgeProps {
  name: string;
  description: string;
  icon: string;
  isLocked?: boolean;
  isNew?: boolean;
  className?: string;
}

const Badge = ({ 
  name, 
  description, 
  icon, 
  isLocked = false,
  isNew = false,
  className 
}: BadgeProps) => {
  return (
    <div className={cn(
      "flex flex-col items-center p-4 rounded-lg transition-all relative",
      isLocked 
        ? "bg-gray-100 dark:bg-gray-800 opacity-60" 
        : "bg-white dark:bg-gray-800 shadow-sm hover:shadow-md card-hover",
      className
    )}>
      {isNew && (
        <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
          New!
        </span>
      )}
      
      <div className={cn(
        "w-16 h-16 flex items-center justify-center rounded-full mb-3",
        isLocked ? "bg-gray-200 dark:bg-gray-700" : "gradient-bg-purple"
      )}>
        <span className="text-2xl">
          {isLocked ? '🔒' : icon}
        </span>
      </div>
      
      <h4 className="font-medium text-center">{name}</h4>
      
      <p className="text-xs text-muted-foreground text-center mt-1">
        {isLocked ? "Locked" : description}
      </p>
    </div>
  );
};

export default Badge;
