export type FocusStatus = 'green' | 'amber' | 'red';

// Legacy alias for backwards compatibility
export type ComplianceStatus = FocusStatus;

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin' | null;

export type OnboardingStep = 'splash' | 'role' | 'age-verification' | 'parental-consent' | 'data-consent' | 'screentime' | 'guardian-invite' | 'onboarding' | 'login' | 'info' | 'complete';

export type AgeGroup = 'under13' | '13to17' | '18plus' | null;

export interface StudentConsent {
  ageGroup: AgeGroup;
  birthYear: number | null;
  shareStatusWithTeachers: boolean;
  shareStatusWithGuardians: boolean;
  allowEncouragementMessages: boolean;
  acceptTermsAndPrivacy: boolean;
  consentTimestamp: string | null;
}

export interface ClassPeriod {
  id: string;
  name: string;
  teacher: string;
  room: string;
  startTime: string;
  endTime: string;
  isCurrent?: boolean;
}

export type AnnouncementRecipient = 'students' | 'guardians' | 'both';

export interface Announcement {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  priority: 'normal' | 'urgent';
  read: boolean;
  recipients: AnnouncementRecipient;
}

export interface DailyStats {
  date: Date;
  totalMinutes: number;
  compliantMinutes: number;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  status: FocusStatus;
  lastActive: Date;
  focasModeActive: boolean;
  hasOptedIn: boolean;
}

export interface ScheduleConfig {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface TeacherClass {
  id: string;
  name: string;
  yearGroup: string; // e.g., "1A", "2B"
  subject: string;
  room: string;
  startTime: string;
  endTime: string;
  isCurrent?: boolean;
}
