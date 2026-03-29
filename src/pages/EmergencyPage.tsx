import { useState } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { useApp } from '@/contexts/AppContext';
import { AlertTriangle, Phone, Shield, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const EmergencyPage = () => {
  const { isEmergencyUnlocked, setEmergencyUnlocked, isFocasModeActive, notifyParent } = useApp();
  const [showConfirm, setShowConfirm] = useState(false);
  const [unlockDuration, setUnlockDuration] = useState<number | null>(null);

  const handleEmergencyRequest = () => {
    setShowConfirm(true);
  };

  const confirmUnlock = (minutes: number) => {
    setUnlockDuration(minutes);
    setEmergencyUnlocked(true);
    setShowConfirm(false);
    
    // Notify parent about emergency unlock
    notifyParent(
      'emergency_exit',
      'Your child',
      `Used emergency unlock for ${minutes} minutes during school hours.`
    );
  };

  const cancelUnlock = () => {
    setEmergencyUnlocked(false);
    setUnlockDuration(null);
  };

  return (
    <MobileLayout>
      <div className="px-5 pt-14 pb-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">Emergency Access</h1>
          <p className="text-sm text-muted-foreground mt-1">
            For exceptional situations only
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-status-amber-light border border-status-amber/20 rounded-2xl p-5 mb-6"
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
              <div className="bg-status-green-light rounded-2xl p-8 mb-6">
                <CheckCircle className="w-16 h-16 text-status-green mx-auto mb-4" />
                <h2 className="text-xl font-bold text-status-green mb-2">
                  Emergency Unlock Active
                </h2>
                <p className="text-muted-foreground text-sm">
                  {unlockDuration} minutes remaining
                </p>
              </div>

              <button
                onClick={cancelUnlock}
                className="w-full py-4 px-6 rounded-2xl font-semibold bg-secondary text-secondary-foreground"
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
                      className="w-full py-3 px-4 rounded-xl bg-secondary text-secondary-foreground font-medium hover:bg-accent transition-colors"
                    >
                      {mins} minutes
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-3 text-muted-foreground font-medium"
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
              {/* Emergency Contact */}
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
                    ? "bg-status-amber text-primary-foreground"
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
      </div>
    </MobileLayout>
  );
};

export default EmergencyPage;
