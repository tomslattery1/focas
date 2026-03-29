import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  FocusRecommendation, 
  StudentResponse, 
  AppCategory, 
  AttestationStatus 
} from '@/types/recommendations';

interface RecommendationContextType {
  // Teacher: create recommendations
  recommendations: FocusRecommendation[];
  createRecommendation: (categories: AppCategory[], className: string, customMessage?: string) => void;
  
  // Student: pending recommendation & response
  pendingRecommendation: FocusRecommendation | null;
  setPendingRecommendation: (rec: FocusRecommendation | null) => void;
  submitAttestation: (status: AttestationStatus) => void;
  
  // Teacher: view student responses
  studentResponses: StudentResponse[];
}

const RecommendationContext = createContext<RecommendationContextType | undefined>(undefined);

export const RecommendationProvider = ({ children }: { children: ReactNode }) => {
  const [recommendations, setRecommendations] = useState<FocusRecommendation[]>([]);
  const [pendingRecommendation, setPendingRecommendation] = useState<FocusRecommendation | null>(null);
  const [studentResponses, setStudentResponses] = useState<StudentResponse[]>([]);

  const createRecommendation = (categories: AppCategory[], className: string, customMessage?: string) => {
    const newRec: FocusRecommendation = {
      id: Date.now().toString(),
      teacherId: 'teacher-1',
      teacherName: 'Mr. O\'Sullivan',
      className,
      categories,
      customMessage,
      createdAt: new Date(),
    };
    setRecommendations(prev => [newRec, ...prev]);
    
    // Simulate sending to students - set as pending for demo
    setPendingRecommendation(newRec);
  };

  const submitAttestation = (status: AttestationStatus) => {
    if (!pendingRecommendation) return;
    
    const response: StudentResponse = {
      recommendationId: pendingRecommendation.id,
      studentId: 'student-1',
      studentName: 'Aoife Murphy',
      status,
      respondedAt: new Date(),
    };
    
    setStudentResponses(prev => [response, ...prev]);
    setPendingRecommendation(null);
  };

  return (
    <RecommendationContext.Provider
      value={{
        recommendations,
        createRecommendation,
        pendingRecommendation,
        setPendingRecommendation,
        submitAttestation,
        studentResponses,
      }}
    >
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendations = () => {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error('useRecommendations must be used within RecommendationProvider');
  }
  return context;
};
