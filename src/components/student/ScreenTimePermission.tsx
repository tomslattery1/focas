import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScreenTimePermissionProps {
  onComplete: (granted?: boolean) => void;
}

/**
 * FamilyControls / Screen Time permission screen.
 * In the real iOS build this calls the FocasScreenTimePlugin.
 * For the MVP prototype it simulates the Apple permission dialog.
 */
const ScreenTimePermission = ({ onComplete }: ScreenTimePermissionProps) => {
  const [showAppleDialog, setShowAppleDialog] = useState(false);

  const handleConnect = () => setShowAppleDialog(true);

  const handleAllow = () => {
    localStorage.setItem('screenTimePermissionGranted', 'true');
    onComplete(true);
  };

  const handleDeny = () => {
    localStorage.setItem('screenTimePermissionGranted', 'false');
    onComplete(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <AnimatePresence mode="wait">
        {!showAppleDialog ? (
          <motion.div
            key="explain"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col items-center justify-center"
          >
            <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-8">
              <Smartphone className="w-12 h-12 text-primary" />
            </div>

            <h1 className="text-2xl font-semibold text-foreground mb-4 text-center">
              Enable FamilyControls
            </h1>

            <p className="text-muted-foreground text-base text-center max-w-xs mb-8">
              Fócas uses Apple's FamilyControls to block distracting apps during
              your focus sessions. We never see which apps you use.
            </p>

            <div className="w-full max-w-sm space-y-3 mb-12">
              {[
                'Block distracting apps when you choose to focus',
                'Automatically lift restrictions when your session ends',
                'Your app list stays completely private',
              ].map((text) => (
                <div key={text} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--status-green))]/20 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-[hsl(var(--status-green))]" />
                  </div>
                  <span className="text-sm text-foreground">{text}</span>
                </div>
              ))}
            </div>

            <Button onClick={handleConnect} className="w-full max-w-sm h-12 text-base font-medium">
              Grant Permission
            </Button>

            <button
              onClick={() => onComplete(false)}
              className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="dialog"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex items-center justify-center"
          >
            <div className="w-full max-w-sm bg-card rounded-2xl shadow-2xl overflow-hidden border">
              <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary-foreground">F</span>
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-3">
                  "Fócas" Would Like to Access Screen Time
                </h2>
                <p className="text-sm text-muted-foreground">
                  This allows Fócas to restrict apps during focus sessions.
                </p>
              </div>
              <div className="border-t">
                <button
                  onClick={handleAllow}
                  className="w-full py-3 text-primary font-medium text-base border-b hover:bg-muted/50 transition-colors"
                >
                  Continue
                </button>
                <button
                  onClick={handleDeny}
                  className="w-full py-3 text-muted-foreground text-base hover:bg-muted/50 transition-colors"
                >
                  Don't Allow
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScreenTimePermission;
