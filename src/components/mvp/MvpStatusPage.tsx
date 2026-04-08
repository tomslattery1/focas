import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/contexts/AppContext';
import { useGamification } from '@/contexts/GamificationContext';
import { useSessionTimer } from '@/hooks/useSessionTimer';
import { Clock, BookOpen, Power, Shield, Flame, Target } from 'lucide-react';
import { getBlockedCategories } from '@/pages/BlockedCategoriesPage';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

/**
 * MVP Home — Fócas Mode
 *
 * Core MVP:
 * ✅ Manual start / stop Fócas session
 * ✅ Green / Amber / Red status
 * ✅ Real-time focus timer & score
 * ✅ Current class
 */
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

  // Compute elapsed school minutes today (used as denominator for focus score)
  const getElapsedSchoolMinutes = (): number => {
    const now = new Date();
    const [startH, startM] = schoolSettings.schoolStartTime.split(':').map(Number);
    const [endH, endM] = schoolSettings.schoolEndTime.split(':').map(Number);
    const schoolStartMin = startH * 60 + startM;
    const schoolEndMin = endH * 60 + endM;
    const currentMin = now.getHours() * 60 + now.getMinutes();
    // Clamp to school window
    const effectiveStart = Math.max(schoolStartMin, Math.min(currentMin, schoolEndMin));
    const elapsed = effectiveStart - schoolStartMin;
    return Math.max(1, elapsed); // at least 1 to avoid division by zero
  };

  const elapsedSchoolMinutes = getElapsedSchoolMinutes();
  const liveScore = Math.min(100, Math.round((todayCompliantMinutes / elapsedSchoolMinutes) * 100));

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const toggleSession = () => {
    const next = !isFocasModeActive;
    setFocasModeActive(next);
    if (next) {
      startSession();
      updateFocusScore(liveScore);
    } else {
      stopSession();
      completeSession(liveScore);
    }
    toast.success(next ? 'Fócas session started' : 'Fócas session ended', {
      description: next
        ? 'Distracting apps are now blocked.'
        : 'Your phone is unrestricted.',
    });
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
            <span className="text-4xl font-bold text-foreground">{liveScore}%</span>
            <span className="text-xs text-muted-foreground font-medium mt-1">Focus Score</span>
          </motion.div>

          {/* Streak + Goal row */}
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--status-amber-light))] border border-[hsl(var(--status-amber)/0.2)]">
              <Flame className="w-3.5 h-3.5 text-[hsl(var(--status-amber))]" />
              <span className="text-xs font-semibold text-foreground">{gamification.currentStreak} day{gamification.currentStreak !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[hsl(var(--status-green-light))] border border-[hsl(var(--status-green)/0.2)]">
              <Target className="w-3.5 h-3.5 text-[hsl(var(--status-green))]" />
              <span className="text-xs font-semibold text-foreground">Goal: {gamification.weeklyGoal.targetPercentage}%</span>
            </div>
          </div>
        </motion.div>

        {/* Blocked categories — visible during active session */}
        {isFocasModeActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-6"
          >
            <Shield className="w-4 h-4 text-muted-foreground" />
            {['Social Media', 'Games', 'Entertainment'].map((category) => (
              <span
                key={category}
                className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border"
              >
                {category} limited
              </span>
            ))}
          </motion.div>
        )}

        {/* Big toggle button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
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
    </MobileLayout>
  );
};

export default MvpStatusPage;
