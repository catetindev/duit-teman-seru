
import React from 'react';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { Switch } from '@/components/ui/switch';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Brain } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EntrepreneurModeToggleProps {
  className?: string;
}

export function EntrepreneurModeToggle({ className }: EntrepreneurModeToggleProps) {
  const { 
    isEntrepreneurMode,
    toggleEntrepreneurMode,
    isPremiumRequired 
  } = useEntrepreneurMode();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Brain 
              className={cn(
                "h-4 w-4 transition-colors", 
                isEntrepreneurMode ? "text-amber-500" : "text-muted-foreground"
              )}
            />
            <Switch
              checked={isEntrepreneurMode}
              onCheckedChange={toggleEntrepreneurMode}
              disabled={isPremiumRequired}
              className={cn(
                isEntrepreneurMode && "data-[state=checked]:bg-amber-500"
              )}
            />
            {isEntrepreneurMode && (
              <Badge 
                variant="outline" 
                className="text-xs bg-amber-500/10 text-amber-700 border-amber-200 dark:text-amber-400"
              >
                Business
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isPremiumRequired 
            ? "Entrepreneur Mode (Premium Feature)" 
            : isEntrepreneurMode 
              ? "Switch to Personal Mode" 
              : "Switch to Entrepreneur Mode"
          }
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
