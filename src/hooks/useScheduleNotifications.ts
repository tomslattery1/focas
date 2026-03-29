import { useState, useEffect, useCallback, useRef } from 'react';
import { ScheduleConfig } from '@/types/app';

export interface PendingSession {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  triggeredAt: Date;
}

const TEACHER_SCHEDULES_KEY = 'focas_teacher_schedules';
const REMINDER_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export const getTeacherSchedules = (): ScheduleConfig[] => {
  const saved = localStorage.getItem(TEACHER_SCHEDULES_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
};

export const saveTeacherSchedules = (schedules: ScheduleConfig[]) => {
  localStorage.setItem(TEACHER_SCHEDULES_KEY, JSON.stringify(schedules));
};

const parseTime = (timeStr: string): { hours: number; minutes: number } => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
};

// Get admin-configured school hours
const getAdminSchedule = (): { dayOfWeek: number; startTime: string; endTime: string; isActive: boolean }[] => {
  const saved = localStorage.getItem('focas_admin_schedule');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  // Default school hours
  return [
    { dayOfWeek: 1, startTime: '08:50', endTime: '15:05', isActive: true },
    { dayOfWeek: 2, startTime: '08:50', endTime: '15:05', isActive: true },
    { dayOfWeek: 3, startTime: '08:50', endTime: '15:05', isActive: true },
    { dayOfWeek: 4, startTime: '08:50', endTime: '15:05', isActive: true },
    { dayOfWeek: 5, startTime: '08:50', endTime: '12:40', isActive: true },
  ];
};

// Check if current time is within school hours
export const isWithinSchoolHours = (now: Date = new Date()): boolean => {
  const adminSchedule = getAdminSchedule();
  const todaySchedule = adminSchedule.find(s => s.dayOfWeek === now.getDay());
  
  if (!todaySchedule || !todaySchedule.isActive) return false;
  
  const { hours: startH, minutes: startM } = parseTime(todaySchedule.startTime);
  const { hours: endH, minutes: endM } = parseTime(todaySchedule.endTime);
  
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  
  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
};

const isWithinSchedule = (schedule: ScheduleConfig, now: Date): boolean => {
  if (!schedule.isActive) return false;
  if (schedule.dayOfWeek !== now.getDay()) return false;

  const { hours: startH, minutes: startM } = parseTime(schedule.startTime);
  const { hours: endH, minutes: endM } = parseTime(schedule.endTime);

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  return currentMinutes >= startMinutes && currentMinutes < endMinutes;
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Only send notifications during school hours
const sendPushNotification = (title: string, body: string) => {
  // Only send if within school hours
  if (!isWithinSchoolHours()) {
    console.log('Notification suppressed - outside school hours');
    return;
  }
  
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag: 'school-mode-reminder',
    });
  }
};

export const useScheduleNotifications = (
  isSchoolModeActive: boolean,
  onActivate: () => void,
  demoMode: boolean = false,
  onMissedSession?: (childName: string, message: string) => void
) => {
  const [pendingSession, setPendingSession] = useState<PendingSession | null>(null);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [demoDismissed, setDemoDismissed] = useState(false);
  const reminderIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastNotifiedScheduleRef = useRef<string | null>(null);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission().then(setHasNotificationPermission);
  }, []);

  // Demo mode: show pending session immediately (only if not dismissed)
  useEffect(() => {
    if (demoMode && !isSchoolModeActive && !pendingSession && !demoDismissed) {
      const now = new Date();
      const demoSession: PendingSession = {
        id: 'demo-session',
        dayOfWeek: now.getDay(),
        startTime: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        endTime: `${String(now.getHours() + 1).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        triggeredAt: now,
      };
      setPendingSession(demoSession);
    }
  }, [demoMode, isSchoolModeActive, pendingSession, demoDismissed]);

  // Check for active schedules
  const checkSchedules = useCallback(() => {
    if (demoMode) return; // Skip real schedule checks in demo mode
    
    if (isSchoolModeActive) {
      // Already active, clear pending session
      setPendingSession(null);
      lastNotifiedScheduleRef.current = null;
      if (reminderIntervalRef.current) {
        clearInterval(reminderIntervalRef.current);
        reminderIntervalRef.current = null;
      }
      return;
    }

    const schedules = getTeacherSchedules();
    const now = new Date();
    
    // Only check schedules if within school hours
    if (!isWithinSchoolHours(now)) {
      setPendingSession(null);
      lastNotifiedScheduleRef.current = null;
      return;
    }
    
    const activeSchedule = schedules.find(s => isWithinSchedule(s, now));

    if (activeSchedule) {
      const scheduleKey = `${activeSchedule.id}-${now.toDateString()}`;
      
      // Only notify if we haven't already notified for this schedule today
      if (lastNotifiedScheduleRef.current !== scheduleKey) {
        lastNotifiedScheduleRef.current = scheduleKey;
        
        const session: PendingSession = {
          id: activeSchedule.id,
          dayOfWeek: activeSchedule.dayOfWeek,
          startTime: activeSchedule.startTime,
          endTime: activeSchedule.endTime,
          triggeredAt: now,
        };
        
        setPendingSession(session);
        
        // Send initial push notification (only during school hours)
        sendPushNotification(
          '📚 Study Mode is ready!',
          'Tap here to start your study session.'
        );
      }
    } else {
      // No active schedule
      setPendingSession(null);
      lastNotifiedScheduleRef.current = null;
    }
  }, [isSchoolModeActive, demoMode]);

  // Set up reminder interval when there's a pending session
  useEffect(() => {
    if (pendingSession && !isSchoolModeActive && !demoMode) {
      // Clear any existing interval
      if (reminderIntervalRef.current) {
        clearInterval(reminderIntervalRef.current);
      }

      // Set up 5-minute reminder
      reminderIntervalRef.current = setInterval(() => {
        const schedules = getTeacherSchedules();
        const now = new Date();
        const stillActive = schedules.some(s => 
          s.id === pendingSession.id && isWithinSchedule(s, now)
        );

        if (stillActive && !isSchoolModeActive) {
          sendPushNotification(
            '⏰ Reminder: Study Mode waiting',
            'Your scheduled study session is still waiting to be activated.'
          );
        } else if (!stillActive && !isSchoolModeActive) {
          // Schedule ended without activation - notify parent about missed session
          if (onMissedSession) {
            onMissedSession(
              'Your child',
              'Did not activate Study Mode during a scheduled session.'
            );
          }
          setPendingSession(null);
          if (reminderIntervalRef.current) {
            clearInterval(reminderIntervalRef.current);
            reminderIntervalRef.current = null;
          }
        } else {
          // Mode was activated
          setPendingSession(null);
          if (reminderIntervalRef.current) {
            clearInterval(reminderIntervalRef.current);
            reminderIntervalRef.current = null;
          }
        }
      }, REMINDER_INTERVAL_MS);

      return () => {
        if (reminderIntervalRef.current) {
          clearInterval(reminderIntervalRef.current);
          reminderIntervalRef.current = null;
        }
      };
    }
  }, [pendingSession, isSchoolModeActive, demoMode]);

  // Check schedules every minute
  useEffect(() => {
    if (demoMode) return;
    
    checkSchedules(); // Initial check
    
    const interval = setInterval(checkSchedules, 60 * 1000);
    return () => clearInterval(interval);
  }, [checkSchedules, demoMode]);

  const dismissPendingSession = useCallback(() => {
    setPendingSession(null);
    if (demoMode) {
      setDemoDismissed(true);
    }
  }, [demoMode]);

  const activateFromNotification = useCallback(() => {
    onActivate();
    setPendingSession(null);
    lastNotifiedScheduleRef.current = null;
    if (reminderIntervalRef.current) {
      clearInterval(reminderIntervalRef.current);
      reminderIntervalRef.current = null;
    }
  }, [onActivate]);

  return {
    pendingSession,
    hasNotificationPermission,
    dismissPendingSession,
    activateFromNotification,
    requestPermission: requestNotificationPermission,
  };
};
