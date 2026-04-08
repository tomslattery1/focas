import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Smartphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PendingSession } from '@/hooks/useScheduleNotifications';

interface ScheduleNotificationBannerProps {
  pendingSession: PendingSession | null;
  onActivate: () => void;
  onDismiss: () => void;
}

export const ScheduleNotificationBanner = ({
  pendingSession,
  onActivate,
  onDismiss,
}: ScheduleNotificationBannerProps) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  if (!pendingSession) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="mb-6"
      >
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-4 shadow-lg">
          <motion.div
            className="absolute inset-0 bg-primary/5"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative z-10">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center"
                >
                  <Bell className="w-5 h-5 text-primary" />
                </motion.div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground mb-1">
                  Fócas Mode is ready!
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Session: {formatTime(pendingSession.startTime)} – {formatTime(pendingSession.endTime)}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Button onClick={onActivate} size="sm" className="gap-1.5">
                    <Smartphone className="w-4 h-4" />
                    Start Fócas Session
                  </Button>
                  <Button onClick={onDismiss} variant="ghost" size="sm" className="text-muted-foreground">
                    Later
                  </Button>
                </div>
              </div>

              <Button
                onClick={onDismiss}
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};