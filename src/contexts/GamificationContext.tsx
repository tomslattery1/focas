import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { GamificationState, Badge, DEFAULT_BADGES, WeeklyGoal } from '@/types/gamification';
import { toast } from 'sonner';

const STORAGE_KEY = 'focas_gamification';

const defaultGoal: WeeklyGoal = {
  targetPercentage: 80,
  weekStart: new Date().toISOString(),
};

const defaultState: GamificationState = {
  focusScore: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalSessions: 0,
  totalFocusDays: 0,
  weeklyGoal: defaultGoal,
  badges: DEFAULT_BADGES,
  lastSessionDate: null,
};

interface GamificationContextType {
  state: GamificationState;
  completeSession: (scorePercent: number) => void;
  updateFocusScore: (score: number) => void;
  setWeeklyGoal: (target: number) => void;
  resetGamification: () => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

function loadState(): GamificationState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with defaults to pick up new badges
      const mergedBadges = DEFAULT_BADGES.map(db => {
        const existing = parsed.badges?.find((b: Badge) => b.id === db.id);
        return existing ? { ...db, unlockedAt: existing.unlockedAt } : db;
      });
      return { ...defaultState, ...parsed, badges: mergedBadges };
    }
  } catch {}
  return defaultState;
}

function persist(state: GamificationState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<GamificationState>(loadState);

  useEffect(() => {
    persist(state);
  }, [state]);

  const checkBadges = useCallback((updated: GamificationState): GamificationState => {
    const now = new Date().toISOString();
    let newUnlocks = false;
    const badges = updated.badges.map(badge => {
      if (badge.unlockedAt) return badge;
      let earned = false;
      switch (badge.requirement.type) {
        case 'sessions':
          earned = updated.totalSessions >= badge.requirement.value;
          break;
        case 'days':
          earned = updated.totalFocusDays >= badge.requirement.value;
          break;
        case 'streak':
          earned = updated.currentStreak >= badge.requirement.value;
          break;
        case 'score':
          earned = updated.focusScore >= badge.requirement.value;
          break;
      }
      if (earned) {
        newUnlocks = true;
        setTimeout(() => {
          toast.success(`${badge.icon} ${badge.nameIrish}!`, {
            description: badge.description,
          });
        }, 500);
        return { ...badge, unlockedAt: now };
      }
      return badge;
    });
    return { ...updated, badges };
  }, []);

  const completeSession = useCallback((scorePercent: number) => {
    setState(prev => {
      const today = new Date().toDateString();
      const lastDate = prev.lastSessionDate;
      const isNewDay = lastDate !== today;
      
      let streak = prev.currentStreak;
      if (isNewDay) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastDate === yesterday.toDateString()) {
          streak += 1;
        } else if (!lastDate) {
          streak = 1;
        } else {
          streak = 1; // streak broken
        }
      }

      const updated: GamificationState = {
        ...prev,
        focusScore: Math.round(scorePercent),
        totalSessions: prev.totalSessions + 1,
        totalFocusDays: isNewDay ? prev.totalFocusDays + 1 : prev.totalFocusDays,
        currentStreak: streak,
        longestStreak: Math.max(prev.longestStreak, streak),
        lastSessionDate: today,
      };
      return checkBadges(updated);
    });
  }, [checkBadges]);

  const updateFocusScore = useCallback((score: number) => {
    setState(prev => {
      const updated = { ...prev, focusScore: Math.round(score) };
      return checkBadges(updated);
    });
  }, [checkBadges]);

  const setWeeklyGoal = useCallback((target: number) => {
    setState(prev => ({
      ...prev,
      weeklyGoal: {
        targetPercentage: target,
        weekStart: new Date().toISOString(),
      },
    }));
    toast.success('Goal updated!', {
      description: `Your weekly focus target is now ${target}%.`,
    });
  }, []);

  const resetGamification = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  }, []);

  return (
    <GamificationContext.Provider value={{ state, completeSession, updateFocusScore, setWeeklyGoal, resetGamification }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error('useGamification must be used within GamificationProvider');
  return ctx;
};
