export interface Badge {
  id: string;
  nameIrish: string;
  nameEnglish: string;
  description: string;
  icon: string; // emoji
  unlockedAt: string | null; // ISO date or null
  requirement: BadgeRequirement;
}

export interface BadgeRequirement {
  type: 'sessions' | 'days' | 'streak' | 'score';
  value: number;
}

export interface WeeklyGoal {
  targetPercentage: number;
  weekStart: string; // ISO date
}

export interface GamificationState {
  focusScore: number; // 0–100 current percentage
  currentStreak: number; // consecutive days
  longestStreak: number;
  totalSessions: number;
  totalFocusDays: number;
  weeklyGoal: WeeklyGoal;
  badges: Badge[];
  lastSessionDate: string | null;
}

export const DEFAULT_BADGES: Badge[] = [
  {
    id: 'first-session',
    nameIrish: 'Tús Maith',
    nameEnglish: 'Great Start',
    description: 'Completed your very first Fócas session — well done!',
    icon: '🌱',
    unlockedAt: null,
    requirement: { type: 'sessions', value: 1 },
  },
  {
    id: 'five-sessions',
    nameIrish: 'Ag Dul ar Aghaidh',
    nameEnglish: 'Moving Forward',
    description: 'Five sessions down — you\'re building a great habit.',
    icon: '🌿',
    unlockedAt: null,
    requirement: { type: 'sessions', value: 5 },
  },
  {
    id: 'first-full-day',
    nameIrish: 'Lá Iontach',
    nameEnglish: 'Wonderful Day',
    description: 'A full day of focus — that takes real dedication.',
    icon: '☀️',
    unlockedAt: null,
    requirement: { type: 'days', value: 1 },
  },
  {
    id: 'three-day-streak',
    nameIrish: 'Sraith Tri Lá',
    nameEnglish: 'Three-Day Run',
    description: 'Three days in a row — you\'re on a roll!',
    icon: '🔥',
    unlockedAt: null,
    requirement: { type: 'streak', value: 3 },
  },
  {
    id: 'first-full-week',
    nameIrish: 'Seachtain Iontach',
    nameEnglish: 'Amazing Week',
    description: 'A full week of focus — your future self will thank you.',
    icon: '⭐',
    unlockedAt: null,
    requirement: { type: 'streak', value: 5 },
  },
  {
    id: 'ten-day-streak',
    nameIrish: 'Déanamh Maith',
    nameEnglish: 'Well Done',
    description: 'Ten days strong — that\'s real commitment.',
    icon: '🏅',
    unlockedAt: null,
    requirement: { type: 'streak', value: 10 },
  },
  {
    id: 'thirty-day-streak',
    nameIrish: 'Gaiscíoch',
    nameEnglish: 'Champion',
    description: '30 days of focus — you\'re truly a champion of your own learning.',
    icon: '🏆',
    unlockedAt: null,
    requirement: { type: 'streak', value: 30 },
  },
  {
    id: 'high-score',
    nameIrish: 'Scór Ard',
    nameEnglish: 'High Score',
    description: 'Reached 95% focus score — incredible effort!',
    icon: '💎',
    unlockedAt: null,
    requirement: { type: 'score', value: 95 },
  },
];
