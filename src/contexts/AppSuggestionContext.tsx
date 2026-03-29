import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  AppBlockingSuggestion, 
  StudentAppSuggestionResponse,
  AppSuggestionStats 
} from '@/types/app-suggestions';

interface AppSuggestionContextType {
  // Teacher/Admin: create and manage suggestions
  suggestions: AppBlockingSuggestion[];
  createSuggestion: (suggestion: Omit<AppBlockingSuggestion, 'id' | 'createdAt'>) => void;
  deleteSuggestion: (id: string) => void;
  
  // Student: pending suggestions
  pendingSuggestions: AppBlockingSuggestion[];
  respondToSuggestion: (suggestionId: string, status: 'accepted' | 'rejected') => void;
  
  // Teacher/Admin: view responses
  studentResponses: StudentAppSuggestionResponse[];
  getStatsForSuggestion: (suggestionId: string) => AppSuggestionStats;
}

const AppSuggestionContext = createContext<AppSuggestionContextType | undefined>(undefined);

// Mock initial suggestions for demo
const initialSuggestions: AppBlockingSuggestion[] = [
  {
    id: '1',
    appName: 'TikTok',
    appIcon: '📱',
    reason: 'Highly distracting during study periods',
    suggestedBy: 'Tom Slattery',
    suggestedByRole: 'teacher',
    targetYearGroups: ['1', '2', '3'],
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: '2',
    appName: 'Roblox',
    appIcon: '🎮',
    reason: 'Gaming app - consider limiting during school hours',
    suggestedBy: 'School Admin',
    suggestedByRole: 'admin',
    targetYearGroups: ['1', '2', '3', '4', '5', '6'],
    createdAt: new Date(Date.now() - 172800000),
  },
];

export const AppSuggestionProvider = ({ children }: { children: ReactNode }) => {
  const [suggestions, setSuggestions] = useState<AppBlockingSuggestion[]>(initialSuggestions);
  const [studentResponses, setStudentResponses] = useState<StudentAppSuggestionResponse[]>([
    // Mock responses
    { suggestionId: '1', studentId: 's1', studentName: 'Aoife Murphy', status: 'accepted', respondedAt: new Date() },
    { suggestionId: '1', studentId: 's2', studentName: 'Ciarán O\'Brien', status: 'accepted', respondedAt: new Date() },
    { suggestionId: '1', studentId: 's3', studentName: 'Saoirse Kelly', status: 'rejected', respondedAt: new Date() },
    { suggestionId: '2', studentId: 's1', studentName: 'Aoife Murphy', status: 'accepted', respondedAt: new Date() },
  ]);

  const createSuggestion = (suggestion: Omit<AppBlockingSuggestion, 'id' | 'createdAt'>) => {
    const newSuggestion: AppBlockingSuggestion = {
      ...suggestion,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setSuggestions(prev => [newSuggestion, ...prev]);
  };

  const deleteSuggestion = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  // For demo, show all suggestions as pending for students
  const pendingSuggestions = suggestions;

  const respondToSuggestion = (suggestionId: string, status: 'accepted' | 'rejected') => {
    const response: StudentAppSuggestionResponse = {
      suggestionId,
      studentId: 'student-1',
      studentName: 'Current Student',
      status,
      respondedAt: new Date(),
    };
    setStudentResponses(prev => [response, ...prev.filter(r => r.suggestionId !== suggestionId || r.studentId !== 'student-1')]);
  };

  const getStatsForSuggestion = (suggestionId: string): AppSuggestionStats => {
    const responses = studentResponses.filter(r => r.suggestionId === suggestionId);
    return {
      total: responses.length + 5, // Mock: assume some haven't responded
      accepted: responses.filter(r => r.status === 'accepted').length,
      rejected: responses.filter(r => r.status === 'rejected').length,
      pending: 5, // Mock pending count
    };
  };

  return (
    <AppSuggestionContext.Provider
      value={{
        suggestions,
        createSuggestion,
        deleteSuggestion,
        pendingSuggestions,
        respondToSuggestion,
        studentResponses,
        getStatsForSuggestion,
      }}
    >
      {children}
    </AppSuggestionContext.Provider>
  );
};

export const useAppSuggestions = () => {
  const context = useContext(AppSuggestionContext);
  if (!context) {
    throw new Error('useAppSuggestions must be used within AppSuggestionProvider');
  }
  return context;
};
