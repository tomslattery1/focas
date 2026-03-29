import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { ComplianceStatus } from '@/types/app';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface StatusIndicatorProps {
  status: ComplianceStatus;
  isActive: boolean;
  size?: 'sm' | 'lg';
  onActivate?: () => void;
}

const HOLD_DURATION = 2000; // 2 seconds to activate

const statusConfig = {
  green: {
    icon: ShieldCheck,
    label: 'Fócas Mode Active',
    description: 'You\'re focused — distracting apps are limited.',
    bgClass: 'bg-status-green-light',
    iconClass: 'text-status-green',
    glowClass: 'shadow-glow-green',
  },
  amber: {
    icon: ShieldAlert,
    label: 'Partially Focused',
    description: 'Some settings need attention.',
    bgClass: 'bg-status-amber-light',
    iconClass: 'text-status-amber',
    glowClass: 'shadow-glow-amber',
  },
  red: {
    icon: ShieldX,
    label: 'Not Focused',
    description: 'Fócas Mode is not active.',
    bgClass: 'bg-status-red-light',
    iconClass: 'text-status-red',
    glowClass: 'shadow-glow-red',
  },
};

export const StatusIndicator = ({ status, isActive, size = 'lg', onActivate }: StatusIndicatorProps) => {
  const config = statusConfig[status];
  const Icon = isActive ? config.icon : Shield;
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const sizeClasses = size === 'lg' 
    ? 'w-40 h-40' 
    : 'w-20 h-20';

  const iconSize = size === 'lg' ? 'w-20 h-20' : 'w-10 h-10';

  const clearTimers = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const handleHoldStart = useCallback(() => {
    if (isActive || !onActivate) return; // Only allow activation when inactive
    
    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);
    }, 16);

    holdTimerRef.current = setTimeout(() => {
      clearTimers();
      setIsHolding(false);
      setHoldProgress(0);
      
      toast.success('Fócas Mode activated', {
        description: 'Distracting apps are now limited.',
      });
      onActivate();
    }, HOLD_DURATION);
  }, [isActive, onActivate, clearTimers]);

  const handleHoldEnd = useCallback(() => {
    clearTimers();
    setIsHolding(false);
    setHoldProgress(0);
  }, [clearTimers]);

  const isInteractive = !isActive && onActivate;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="flex flex-col items-center gap-6"
    >
      <motion.div
        onMouseDown={handleHoldStart}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
        onTouchStart={handleHoldStart}
        onTouchEnd={handleHoldEnd}
        onTouchCancel={handleHoldEnd}
        className={cn(
          "rounded-full flex items-center justify-center relative overflow-hidden",
          sizeClasses,
          isActive ? config.bgClass : 'bg-muted',
          isActive && config.glowClass,
          isInteractive && "cursor-pointer active:scale-95 transition-transform"
        )}
        animate={isActive ? { 
          boxShadow: [
            `0 0 20px hsl(var(--status-${status}) / 0.3)`,
            `0 0 40px hsl(var(--status-${status}) / 0.5)`,
            `0 0 20px hsl(var(--status-${status}) / 0.3)`,
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={isInteractive ? { scale: 0.95 } : {}}
      >
        {/* Progress ring for activation */}
        {isHolding && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              fill="none"
              stroke="hsl(var(--status-green))"
              strokeWidth="4"
              strokeDasharray={`${holdProgress * 3.14} 314`}
              className="transition-all duration-75"
            />
          </svg>
        )}
        
        <Icon className={cn(
          iconSize,
          isActive ? config.iconClass : 'text-muted-foreground',
          isHolding && "animate-pulse"
        )} />
      </motion.div>

      {size === 'lg' && (
        <div className="text-center space-y-2">
          <h2 className={cn(
            "text-2xl font-semibold",
            isActive ? config.iconClass : 'text-muted-foreground'
          )}>
            {isActive ? config.label : 'Ready to Fócas'}
          </h2>
          <p className="text-muted-foreground text-sm max-w-[260px]">
            {isActive 
              ? config.description 
              : isHolding 
                ? `${Math.ceil((HOLD_DURATION - (holdProgress / 100 * HOLD_DURATION)) / 1000)}s to activate...`
                : 'Tap the button below to start a Fócas session'
            }
          </p>
        </div>
      )}
    </motion.div>
  );
};
