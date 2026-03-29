import { useState, useEffect, useRef } from 'react';
import { isWithinSchoolHours } from './useScheduleNotifications';

const SCHOOL_END_DISMISSED_KEY = 'focas_school_end_dismissed';

export const useSchoolEndNotification = () => {
  const [showSchoolEndNotification, setShowSchoolEndNotification] = useState(false);
  const wasWithinSchoolHoursRef = useRef<boolean | null>(null);
  const lastDismissedDateRef = useRef<string | null>(null);

  useEffect(() => {
    // Load dismissed state from localStorage
    const dismissedData = localStorage.getItem(SCHOOL_END_DISMISSED_KEY);
    if (dismissedData) {
      try {
        const { date } = JSON.parse(dismissedData);
        lastDismissedDateRef.current = date;
      } catch {
        // Ignore parse errors
      }
    }

    const checkSchoolEnd = () => {
      const now = new Date();
      const today = now.toDateString();
      const currentlyWithinSchoolHours = isWithinSchoolHours(now);

      // If we've already dismissed today, don't show again
      if (lastDismissedDateRef.current === today) {
        setShowSchoolEndNotification(false);
        return;
      }

      // Check if we just transitioned from within school hours to outside
      if (wasWithinSchoolHoursRef.current === true && !currentlyWithinSchoolHours) {
        // School just ended! Show the notification
        setShowSchoolEndNotification(true);
      }

      wasWithinSchoolHoursRef.current = currentlyWithinSchoolHours;
    };

    // Initial check
    const now = new Date();
    wasWithinSchoolHoursRef.current = isWithinSchoolHours(now);
    
    // Check every minute
    const interval = setInterval(checkSchoolEnd, 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const dismissSchoolEndNotification = () => {
    setShowSchoolEndNotification(false);
    const today = new Date().toDateString();
    lastDismissedDateRef.current = today;
    localStorage.setItem(SCHOOL_END_DISMISSED_KEY, JSON.stringify({ date: today }));
  };

  return {
    showSchoolEndNotification,
    dismissSchoolEndNotification,
  };
};
