import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Power, KeyRound, Timer, Coffee, Home, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ClassCodeDialog } from '@/components/student/ClassCodeDialog';
import { useSchoolModeTimer } from '@/hooks/useSchoolModeTimer';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

interface SchoolModeToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

const HOLD_DURATION = 2000; // 2 seconds to activate

export type DeactivationMethod = 'teacher_code' | 'guardian_code';

// Log deactivation for tracking
const logDeactivation = (method: DeactivationMethod, studentName: string = 'Student User') => {
  const log = {
    timestamp: new Date().toISOString(),
    method,
    studentName,
  };
  const existingLogs = JSON.parse(localStorage.getItem('focas_deactivation_logs') || '[]');
  localStorage.setItem('focas_deactivation_logs', JSON.stringify([log, ...existingLogs]));
};

export const SchoolModeToggle = ({ isActive, onToggle }: SchoolModeToggleProps) => {
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [codeType, setCodeType] = useState<'teacher' | 'guardian'>('teacher');
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { notifyParent } = useApp();
  const { formattedTimeRemaining, isBreakTime, currentPeriod, schoolEndTime, isOutsideSchoolHours } = useSchoolModeTimer(isActive);

  const handleCodeSuccess = (type: 'teacher' | 'guardian') => {
    const method: DeactivationMethod = type === 'teacher' ? 'teacher_code' : 'guardian_code';
    logDeactivation(method);
    
    toast.success('Code verified', {
      description: 'Study Mode deactivated.',
    });
    notifyParent(
      'early_exit',
      'Your child',
      `Deactivated Study Mode using ${type === 'teacher' ? 'teacher' : 'guardian'} code.`
    );
    onToggle();
  };

  const openCodeDialog = (type: 'teacher' | 'guardian') => {
    setCodeType(type);
    setShowCodeDialog(true);
  };

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

  const handleHoldStart = useCallback((isDeactivation: boolean = false) => {
    setIsHolding(true);
    setHoldProgress(0);

    // Progress update interval
    const startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setHoldProgress(progress);
    }, 16);

    // Activation/Deactivation timer
    holdTimerRef.current = setTimeout(() => {
      clearTimers();
      setIsHolding(false);
      setHoldProgress(0);
      
      if (isDeactivation) {
        toast.success('Study Mode deactivated', {
          description: 'You can use your phone freely now.',
        });
      } else {
        toast.success('Study Mode activated', {
          description: 'Focus mode is now active.',
        });
      }
      onToggle();
    }, HOLD_DURATION);
  }, [clearTimers, onToggle]);

  const handleHoldEnd = useCallback(() => {
    clearTimers();
    setIsHolding(false);
    setHoldProgress(0);
  }, [clearTimers]);

  // Show deactivation options when active
  if (isActive) {
    return (
      <div className="space-y-4">
        {/* Status and Timer Card */}
        <div className={cn(
          "text-center py-4 px-6 rounded-2xl border",
          isBreakTime 
            ? "bg-amber-500/10 border-amber-500/20" 
            : isOutsideSchoolHours
              ? "bg-primary/10 border-primary/20"
              : "bg-status-green-light border-status-green/20"
        )}>
          {isBreakTime ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Coffee className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-600 font-medium">
                  Break Time - Phone OK
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {currentPeriod?.name} until {currentPeriod?.endTime}
              </p>
            </>
          ) : isOutsideSchoolHours ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Home className="w-4 h-4 text-primary" />
                <p className="text-sm text-primary font-medium">
                  Home Study Mode
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                You're studying outside school hours
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-status-green font-medium">
                Study Mode is active
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your phone is in focus mode
              </p>
            </>
          )}
        </div>

        {/* Countdown Timer - only show during school hours */}
        {!isOutsideSchoolHours && (
          <div className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-muted/50 border border-border/50">
            <Timer className="w-5 h-5 text-primary" />
            <div className="text-center">
              <p className="text-lg font-bold text-foreground">
                {formattedTimeRemaining}
              </p>
              <p className="text-xs text-muted-foreground">
                until school ends{schoolEndTime && ` (${schoolEndTime})`}
              </p>
            </div>
          </div>
        )}

        {/* Deactivation options */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground text-center uppercase tracking-wide">
            Deactivation Options
          </p>

          {/* Code Options - side by side */}
          <div className="grid grid-cols-2 gap-3">
            {/* Teacher Code Option */}
            <Button
              variant="outline"
              onClick={() => openCodeDialog('teacher')}
              className="h-auto py-4 flex flex-col items-center gap-2 rounded-xl border-destructive/30 hover:border-destructive/50 hover:bg-destructive/5"
            >
              <KeyRound className="w-6 h-6 text-destructive/70" />
              <span className="text-sm font-medium">Teacher Code</span>
              <span className="text-xs text-muted-foreground">During school</span>
            </Button>

            {/* Guardian Code Option */}
            <Button
              variant="outline"
              onClick={() => openCodeDialog('guardian')}
              className="h-auto py-4 flex flex-col items-center gap-2 rounded-xl border-primary/30 hover:border-primary/50 hover:bg-primary/5"
            >
              <ShieldCheck className="w-6 h-6 text-primary/70" />
              <span className="text-sm font-medium">Guardian Code</span>
              <span className="text-xs text-muted-foreground">Home study</span>
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          For emergencies, use the Emergency tab in Settings
        </p>

        <ClassCodeDialog
          open={showCodeDialog}
          onOpenChange={setShowCodeDialog}
          onSuccess={() => handleCodeSuccess(codeType)}
          codeType={codeType}
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <motion.button
        onMouseDown={() => handleHoldStart(false)}
        onMouseUp={handleHoldEnd}
        onMouseLeave={handleHoldEnd}
        onTouchStart={() => handleHoldStart(false)}
        onTouchEnd={handleHoldEnd}
        onTouchCancel={handleHoldEnd}
        className={cn(
          "relative w-full py-5 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 overflow-hidden",
          "flex flex-col items-center justify-center gap-2",
          isHolding 
            ? "bg-status-green/80 text-primary-foreground" 
            : "bg-status-green text-primary-foreground"
        )}
        whileTap={{ scale: 0.98 }}
      >
        {/* Progress background */}
        <motion.div
          className="absolute inset-0 bg-primary-foreground/20 origin-left"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: holdProgress / 100 }}
          transition={{ duration: 0.05 }}
        />
        
        <div className="relative flex items-center gap-3">
          <Power className={cn("w-5 h-5", isHolding && "animate-pulse")} />
          <span>{isHolding ? 'Hold to Activate...' : 'Hold to Activate Study Mode'}</span>
        </div>
        
        {isHolding && (
          <span className="text-xs opacity-80 relative">
            {Math.ceil((HOLD_DURATION - (holdProgress / 100 * HOLD_DURATION)) / 1000)}s remaining
          </span>
        )}
      </motion.button>
      
      <p className="text-xs text-muted-foreground text-center">
        Press and hold for 2 seconds to activate
      </p>
    </div>
  );
};