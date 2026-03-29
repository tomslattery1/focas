import { useState, useEffect, useMemo } from 'react';

interface Period {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  order: number;
}

interface DaySchedule {
  dayOfWeek: number;
  dayName: string;
  shortName: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface SchoolModeTimerResult {
  timeRemaining: number | null; // seconds until school mode ends
  isBreakTime: boolean;
  currentPeriod: Period | null;
  nextPeriod: Period | null;
  schoolEndTime: string | null;
  formattedTimeRemaining: string;
  isOutsideSchoolHours: boolean;
}

const defaultSchedule: DaySchedule[] = [
  { dayOfWeek: 1, dayName: 'Monday', shortName: 'Mon', startTime: '08:50', endTime: '14:30', isActive: true },
  { dayOfWeek: 2, dayName: 'Tuesday', shortName: 'Tue', startTime: '08:50', endTime: '14:30', isActive: true },
  { dayOfWeek: 3, dayName: 'Wednesday', shortName: 'Wed', startTime: '08:50', endTime: '14:30', isActive: true },
  { dayOfWeek: 4, dayName: 'Thursday', shortName: 'Thu', startTime: '08:50', endTime: '14:30', isActive: true },
  { dayOfWeek: 5, dayName: 'Friday', shortName: 'Fri', startTime: '08:50', endTime: '12:30', isActive: true },
];

const defaultPeriods: Period[] = [
  { id: 'p1', name: 'Period 1', startTime: '08:50', endTime: '09:40', order: 1 },
  { id: 'p2', name: 'Period 2', startTime: '09:45', endTime: '10:35', order: 2 },
  { id: 'break1', name: 'Break', startTime: '10:35', endTime: '10:55', order: 3 },
  { id: 'p3', name: 'Period 3', startTime: '10:55', endTime: '11:45', order: 4 },
  { id: 'p4', name: 'Period 4', startTime: '11:50', endTime: '12:40', order: 5 },
  { id: 'lunch', name: 'Lunch', startTime: '12:40', endTime: '13:20', order: 6 },
  { id: 'p5', name: 'Period 5', startTime: '13:20', endTime: '14:10', order: 7 },
  { id: 'p6', name: 'Period 6', startTime: '14:15', endTime: '15:05', order: 8 },
];

const isBreakPeriod = (period: Period): boolean => {
  const name = period.name.toLowerCase();
  return name.includes('break') || name.includes('lunch');
};

const parseTime = (timeStr: string): { hours: number; minutes: number } => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
};

const getTimeInMinutes = (timeStr: string): number => {
  const { hours, minutes } = parseTime(timeStr);
  return hours * 60 + minutes;
};

const getCurrentTimeInMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const useSchoolModeTimer = (isActive: boolean): SchoolModeTimerResult => {
  const [now, setNow] = useState(new Date());

  // Load schedules and periods from localStorage
  const schedules = useMemo<DaySchedule[]>(() => {
    const saved = localStorage.getItem('focas_admin_schedule');
    return saved ? JSON.parse(saved) : defaultSchedule;
  }, []);

  const periods = useMemo<Period[]>(() => {
    const saved = localStorage.getItem('focas_periods');
    return saved ? JSON.parse(saved) : defaultPeriods;
  }, []);

  // Update time every second when active
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const result = useMemo<SchoolModeTimerResult>(() => {
    if (!isActive) {
      return {
        timeRemaining: null,
        isBreakTime: false,
        currentPeriod: null,
        nextPeriod: null,
        schoolEndTime: null,
        formattedTimeRemaining: '',
        isOutsideSchoolHours: true,
      };
    }

    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const todaySchedule = schedules.find(s => s.dayOfWeek === dayOfWeek && s.isActive);
    
    // Check if we're outside school hours (no school day or outside school start/end times)
    const currentMinutes = getCurrentTimeInMinutes();
    
    if (!todaySchedule) {
      return {
        timeRemaining: null,
        isBreakTime: false,
        currentPeriod: null,
        nextPeriod: null,
        schoolEndTime: null,
        formattedTimeRemaining: 'No school today',
        isOutsideSchoolHours: true,
      };
    }
    
    const startMinutes = getTimeInMinutes(todaySchedule.startTime);
    const endMinutes = getTimeInMinutes(todaySchedule.endTime);
    
    // Check if outside school hours (before school starts or after school ends)
    const isOutsideSchoolHours = currentMinutes < startMinutes || currentMinutes >= endMinutes;
    
    // Calculate time remaining until school ends
    const remainingMinutes = endMinutes - currentMinutes;
    const timeRemaining = Math.max(0, remainingMinutes * 60);

    // Find current period
    let currentPeriod: Period | null = null;
    let nextPeriod: Period | null = null;

    const sortedPeriods = [...periods].sort((a, b) => 
      getTimeInMinutes(a.startTime) - getTimeInMinutes(b.startTime)
    );

    for (let i = 0; i < sortedPeriods.length; i++) {
      const period = sortedPeriods[i];
      const periodStart = getTimeInMinutes(period.startTime);
      const periodEnd = getTimeInMinutes(period.endTime);

      if (currentMinutes >= periodStart && currentMinutes < periodEnd) {
        currentPeriod = period;
        nextPeriod = sortedPeriods[i + 1] || null;
        break;
      }

      if (currentMinutes < periodStart) {
        nextPeriod = period;
        break;
      }
    }

    const isBreakTime = currentPeriod ? isBreakPeriod(currentPeriod) : false;

    // Format time remaining
    let formattedTimeRemaining = '';
    if (timeRemaining > 0) {
      const hours = Math.floor(timeRemaining / 3600);
      const minutes = Math.floor((timeRemaining % 3600) / 60);
      const seconds = timeRemaining % 60;

      if (hours > 0) {
        formattedTimeRemaining = `${hours}h ${minutes}m`;
      } else if (minutes > 0) {
        formattedTimeRemaining = `${minutes}m ${seconds}s`;
      } else {
        formattedTimeRemaining = `${seconds}s`;
      }
    } else {
      formattedTimeRemaining = 'School ended';
    }

    return {
      timeRemaining,
      isBreakTime,
      currentPeriod,
      nextPeriod,
      schoolEndTime: todaySchedule.endTime,
      formattedTimeRemaining,
      isOutsideSchoolHours,
    };
  }, [isActive, now, schedules, periods]);

  return result;
};
