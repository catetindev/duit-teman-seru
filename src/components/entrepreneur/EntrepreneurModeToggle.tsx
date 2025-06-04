import React from 'react';
import { useEntrepreneurModeSwitcher } from '@/hooks/useEntrepreneurModeSwitcher';
import { Switch } from '@/components/ui/switch';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Brain, BadgePercent } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface EntrepreneurModeToggleProps {
  className?: string;
}

export function EntrepreneurModeToggle({ className }: EntrepreneurModeToggleProps) {
  const { 
    isEntrepreneurMode,
    toggleEntrepreneurMode,
    isPremiumRequired 
  } = useEntrepreneurModeSwitcher();
  const navigate = useNavigate();

  return (
    <div className={cn("flex items-center shrink-0", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <Switch
              id="entrepreneur-mode"
              checked={isEntrepreneurMode}
              onCheckedChange={toggleEntrepreneurMode}
              disabled={isPremiumRequired}
              className="data-[state=checked]:bg-amber-500"
              aria-label="Toggle entrepreneur mode"
            />
            {isPremiumRequired && (
              <Badge
                variant="outline"
                className="ml-1 cursor-pointer bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20"
                onClick={() => navigate('/pricing')}
              >
                <BadgePercent className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
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
