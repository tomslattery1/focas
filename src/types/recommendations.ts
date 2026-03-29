// Types for the Apple-compliant app blocking recommendation flow

export type AppCategory = 
  | 'social_media'
  | 'games'
  | 'entertainment'
  | 'shopping'
  | 'messaging';

export type AttestationStatus = 'pending' | 'applied' | 'partial' | 'skipped';

export interface FocusRecommendation {
  id: string;
  teacherId: string;
  teacherName: string;
  className: string;
  categories: AppCategory[];
  customMessage?: string;
  createdAt: Date;
}

export interface StudentResponse {
  recommendationId: string;
  studentId: string;
  studentName: string;
  status: AttestationStatus;
  respondedAt: Date;
}

export const APP_CATEGORY_LABELS: Record<AppCategory, string> = {
  social_media: 'Social Media',
  games: 'Games',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  messaging: 'Messaging',
};

export const APP_CATEGORY_ICONS: Record<AppCategory, string> = {
  social_media: '📱',
  games: '🎮',
  entertainment: '🎬',
  shopping: '🛒',
  messaging: '💬',
};
