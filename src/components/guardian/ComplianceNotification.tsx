import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ComplianceStatus } from '@/types/app';

interface Notification {
  id: string;
  childName: string;
  status: ComplianceStatus;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface ComplianceNotificationProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
}

const statusConfig: Record<'amber' | 'red', { icon: React.ElementType; className: string; bgClass: string; borderClass: string }> = {
  amber: { 
    icon: AlertTriangle, 
    className: 'text-amber-500', 
    bgClass: 'bg-amber-500/10',
    borderClass: 'border-amber-500/30'
  },
  red: { 
    icon: XCircle, 
    className: 'text-red-500', 
    bgClass: 'bg-red-500/10',
    borderClass: 'border-red-500/30'
  },
};

export const ComplianceNotification = ({ notifications, onDismiss, onDismissAll }: ComplianceNotificationProps) => {
  const unreadNotifications = notifications.filter(n => !n.read && (n.status === 'amber' || n.status === 'red'));

  if (unreadNotifications.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 space-y-2"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Focus Updates</span>
          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
            {unreadNotifications.length}
          </span>
        </div>
        {unreadNotifications.length > 1 && (
          <Button variant="ghost" size="sm" onClick={onDismissAll} className="text-xs h-7">
            Dismiss All
          </Button>
        )}
      </div>

      <AnimatePresence>
        {unreadNotifications.map((notification) => {
          const config = statusConfig[notification.status as 'amber' | 'red'];
          const StatusIcon = config.icon;

          return (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20, height: 0 }}
              className={`p-3 rounded-xl border ${config.bgClass} ${config.borderClass}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${config.bgClass}`}>
                    <StatusIcon className={`w-4 h-4 ${config.className}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{notification.childName}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onDismiss(notification.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
};

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}

export type { Notification };
