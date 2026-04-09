import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/contexts/AppContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useSessionTimer, loadDailyHistory } from '@/hooks/useSessionTimer';
import { Clock, BookOpen, Power, Shield, Flame, Target, Plus, Key } from 'lucide-react';
import { getBlockedCategories } from '@/pages/BlockedCategoriesPage';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo } from 'react';
import { FocusDurationSelector } from '@/components/student/FocusDurationSelector';
import { GuardianUnlockDialog } from '@/components/student/GuardianUnlockDialog';

const DURATION_STORAGE_KEY = 'focas_focus_duration';

function loadDuration(): number {
  try {
    const v = localStorage.getItem(DURATION_STORAGE_KEY);
    return v ? Number(v) : 30;
  } catch {
    return 30;
  }
}

const MvpStatusPage = () => {
  const {
    isFocasModeActive,
    setFocasModeActive,
    focusStatus,
    currentClass,
    schoolSettings,
  } = useApp();
  const { state: gamification, completeSession, updateFocusScore } = useGamification();
  const { todayCompliantMinutes, currentSessionMinutes, startSession, stopSession, isSessionActive } = useSessionTimer();
  const navigate = useNavigate();
  const [showNoCategoriesPrompt, setShowNoCategoriesPrompt] = useState(false);
  const [focusDuration, setFocusDuration] = useState(loadDuration);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);

  // Track remaining time
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const sessionStartRef = useRef<number | null>(null);

  // Restore session start time from localStorage on mount
  useEffect(() => {
    if (isFocasModeActive) {
      try {
        const sessionData = JSON.parse(localStorage.getItem('focas_session_data') || '{}');
        if (sessionData.sessionStartedAt) {
          sessionStartRef.current = new Date(sessionData.sessionStartedAt).getTime();
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(DURATION_STORAGE_KEY, String(focusDuration));
  }, [focusDuration]);

  // Countdown timer when session is active
  useEffect(() => {
    if (isFocasModeActive && sessionStartRef.current) {
      const targetMs = sessionStartRef.current + focusDuration * 60 * 1000;
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((targetMs - Date.now()) / 1000));
        setRemainingSeconds(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          // Auto-end session
          endSession();
          toast.success('Focus session complete! 🎉', {
            description: `Great job staying focused for ${focusDuration} minutes.`,
          });
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isFocasModeActive, focusDuration]);

  const formatCountdown = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  // Calculate weekly focus hours toward goal
  const weeklyFocusMinutes = useMemo(() => {
    const history = loadDailyHistory();
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0=Sun
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(now);
    monday.setDate(now.getDate() - mondayOffset);
    monday.setHours(0, 0, 0, 0);

    let total = 0;
    for (const [dateStr, mins] of Object.entries(history)) {
      const d = new Date(dateStr + 'T00:00:00');
      if (d >= monday && d <= now) {
        total += mins;
      }
    }
    return total;
  }, [todayCompliantMinutes]); // re-derive when today's minutes change

  const weeklyFocusHours = (weeklyFocusMinutes + todayCompliantMinutes) / 60;
  const targetHours = gamification.weeklyGoal.targetHours;
  const liveScore = targetHours > 0 ? Math.min(100, Math.round((weeklyFocusHours / targetHours) * 100)) : 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const endSession = () => {
    setFocasModeActive(false);
    stopSession();
    completeSession(liveScore);
    sessionStartRef.current = null;
    setRemainingSeconds(0);
  };

  const toggleSession = () => {
    const next = !isFocasModeActive;

    if (next && getBlockedCategories().length === 0) {
      setShowNoCategoriesPrompt(true);
      return;
    }
    setShowNoCategoriesPrompt(false);

    if (next) {
      setFocasModeActive(true);
      startSession();
      updateFocusScore(liveScore);
      sessionStartRef.current = Date.now();
      setRemainingSeconds(focusDuration * 60);
      toast.success('Fócas session started', {
        description: `Focusing for ${focusDuration} minutes. Distracting apps are now blocked.`,
      });
    } else {
      endSession();
      toast.success('Fócas session ended', {
        description: 'Your phone is unrestricted.',
      });
    }
  };

  const handleGuardianUnlock = () => {
    endSession();
    setShowUnlockDialog(false);
  };

  return (
    <MobileLayout>
      <div className="px-5 pt-14 pb-6">

        {/* Focus Score Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center mb-6"
        >
          <motion.div
            className={`w-40 h-40 rounded-full flex flex-col items-center justify-center ${
              isFocasModeActive
                ? 'bg-[hsl(var(--status-green-light))]'
                : 'bg-muted'
            }`}
            animate={isFocasModeActive ? {
              boxShadow: [
                '0 0 20px hsl(var(--status-green) / 0.3)',
                '0 0 40px hsl(var(--status-green) / 0.5)',
                '0 0 20px hsl(var(--status-green) / 0.3)',
              ]
            } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            {isFocasModeActive ? (
              <>
                <span className="text-3xl font-bold text-foreground font-mono">{formatCountdown(remainingSeconds)}</span>
                <span className="text-xs text-muted-foreground font-medium mt-1">remaining</span>
              </>
            ) : (
              <>
                <span className="text-4xl font-bold text-foreground">{liveScore}%</span>
                <span className="text-xs text-muted-foreground font-medium mt-1">of weekly goal</span>
                <span className="text-[10px] text-muted-foreground mt-0.5">{weeklyFocusHours.toFixed(1)}h / {targetHours}h</span>
              </>
            )}
          </motion.div>

          {/* Streak + Goal row */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--status-amber-light))] border border-[hsl(var(--status-amber)/0.2)]">
              <Flame className="w-3.5 h-3.5 text-[hsl(var(--status-amber))]" />
              <span className="text-xs font-semibold text-foreground">{gamification.currentStreak} day{gamification.currentStreak !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--status-green-light))] border border-[hsl(var(--status-green)/0.2)]">
              <Target className="w-3.5 h-3.5 text-[hsl(var(--status-green))]" />
              <span className="text-xs font-semibold text-foreground">Goal: {gamification.weeklyGoal.targetHours}h/wk</span>
            </div>
          </div>
        </motion.div>

        {/* Duration selector — only when session is NOT active */}
        {!isFocasModeActive && (
          <FocusDurationSelector selected={focusDuration} onChange={setFocusDuration} />
        )}

        {/* Blocked categories — visible during active session */}
        {isFocasModeActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-6"
          >
            <Shield className="w-4 h-4 text-muted-foreground" />
            {getBlockedCategories().map((category) => (
              <span
                key={category}
                className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border"
              >
                {category} limited
              </span>
            ))}
          </motion.div>
        )}

        {/* No categories prompt */}
        {showNoCategoriesPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-2xl bg-primary/5 border border-primary/20"
          >
            <p className="text-sm text-foreground mb-3">
              Add at least one app category to block before starting your session — even one small step counts!
            </p>
            <button
              onClick={() => navigate('/settings/blocked-categories')}
              className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <Plus className="w-4 h-4" />
              Choose categories to block
            </button>
          </motion.div>
        )}

        {/* Big toggle button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4"
        >
          <motion.button
            onClick={toggleSession}
            whileTap={{ scale: 0.96 }}
            className={`w-full py-5 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-colors ${
              isFocasModeActive
                ? 'bg-destructive text-destructive-foreground'
                : 'bg-[hsl(var(--status-green))] text-primary-foreground'
            }`}
          >
            <Power className="w-5 h-5" />
            {isFocasModeActive ? 'End Fócas Session' : 'Start Fócas Session'}
          </motion.button>
        </motion.div>

        {/* Guardian unlock button — only during active session */}
        {isFocasModeActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-6"
          >
            <button
              onClick={() => setShowUnlockDialog(true)}
              className="w-full py-3 px-4 rounded-xl text-sm font-medium text-muted-foreground bg-muted/50 border border-border/50 hover:bg-muted transition-colors flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              Have a guardian unlock code?
            </button>
          </motion.div>
        )}

        {/* Quick stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 gap-3 mb-6"
        >
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-[hsl(var(--status-green))]" />
              <span className="text-xs font-medium text-muted-foreground">Today</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {formatTime(todayCompliantMinutes)}
            </p>
            <p className="text-xs text-muted-foreground">Focus time</p>
          </div>

          {currentClass && (
            <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Current</span>
              </div>
              <p className="text-lg font-bold text-foreground truncate">
                {currentClass.name}
              </p>
              <p className="text-xs text-muted-foreground">{currentClass.room}</p>
            </div>
          )}
        </motion.div>

        {/* Privacy note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-3 rounded-xl bg-muted/50 border border-border/50"
        >
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <span className="font-medium text-foreground">Your privacy matters.</span>{' '}
            Fócas blocks distracting apps — we never inspect your phone or access personal data.
          </p>
        </motion.div>

      </div>

      <GuardianUnlockDialog
        open={showUnlockDialog}
        onOpenChange={setShowUnlockDialog}
        onSuccess={handleGuardianUnlock}
      />
    </MobileLayout>
  );
};

export default MvpStatusPage;
