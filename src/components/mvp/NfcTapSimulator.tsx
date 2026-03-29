import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Nfc, Smartphone, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NfcTapSimulatorProps {
  onTap: () => void;
  isActive: boolean;
  mode: 'activate' | 'deactivate';
}

/**
 * NFC Tap Simulator for MVP Prototyping
 * 
 * This component simulates the NFC tag tap interaction for:
 * - Figma prototype demonstrations
 * - User testing without physical NFC hardware
 * - Development and QA testing
 * 
 * In production, this would be replaced by actual NFC hardware integration
 * via the iOS Screen Time plugin.
 */
export const NfcTapSimulator = ({ onTap, isActive, mode }: NfcTapSimulatorProps) => {
  const [isTapping, setIsTapping] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const simulateTap = useCallback(() => {
    setIsTapping(true);
    
    // Simulate NFC detection delay
    setTimeout(() => {
      setIsTapping(false);
      setShowSuccess(true);
      
      // Trigger the callback after visual feedback
      setTimeout(() => {
        setShowSuccess(false);
        onTap();
      }, 800);
    }, 1200);
  }, [onTap]);

  return (
    <div className="relative">
      {/* Simulated NFC Tag Area */}
      <motion.button
        onClick={simulateTap}
        disabled={isTapping || showSuccess}
        className={cn(
          "relative w-full py-6 px-6 rounded-2xl border-2 border-dashed transition-all duration-300",
          "flex flex-col items-center justify-center gap-4",
          mode === 'activate'
            ? "border-status-green/50 bg-status-green/5 hover:bg-status-green/10 hover:border-status-green"
            : "border-status-amber/50 bg-status-amber/5 hover:bg-status-amber/10 hover:border-status-amber",
          (isTapping || showSuccess) && "pointer-events-none"
        )}
        whileTap={{ scale: 0.98 }}
      >
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="flex flex-col items-center gap-3"
            >
              <CheckCircle2 className="w-12 h-12 text-status-green" />
              <span className="text-status-green font-semibold">Tag Detected!</span>
            </motion.div>
          ) : isTapping ? (
            <motion.div
              key="tapping"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              {/* Phone approaching tag animation */}
              <div className="relative">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Smartphone className="w-10 h-10 text-primary" />
                </motion.div>
                
                {/* NFC waves */}
                <motion.div
                  className="absolute -inset-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
                </motion.div>
                <motion.div
                  className="absolute -inset-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                >
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
                </motion.div>
              </div>
              
              <span className="text-primary font-medium animate-pulse">
                Scanning...
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="relative">
                <Nfc className={cn(
                  "w-10 h-10",
                  mode === 'activate' ? "text-status-green" : "text-status-amber"
                )} />
                <motion.div
                  className="absolute -inset-2 rounded-full border border-current opacity-30"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              
              <div className="text-center">
                <p className={cn(
                  "font-semibold",
                  mode === 'activate' ? "text-status-green" : "text-status-amber"
                )}>
                  {mode === 'activate' ? 'Tap to Activate' : 'Tap to Deactivate'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Simulates NFC classroom tag
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* MVP Prototype Badge */}
      <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wide">
        MVP Demo
      </div>
    </div>
  );
};
