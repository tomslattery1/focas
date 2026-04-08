import { useState, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'focas_session_data';

interface SessionData {
  /** ISO date string (YYYY-MM-DD) for the day these stats belong to */
  date: string;
  /** Accumulated compliant (focus) minutes from completed sessions today */
  completedMinutes: number;
  /** ISO timestamp when the current session started, or null if no active session */
  sessionStartedAt: string | null;
}

interface SessionTimerResult {
  /** Total compliant minutes today including any in-progress session */
  todayCompliantMinutes: number;
  /** Elapsed minutes in the current active session (0 if none) */
  currentSessionMinutes: number;
  /** Start a new session */
  startSession: () => void;
  /** Stop the current session, returning elapsed minutes */
  stopSession: () => number;
  /** Whether a session is currently running */
  isSessionActive: boolean;
}

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadSessionData(): SessionData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: SessionData = JSON.parse(saved);
      // Reset if it's a new day
      if (parsed.date === getTodayKey()) {
        return parsed;
      }
    }
  } catch {}
  return { date: getTodayKey(), completedMinutes: 0, sessionStartedAt: null };
}

function persistSessionData(data: SessionData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useSessionTimer(): SessionTimerResult {
  const [sessionData, setSessionData] = useState<SessionData>(loadSessionData);
  const [elapsedMs, setElapsedMs] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // On mount, if there's an active session (e.g. page was refreshed), resume the timer
  useEffect(() => {
    const data = loadSessionData();
    setSessionData(data);
    if (data.sessionStartedAt) {
      const startMs = new Date(data.sessionStartedAt).getTime();
      setElapsedMs(Math.max(0, Date.now() - startMs));
    }
  }, []);

  // Tick every second while session is active
  useEffect(() => {
    if (sessionData.sessionStartedAt) {
      const startMs = new Date(sessionData.sessionStartedAt).getTime();
      intervalRef.current = setInterval(() => {
        setElapsedMs(Math.max(0, Date.now() - startMs));
      }, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      setElapsedMs(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [sessionData.sessionStartedAt]);

  const startSession = useCallback(() => {
    const now = new Date().toISOString();
    const todayKey = getTodayKey();
    setSessionData(prev => {
      // Reset if new day
      const updated: SessionData = prev.date === todayKey
        ? { ...prev, sessionStartedAt: now }
        : { date: todayKey, completedMinutes: 0, sessionStartedAt: now };
      persistSessionData(updated);
      return updated;
    });
  }, []);

  const stopSession = useCallback((): number => {
    if (!sessionData.sessionStartedAt) return 0;
    const startMs = new Date(sessionData.sessionStartedAt).getTime();
    const elapsedMinutes = Math.round((Date.now() - startMs) / 60000);
    setSessionData(prev => {
      const updated: SessionData = {
        ...prev,
        completedMinutes: prev.completedMinutes + elapsedMinutes,
        sessionStartedAt: null,
      };
      persistSessionData(updated);
      return updated;
    });
    return elapsedMinutes;
  }, [sessionData.sessionStartedAt]);

  const currentSessionMinutes = Math.floor(elapsedMs / 60000);
  const todayCompliantMinutes = sessionData.completedMinutes + currentSessionMinutes;

  return {
    todayCompliantMinutes,
    currentSessionMinutes,
    startSession,
    stopSession,
    isSessionActive: !!sessionData.sessionStartedAt,
  };
}
