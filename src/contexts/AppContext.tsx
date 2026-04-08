import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { FocusStatus, ClassPeriod, Announcement, DailyStats, UserRole, OnboardingStep, AnnouncementRecipient, StudentConsent, AgeGroup } from '@/types/app';
import { loadDailyHistory } from '@/hooks/useSessionTimer';
import defaultSchoolLogo from '@/assets/school-logo.png';

export interface SchoolSettings {
  schoolName: string;
  schoolLogo: string;
  schoolStartTime: string;
  schoolEndTime: string;
  emergencyUnlockEnabled: boolean;
  parentNotificationsEnabled: boolean;
  teacherAppSuggestionsEnabled: boolean;
  schoolModeRemindersEnabled: boolean;
}

export interface EncouragementMessage {
  id: string;
  message: string;
  senderName: string;
  timestamp: Date;
}

export type ParentNotificationType = 'emergency_exit' | 'early_exit' | 'missed_session';

export interface ParentNotification {
  id: string;
  type: ParentNotificationType;
  childName: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export type AdminViewMode = 'mobile' | 'desktop';

interface AppContextType {
  // School settings
  schoolSettings: SchoolSettings;
  updateSchoolSettings: (settings: Partial<SchoolSettings>) => void;
  
  // Admin view mode
  adminViewMode: AdminViewMode;
  setAdminViewMode: (mode: AdminViewMode) => void;
  
  // Onboarding state
  onboardingStep: OnboardingStep;
  setOnboardingStep: (step: OnboardingStep) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  setAuthenticated: (auth: boolean) => void;
  
  // Status sharing opt-in (legacy - kept for compatibility)
  hasOptedInToShare: boolean;
  setHasOptedInToShare: (optedIn: boolean) => void;
  
  // Student consent (new comprehensive consent)
  studentConsent: StudentConsent;
  updateStudentConsent: (consent: Partial<StudentConsent>) => void;
  
  // Encouragement messages
  encouragementMessages: EncouragementMessage[];
  sendEncouragement: (message: string, senderName: string) => void;
  dismissEncouragement: (id: string) => void;
  
  // Parent notifications
  parentNotifications: ParentNotification[];
  notifyParent: (type: ParentNotificationType, childName: string, message: string) => void;
  dismissParentNotification: (id: string) => void;
  dismissAllParentNotifications: () => void;
  
  // App state
  isFocasModeActive: boolean;
  setFocasModeActive: (active: boolean) => void;
  focusStatus: FocusStatus;
  setFocusStatus: (status: FocusStatus) => void;
  todayStats: DailyStats;
  weekStats: DailyStats[];
  schedule: ClassPeriod[];
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'timestamp' | 'read'>) => void;
  currentClass: ClassPeriod | null;
  isEmergencyUnlocked: boolean;
  setEmergencyUnlocked: (unlocked: boolean) => void;
  
  // Reset
  resetOnboarding: () => void;
}

const defaultSchedule: ClassPeriod[] = [
  { id: '1', name: 'Mathematics', teacher: 'Mr. Johnson', room: 'Room 204', startTime: '08:30', endTime: '09:20', isCurrent: false },
  { id: '2', name: 'English', teacher: 'Ms. Williams', room: 'Room 112', startTime: '09:25', endTime: '10:15', isCurrent: true },
  { id: '3', name: 'Biology', teacher: 'Dr. Martinez', room: 'Lab 3', startTime: '10:30', endTime: '11:20', isCurrent: false },
  { id: '4', name: 'History', teacher: 'Mr. Thompson', room: 'Room 305', startTime: '11:25', endTime: '12:15', isCurrent: false },
  { id: '5', name: 'Lunch Break', teacher: '', room: 'Cafeteria', startTime: '12:15', endTime: '13:00', isCurrent: false },
  { id: '6', name: 'Physics', teacher: 'Ms. Chen', room: 'Lab 1', startTime: '13:05', endTime: '13:55', isCurrent: false },
  { id: '7', name: 'Art', teacher: 'Mr. Garcia', room: 'Art Studio', startTime: '14:00', endTime: '14:50', isCurrent: false },
];

const defaultAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Fire Drill Tomorrow',
    message: 'There will be a scheduled fire drill tomorrow at 10:00 AM. Please follow evacuation procedures.',
    timestamp: new Date(),
    priority: 'normal',
    read: false,
    recipients: 'both',
  },
  {
    id: '2',
    title: 'Sports Day Registration',
    message: 'Registration for Sports Day events is now open. Sign up at the PE office by Friday.',
    timestamp: new Date(Date.now() - 86400000),
    priority: 'normal',
    read: true,
    recipients: 'students',
  },
  {
    id: '3',
    title: 'Early Dismissal Friday',
    message: 'School will dismiss at 1:30 PM this Friday for staff development.',
    timestamp: new Date(Date.now() - 172800000),
    priority: 'urgent',
    read: false,
    recipients: 'both',
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultSchoolSettings: SchoolSettings = {
  schoolName: "St. Michael College",
  schoolLogo: defaultSchoolLogo,
  schoolStartTime: '08:50',
  schoolEndTime: '14:30',
  emergencyUnlockEnabled: true,
  parentNotificationsEnabled: true,
  teacherAppSuggestionsEnabled: true,
  schoolModeRemindersEnabled: true,
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // School settings
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem('focas_school_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...defaultSchoolSettings, ...parsed };
      } catch {
        return defaultSchoolSettings;
      }
    }
    return defaultSchoolSettings;
  });

  const updateSchoolSettings = (settings: Partial<SchoolSettings>) => {
    setSchoolSettings(prev => {
      const updated = { ...prev, ...settings };
      localStorage.setItem('focas_school_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // Admin view mode
  const [adminViewMode, setAdminViewMode] = useState<AdminViewMode>(() => {
    const saved = localStorage.getItem('focas_admin_view_mode');
    return (saved as AdminViewMode) || 'desktop';
  });

  useEffect(() => {
    localStorage.setItem('focas_admin_view_mode', adminViewMode);
  }, [adminViewMode]);

  // Check for saved state
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(() => {
    const saved = localStorage.getItem('focas_onboarding_step');
    return (saved as OnboardingStep) || 'splash';
  });
  
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('focas_user_role');
    return (saved as UserRole) || null;
  });
  
  const [isAuthenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem('focas_authenticated') === 'true';
  });

  const [hasOptedInToShare, setHasOptedInToShare] = useState(() => {
    return localStorage.getItem('focas_opted_in_share') === 'true';
  });

  const defaultStudentConsent: StudentConsent = {
    ageGroup: null,
    birthYear: null,
    shareStatusWithTeachers: false,
    shareStatusWithGuardians: false,
    allowEncouragementMessages: false,
    acceptTermsAndPrivacy: false,
    consentTimestamp: null,
  };

  const [studentConsent, setStudentConsent] = useState<StudentConsent>(() => {
    const saved = localStorage.getItem('focas_student_consent');
    if (saved) {
      try {
        return { ...defaultStudentConsent, ...JSON.parse(saved) };
      } catch {
        return defaultStudentConsent;
      }
    }
    return defaultStudentConsent;
  });

  const updateStudentConsent = (consent: Partial<StudentConsent>) => {
    setStudentConsent(prev => {
      const updated = { ...prev, ...consent };
      localStorage.setItem('focas_student_consent', JSON.stringify(updated));
      return updated;
    });
  };

  const [encouragementMessages, setEncouragementMessages] = useState<EncouragementMessage[]>([]);
  const [parentNotifications, setParentNotifications] = useState<ParentNotification[]>([]);

  const sendEncouragement = (message: string, senderName: string) => {
    const newMessage: EncouragementMessage = {
      id: Date.now().toString(),
      message,
      senderName,
      timestamp: new Date(),
    };
    setEncouragementMessages(prev => [newMessage, ...prev]);
  };

  const dismissEncouragement = (id: string) => {
    setEncouragementMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const notifyParent = (type: ParentNotificationType, childName: string, message: string) => {
    const newNotification: ParentNotification = {
      id: Date.now().toString(),
      type,
      childName,
      message,
      timestamp: new Date(),
      read: false,
    };
    setParentNotifications(prev => [newNotification, ...prev]);
  };

  const dismissParentNotification = (id: string) => {
    setParentNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const dismissAllParentNotifications = () => {
    setParentNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const [isFocasModeActive, setFocasModeActive] = useState(false);
  const [focusStatus, setFocusStatus] = useState<FocusStatus>('green');
  const [isEmergencyUnlocked, setEmergencyUnlocked] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>(defaultAnnouncements);

  const addAnnouncement = (announcement: Omit<Announcement, 'id' | 'timestamp' | 'read'>) => {
    const newAnnouncement: Announcement = {
      ...announcement,
      id: String(Date.now()),
      timestamp: new Date(),
      read: false,
    };
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  // Persist state changes
  useEffect(() => {
    localStorage.setItem('focas_onboarding_step', onboardingStep);
  }, [onboardingStep]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('focas_user_role', userRole);
    }
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('focas_authenticated', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('focas_opted_in_share', String(hasOptedInToShare));
  }, [hasOptedInToShare]);

  const resetOnboarding = () => {
    localStorage.removeItem('focas_onboarding_step');
    localStorage.removeItem('focas_user_role');
    localStorage.removeItem('focas_authenticated');
    localStorage.removeItem('focas_opted_in_share');
    localStorage.removeItem('focas_student_consent');
    setOnboardingStep('splash');
    setUserRole(null);
    setAuthenticated(false);
    setHasOptedInToShare(false);
    setStudentConsent(defaultStudentConsent);
  };

  // Get admin-configured school days for compliance calculation
  const getSchoolDays = (): number[] => {
    const saved = localStorage.getItem('focas_admin_schedule');
    if (saved) {
      try {
        const schedule = JSON.parse(saved);
        return schedule.filter((s: { isActive: boolean }) => s.isActive).map((s: { dayOfWeek: number }) => s.dayOfWeek);
      } catch {
        return [1, 2, 3, 4, 5]; // Default Mon-Fri
      }
    }
    return [1, 2, 3, 4, 5]; // Default Mon-Fri
  };

  const todayStats: DailyStats = {
    date: new Date(),
    totalMinutes: 285,
    compliantMinutes: 268,
  };

  // Build week stats from localStorage daily history
  const schoolDays = getSchoolDays();
  const weekStats: DailyStats[] = useMemo(() => {
    const history = loadDailyHistory();
    const stats: DailyStats[] = [];
    const today = new Date();
    const schoolMinutesPerDay = (() => {
      const [sh, sm] = schoolSettings.schoolStartTime.split(':').map(Number);
      const [eh, em] = schoolSettings.schoolEndTime.split(':').map(Number);
      return (eh * 60 + em) - (sh * 60 + sm);
    })();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today.getTime() - i * 86400000);
      const dayOfWeek = date.getDay();
      if (!schoolDays.includes(dayOfWeek)) continue;

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const compliantMinutes = history[key] || 0;

      stats.push({
        date,
        totalMinutes: schoolMinutesPerDay,
        compliantMinutes,
      });
    }
    return stats;
  }, [schoolSettings.schoolStartTime, schoolSettings.schoolEndTime, schoolDays]);

  const currentClass = defaultSchedule.find(c => c.isCurrent) || null;

  return (
    <AppContext.Provider
      value={{
        schoolSettings,
        updateSchoolSettings,
        adminViewMode,
        setAdminViewMode,
        onboardingStep,
        setOnboardingStep,
        userRole,
        setUserRole,
        isAuthenticated,
        setAuthenticated,
        hasOptedInToShare,
        setHasOptedInToShare,
        studentConsent,
        updateStudentConsent,
        encouragementMessages,
        sendEncouragement,
        dismissEncouragement,
        parentNotifications,
        notifyParent,
        dismissParentNotification,
        dismissAllParentNotifications,
        isFocasModeActive,
        setFocasModeActive,
        focusStatus,
        setFocusStatus,
        todayStats,
        weekStats,
        schedule: defaultSchedule,
        announcements,
        addAnnouncement,
        currentClass,
        isEmergencyUnlocked,
        setEmergencyUnlocked,
        resetOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
