import { MobileLayout } from '@/components/layout/MobileLayout';
import { StatusIndicator } from '@/components/status/StatusIndicator';
import { SchoolModeToggle } from '@/components/status/SchoolModeToggle';
import { EncouragementNotification } from '@/components/student/EncouragementNotification';
import { ScheduleNotificationBanner } from '@/components/student/ScheduleNotificationBanner';
import { FocusRecommendationNotification } from '@/components/student/FocusRecommendationNotification';
import { SchoolEndNotification } from '@/components/student/SchoolEndNotification';
import { useApp } from '@/contexts/AppContext';
import { useScheduleNotifications } from '@/hooks/useScheduleNotifications';
import { useSchoolEndNotification } from '@/hooks/useSchoolEndNotification';
import { Clock, BookOpen, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const StatusPage = () => {
  const { 
    isFocasModeActive, 
    setFocasModeActive, 
    focusStatus,
    currentClass,
    todayStats,
    resetOnboarding,
    encouragementMessages,
    dismissEncouragement,
    notifyParent
  } = useApp();

  // Demo mode enabled for testing - set to false in production
  const DEMO_MODE = true;

  const handleMissedSession = (childName: string, message: string) => {
    notifyParent('missed_session', childName, message);
  };

  const {
    pendingSession,
    dismissPendingSession,
    activateFromNotification,
  } = useScheduleNotifications(
    isFocasModeActive, 
    () => setFocasModeActive(true), 
    DEMO_MODE,
    handleMissedSession
  );

  const {
    showSchoolEndNotification,
    dismissSchoolEndNotification,
  } = useSchoolEndNotification();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <MobileLayout>
      <div className="px-5 pt-14 pb-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl font-bold text-foreground">Study Mode</h1>
          <p className="text-sm text-muted-foreground mt-1">Stay focused during study time</p>
        </motion.div>

        {/* School End Notification */}
        <SchoolEndNotification
          isVisible={showSchoolEndNotification}
          onDismiss={dismissSchoolEndNotification}
        />

        {/* Schedule Notification Banner */}
        <ScheduleNotificationBanner
          pendingSession={pendingSession}
          onActivate={activateFromNotification}
          onDismiss={dismissPendingSession}
        />

        {/* Focus Recommendation from Teacher */}
        <FocusRecommendationNotification />

        {/* Encouragement Notifications */}
        <EncouragementNotification 
          messages={encouragementMessages}
          onDismiss={dismissEncouragement}
        />
        {/* Main Status Indicator - with hold to activate */}
        <div className="flex justify-center mb-10">
          <StatusIndicator 
            status={focusStatus} 
            isActive={isFocasModeActive}
            size="lg"
            onActivate={() => setFocasModeActive(true)}
          />
        </div>

        {/* Quick Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-card">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-status-green" />
              <span className="text-xs font-medium text-muted-foreground">Today</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {formatTime(todayStats.compliantMinutes)}
            </p>
            <p className="text-xs text-muted-foreground">in Study Mode</p>
          </div>

          {currentClass && (
            <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-muted-foreground">Current Class</span>
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
          transition={{ delay: 0.15 }}
          className="mb-6 p-3 rounded-xl bg-muted/50 border border-border/50"
        >
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            <span className="font-medium text-foreground">Your privacy matters.</span> Fócas tracks whether your focus mode is active — we never inspect your phone or access your apps.
          </p>
        </motion.div>

        {/* Deactivation Options - only show when active */}
        {isFocasModeActive && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <SchoolModeToggle 
              isActive={isFocasModeActive}
              onToggle={() => setFocasModeActive(!isFocasModeActive)}
            />
          </motion.div>
        )}

        {/* Logout Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetOnboarding();
              window.location.href = '/';
            }}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default StatusPage;
