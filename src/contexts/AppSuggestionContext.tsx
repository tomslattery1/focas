import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  AppBlockingSuggestion, 
  StudentAppSuggestionResponse,
  AppSuggestionStats 
} from '@/types/app-suggestions';

interface AppSuggestionContextType {
  suggestions: AppBlockingSuggestion[];
  createSuggestion: (suggestion: Omit<AppBlockingSuggestion, 'id' | 'createdAt'>) => void;
  deleteSuggestion: (id: string) => void;
  pendingSuggestions: AppBlockingSuggestion[];
  respondToSuggestion: (suggestionId: string, status: 'accepted' | 'rejected') => void;
  studentResponses: StudentAppSuggestionResponse[];
  getStatsForSuggestion: (suggestionId: string) => AppSuggestionStats;
}

const AppSuggestionContext = createContext<AppSuggestionContextType | undefined>(undefined);

export const AppSuggestionProvider = ({ children }: { children: ReactNode }) => {
  const [suggestions, setSuggestions] = useState<AppBlockingSuggestion[]>([]);
  const [studentResponses, setStudentResponses] = useState<StudentAppSuggestionResponse[]>([]);

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
      total: responses.length,
      accepted: responses.filter(r => r.status === 'accepted').length,
      rejected: responses.filter(r => r.status === 'rejected').length,
      pending: 0,
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
