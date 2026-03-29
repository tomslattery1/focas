// Types for teacher/admin app limit suggestions to students

export interface AppBlockingSuggestion {
  id: string;
  appName: string;
  appIcon?: string;
  reason: string;
  suggestedBy: string;
  suggestedByRole: 'teacher' | 'admin';
  targetYearGroups: string[];
  createdAt: Date;
  expiresAt?: Date;
}

export interface StudentAppSuggestionResponse {
  suggestionId: string;
  studentId: string;
  studentName: string;
  status: 'accepted' | 'rejected' | 'pending';
  respondedAt?: Date;
}

export interface AppSuggestionStats {
  total: number;
  accepted: number;
  rejected: number;
  pending: number;
}

// Common apps that teachers might suggest limiting
export const COMMON_DISTRACTING_APPS = [
  { name: 'TikTok', icon: '📱', category: 'social_media' },
  { name: 'Instagram', icon: '📸', category: 'social_media' },
  { name: 'Snapchat', icon: '👻', category: 'social_media' },
  { name: 'YouTube', icon: '▶️', category: 'entertainment' },
  { name: 'Netflix', icon: '🎬', category: 'entertainment' },
  { name: 'Roblox', icon: '🎮', category: 'games' },
  { name: 'Fortnite', icon: '🎯', category: 'games' },
  { name: 'Minecraft', icon: '⛏️', category: 'games' },
  { name: 'Discord', icon: '💬', category: 'messaging' },
  { name: 'WhatsApp', icon: '💬', category: 'messaging' },
  { name: 'BeReal', icon: '📷', category: 'social_media' },
  { name: 'Twitch', icon: '🎥', category: 'entertainment' },
] as const;

export const YEAR_GROUPS = [
  { id: '1', name: '1st Year', students: 120 },
  { id: '2', name: '2nd Year', students: 115 },
  { id: '3', name: '3rd Year', students: 118 },
  { id: '4', name: '4th Year', students: 95 },
  { id: '5', name: '5th Year', students: 108 },
  { id: '6', name: '6th Year', students: 102 },
] as const;
