import React from 'react';
import { useEntrepreneurModeSwitcher } from '@/hooks/useEntrepreneurModeSwitcher';
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
  } = useEntrepreneurModeSwitcher();

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
            {/* Removed the "Bisnis" badge that was here */}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {isPremiumRequired 
            ? "Mode Pengusaha (Fitur Premium)" 
            : isEntrepreneurMode 
              ? "Beralih ke Mode Personal" 
              : "Beralih ke Mode Pengusaha"
          }
        </TooltipContent>
      </Tooltip>
    </div>
  );
}