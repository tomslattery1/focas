import { motion, AnimatePresence } from 'framer-motion';
import { PartyPopper, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SchoolEndNotificationProps {
  isVisible: boolean;
  onDismiss: () => void;
}

export const SchoolEndNotification = ({ isVisible, onDismiss }: SchoolEndNotificationProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-yellow-500/10 border border-amber-500/20 p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <PartyPopper className="w-5 h-5 text-amber-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-foreground">
                🎉 School's out!
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Your phone is now officially off-duty too.
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={onDismiss}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-1 right-12 text-amber-400/40 text-lg">🎊</div>
          <div className="absolute bottom-1 left-20 text-yellow-400/40 text-sm">✨</div>
          <div className="absolute top-3 left-1/2 text-orange-400/30 text-xs">🌟</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
