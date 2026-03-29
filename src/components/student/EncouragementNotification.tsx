import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EncouragementMessage {
  id: string;
  message: string;
  senderName: string;
  timestamp: Date;
}

interface EncouragementNotificationProps {
  messages: EncouragementMessage[];
  onDismiss: (id: string) => void;
}

export const EncouragementNotification = ({ messages, onDismiss }: EncouragementNotificationProps) => {
  if (messages.length === 0) return null;

  return (
    <div className="space-y-3 mb-6">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-500/20 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                <Heart className="w-5 h-5 text-pink-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  From {msg.senderName}
                </p>
                <p className="text-base text-foreground mt-1">
                  {msg.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatTime(msg.timestamp)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => onDismiss(msg.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Decorative sparkles */}
            <div className="absolute top-2 right-12 text-pink-400/30 text-lg">✨</div>
            <div className="absolute bottom-2 left-16 text-purple-400/30 text-sm">💫</div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

const formatTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString();
};
