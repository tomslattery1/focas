import { MobileLayout } from '@/components/layout/MobileLayout';
import { StatusIndicator } from '@/components/status/StatusIndicator';
import { PhaseAnnotation } from './PhaseAnnotation';
import { useApp } from '@/contexts/AppContext';
import { Clock, BookOpen, Power, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

/**
 * MVP Home — Fócas Mode
 *
 * Core MVP:
 * ✅ Manual start / stop Fócas session
 * ✅ Green / Amber / Red status
 * ✅ Today's focus time
 * ✅ Current class
 *
 * Phase 2: NFC tag activation, teacher encouragement
 * Phase 3: Parent dashboard, AI recommendations
 */
const MvpStatusPage = () => {
  const {
    isFocasModeActive,
    setFocasModeActive,
    focusStatus,
    currentClass,
    todayStats,
  } = useApp();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const toggleSession = () => {
    const next = !isFocasModeActive;
    setFocasModeActive(next);
    toast.success(next ? 'Fócas session started' : 'Fócas session ended', {
      description: next
        ? 'Distracting apps are now blocked.'
        : 'Your phone is unrestricted.',
    });
  };

  return (
    <MobileLayout>
      <div className="px-5 pt-14 pb-6">

        {/* Status ring */}
        <div className="flex justify-center mb-8">
          <StatusIndicator
            status={focusStatus}
            isActive={isFocasModeActive}
            size="lg"
          />
        </div>

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
              {formatTime(todayStats.compliantMinutes)}
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

        {/* Phase annotations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-3"
        >
          <PhaseAnnotation
            phase="phase2"
            title="NFC Tag Activation"
            description="Tap an NFC tag in the classroom to start/stop Fócas Mode automatically."
          />
          <PhaseAnnotation
            phase="phase2"
            title="Teacher Notifications"
            description="Real-time encouragement messages and focus recommendations from teachers."
          />
          <PhaseAnnotation
            phase="phase3"
            title="Parent Dashboard"
            description="Guardian portal with focus reports and encouragement messaging."
          />
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default MvpStatusPage;
