import { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { PhaseAnnotation } from '@/components/mvp/PhaseAnnotation';
import { useApp } from '@/contexts/AppContext';
import { AlertTriangle, Phone, Shield, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * MVP Emergency Page - Emergency Unlock Flow
 * 
 * Core MVP Features:
 * ✅ Emergency unlock request flow
 * ✅ Duration selection (5/15/30 min)
 * ✅ Emergency contact display
 * ✅ Unlock status indicator
 * 
 * Phase 2 Features (noted):
 * - Immediate parent notification
 * - Teacher override capability
 * - Usage logging and reports
 * 
 * Phase 3 Features (noted):
 * - Location-based emergency detection
 * - Integration with school safety systems
 */
const MvpEmergencyPage = () => {
  const { isEmergencyUnlocked, setEmergencyUnlocked, isFocasModeActive, setFocasModeActive } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);
  const [unlockDuration, setUnlockDuration] = useState<number | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleEmergencyRequest = () => {
    setShowConfirm(true);
  };

  const confirmUnlock = (minutes: number) => {
    setUnlockDuration(minutes);
    setCountdown(minutes);
    setEmergencyUnlocked(true);
    setFocasModeActive(false);
    setShowConfirm(false);
    
    toast.warning('Emergency Unlock Active', {
      description: `Your phone is unlocked for ${minutes} minutes.`,
    });
  };

  const cancelUnlock = () => {
    setEmergencyUnlocked(false);
    setUnlockDuration(null);
    setCountdown(null);
    toast.success('Emergency unlock ended', {
      description: 'Fócas Mode can be reactivated.',
    });
  };

  return (
    <MobileLayout>
      <div className="px-5 pt-14 pb-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground">Emergency Access</h1>
          <p className="text-sm text-muted-foreground mt-1">
            For exceptional situations only
          </p>
        </motion.div>

        {/* Warning Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-status-amber/10 border border-status-amber/20 rounded-2xl p-5 mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-status-amber shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-foreground mb-1">Important Notice</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Emergency unlock is for genuine emergencies only. All unlock requests 
                are logged and may be reviewed by school staff.
              </p>
            </div>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isEmergencyUnlocked ? (
            <motion.div
              key="unlocked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center"
            >
              <div className="bg-status-green/10 border border-status-green/20 rounded-2xl p-8 mb-6">
                <CheckCircle className="w-16 h-16 text-status-green mx-auto mb-4" />
                <h2 className="text-xl font-bold text-status-green mb-2">
                  Emergency Unlock Active
                </h2>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{unlockDuration} minutes remaining</span>
                </div>
              </div>

              <button
                onClick={cancelUnlock}
                className="w-full py-4 px-6 rounded-2xl font-semibold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                End Emergency Unlock
              </button>
            </motion.div>
          ) : showConfirm ? (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-card mb-6">
                <h3 className="font-semibold text-foreground mb-4 text-center">
                  Select unlock duration
                </h3>
                <div className="space-y-3">
                  {[5, 15, 30].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => confirmUnlock(mins)}
                      className="w-full py-4 px-4 rounded-xl bg-status-amber/10 border border-status-amber/30 text-foreground font-medium hover:bg-status-amber/20 transition-colors flex items-center justify-between"
                    >
                      <span>{mins} minutes</span>
                      <Clock className="w-4 h-4 text-status-amber" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-3 text-muted-foreground font-medium hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="request"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Emergency Contact Card */}
              <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Emergency Contact</h3>
                    <p className="text-sm text-muted-foreground">Call school office: 555-0123</p>
                  </div>
                </div>
              </div>

              {/* Request Button */}
              <button
                onClick={handleEmergencyRequest}
                disabled={!isFocasModeActive}
                className={cn(
                  "w-full py-4 px-6 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 transition-all",
                  isFocasModeActive
                    ? "bg-status-amber text-white hover:bg-status-amber/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Shield className="w-5 h-5" />
                Request Emergency Unlock
              </button>

              {!isFocasModeActive && (
                <p className="text-center text-sm text-muted-foreground">
                  Fócas Mode is not active
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Future Phase Annotations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 space-y-3"
        >
          <PhaseAnnotation
            phase="phase2"
            title="Parent Notifications"
            description="Immediate push notification to parents/guardians when emergency unlock is used."
          />
          <PhaseAnnotation
            phase="phase3"
            title="Safety Integration"
            description="Connection to school safety systems for genuine emergency situations."
          />
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default MvpEmergencyPage;
