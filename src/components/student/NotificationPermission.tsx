import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationPermissionProps {
  onComplete: (granted: boolean) => void;
}

const NotificationPermission = ({ onComplete }: NotificationPermissionProps) => {
  const [showAppleDialog, setShowAppleDialog] = useState(false);

  const handleEnable = () => {
    setShowAppleDialog(true);
  };

  const handleAllow = () => {
    localStorage.setItem('notificationPermissionGranted', 'true');
    onComplete(true);
  };

  const handleDontAllow = () => {
    localStorage.setItem('notificationPermissionGranted', 'false');
    onComplete(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <AnimatePresence mode="wait">
        {!showAppleDialog ? (
          <motion.div
            key="enable-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            {/* Icon */}
            <div className="w-24 h-24 rounded-3xl bg-status-amber/10 flex items-center justify-center mx-auto mb-8">
              <Bell className="w-12 h-12 text-status-amber" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-semibold text-foreground mb-4 text-center leading-tight">
              Enable Fócas Reminders
            </h1>

            {/* Description */}
            <p className="text-muted-foreground text-base leading-relaxed max-w-xs mx-auto text-center mb-8">
              Stay on track with helpful reminders and important updates from your school.
            </p>

            {/* Benefits list */}
            <div className="w-full max-w-sm space-y-3 mb-12">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-status-green/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-status-green" />
                </div>
                <span className="text-sm text-foreground">Get class schedule reminders</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-status-green/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-status-green" />
                </div>
                <span className="text-sm text-foreground">Receive encouragement from guardians</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-status-green/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-status-green" />
                </div>
                <span className="text-sm text-foreground">Never miss important announcements</span>
              </div>
            </div>

            {/* Enable button */}
            <Button
              onClick={handleEnable}
              className="w-full max-w-sm h-12 text-base font-medium"
            >
              Enable Notifications
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="apple-dialog"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex items-center justify-center"
          >
            {/* Apple-style permission dialog */}
            <div className="w-full max-w-sm bg-card rounded-2xl shadow-2xl overflow-hidden border">
              {/* Dialog header */}
              <div className="p-6 text-center">
                {/* App icon */}
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">F</span>
                </div>

                <h2 className="text-lg font-semibold text-foreground mb-3">
                  "Fócas" Would Like to Send You Notifications
                </h2>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Notifications may include alerts, sounds and icon badges. These can be configured in Settings.
                </p>
              </div>

              {/* Dialog buttons - Apple style stacked */}
              <div className="border-t">
                <button
                  onClick={handleDontAllow}
                  className="w-full py-3 text-muted-foreground text-base border-b hover:bg-muted/50 transition-colors"
                >
                  Don't Allow
                </button>
                <button
                  onClick={handleAllow}
                  className="w-full py-3 text-primary font-medium text-base hover:bg-muted/50 transition-colors"
                >
                  Allow
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPermission;
