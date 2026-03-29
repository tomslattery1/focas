import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, X, ChevronRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRecommendations } from '@/contexts/RecommendationContext';
import { APP_CATEGORY_LABELS, APP_CATEGORY_ICONS } from '@/types/recommendations';
import { AttestationDialog } from './AttestationDialog';

export const FocusRecommendationNotification = () => {
  const { pendingRecommendation, setPendingRecommendation } = useRecommendations();
  const [showPickerStep, setShowPickerStep] = useState(false);
  const [showAttestationDialog, setShowAttestationDialog] = useState(false);

  if (!pendingRecommendation) return null;

  const handleReviewAndApply = () => {
    setShowPickerStep(true);
  };

  const handleOpenSettings = () => {
    // This would trigger the native FamilyActivityPicker in a real iOS app
    // For now, we simulate the user completing that step
    setShowPickerStep(false);
    setShowAttestationDialog(true);
  };

  const handleDismiss = () => {
    setPendingRecommendation(null);
  };

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="mb-6"
        >
          <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-background to-primary/5 shadow-lg">
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            />

            <div className="relative z-10 p-4">
              {!showPickerStep ? (
                // Step 1: Initial notification
                <>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center"
                      >
                        <Shield className="w-6 h-6 text-primary" />
                      </motion.div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-foreground mb-1">
                        Focus Mode Recommendation
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {pendingRecommendation.teacherName} recommends blocking:
                      </p>
                      
                      {/* Categories */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {pendingRecommendation.categories.map(category => (
                          <span 
                            key={category}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-xs font-medium"
                          >
                            {APP_CATEGORY_ICONS[category]} {APP_CATEGORY_LABELS[category]}
                          </span>
                        ))}
                      </div>

                      {pendingRecommendation.customMessage && (
                        <p className="text-sm text-foreground italic mb-3 p-2 bg-muted/50 rounded-lg">
                          "{pendingRecommendation.customMessage}"
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground mb-3">
                        For: <span className="font-medium">{pendingRecommendation.className}</span>
                      </p>

                      <div className="flex gap-2">
                        <Button 
                          onClick={handleReviewAndApply}
                          size="sm"
                          className="gap-1.5"
                        >
                          Review & Apply
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={handleDismiss}
                          variant="ghost"
                          size="sm"
                          className="text-muted-foreground"
                        >
                          Later
                        </Button>
                      </div>
                    </div>

                    <Button
                      onClick={handleDismiss}
                      variant="ghost"
                      size="icon"
                      className="flex-shrink-0 h-8 w-8 text-muted-foreground"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                // Step 2: Picker placeholder
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-4"
                  >
                    <Smartphone className="w-8 h-8 text-primary" />
                  </motion.div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Choose Apps to Block
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
                    Apple's Screen Time picker will open. Select the apps you want to block during class.
                  </p>

                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={handleOpenSettings}
                      className="gap-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      Open Screen Time Settings
                    </Button>
                    <Button 
                      onClick={() => setShowPickerStep(false)}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                    >
                      Go Back
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-4">
                    You control which apps are blocked. Your teacher won't see your app list.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Attestation Dialog */}
      <AttestationDialog 
        open={showAttestationDialog}
        onOpenChange={setShowAttestationDialog}
      />
    </>
  );
};
