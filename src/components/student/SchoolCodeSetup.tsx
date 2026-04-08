import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { CheckCircle, School, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface SchoolDayTemplate {
  schoolName: string;
  startTime: string;
  endTime: string;
  slots: ScheduleSlot[];
}

export interface ScheduleSlot {
  id: string;
  startTime: string;
  endTime: string;
  type: 'class' | 'break' | 'lunch';
  label: string; // e.g. "Period 1", "Morning Break", "Lunch"
  subject: string; // student-entered
  teacher: string;
  room: string;
}

const SCHOOL_TEMPLATES: Record<string, SchoolDayTemplate> = {
  '1234': {
    schoolName: 'Demo School',
    startTime: '08:50',
    endTime: '15:40',
    slots: [
      { id: '1', startTime: '08:50', endTime: '09:30', type: 'class', label: 'Period 1', subject: '', teacher: '', room: '' },
      { id: '2', startTime: '09:30', endTime: '10:10', type: 'class', label: 'Period 2', subject: '', teacher: '', room: '' },
      { id: '3', startTime: '10:10', endTime: '10:50', type: 'class', label: 'Period 3', subject: '', teacher: '', room: '' },
      { id: '4', startTime: '10:50', endTime: '11:05', type: 'break', label: 'Morning Break', subject: '', teacher: '', room: '' },
      { id: '5', startTime: '11:05', endTime: '11:45', type: 'class', label: 'Period 4', subject: '', teacher: '', room: '' },
      { id: '6', startTime: '11:45', endTime: '12:25', type: 'class', label: 'Period 5', subject: '', teacher: '', room: '' },
      { id: '7', startTime: '12:25', endTime: '13:10', type: 'lunch', label: 'Lunch', subject: '', teacher: '', room: '' },
      { id: '8', startTime: '13:10', endTime: '13:50', type: 'class', label: 'Period 6', subject: '', teacher: '', room: '' },
      { id: '9', startTime: '13:50', endTime: '14:30', type: 'class', label: 'Period 7', subject: '', teacher: '', room: '' },
      { id: '10', startTime: '14:30', endTime: '15:10', type: 'class', label: 'Period 8', subject: '', teacher: '', room: '' },
      { id: '11', startTime: '15:10', endTime: '15:40', type: 'class', label: 'Period 9', subject: '', teacher: '', room: '' },
    ],
  },
  '5678': {
    schoolName: 'Coláiste Mhuire',
    startTime: '09:00',
    endTime: '16:00',
    slots: [
      { id: '1', startTime: '09:00', endTime: '09:40', type: 'class', label: 'Period 1', subject: '', teacher: '', room: '' },
      { id: '2', startTime: '09:40', endTime: '10:20', type: 'class', label: 'Period 2', subject: '', teacher: '', room: '' },
      { id: '3', startTime: '10:20', endTime: '10:35', type: 'break', label: 'Break', subject: '', teacher: '', room: '' },
      { id: '4', startTime: '10:35', endTime: '11:15', type: 'class', label: 'Period 3', subject: '', teacher: '', room: '' },
      { id: '5', startTime: '11:15', endTime: '11:55', type: 'class', label: 'Period 4', subject: '', teacher: '', room: '' },
      { id: '6', startTime: '11:55', endTime: '12:35', type: 'class', label: 'Period 5', subject: '', teacher: '', room: '' },
      { id: '7', startTime: '12:35', endTime: '13:20', type: 'lunch', label: 'Lunch', subject: '', teacher: '', room: '' },
      { id: '8', startTime: '13:20', endTime: '14:00', type: 'class', label: 'Period 6', subject: '', teacher: '', room: '' },
      { id: '9', startTime: '14:00', endTime: '14:40', type: 'class', label: 'Period 7', subject: '', teacher: '', room: '' },
      { id: '10', startTime: '14:40', endTime: '15:20', type: 'class', label: 'Period 8', subject: '', teacher: '', room: '' },
      { id: '11', startTime: '15:20', endTime: '16:00', type: 'class', label: 'Period 9', subject: '', teacher: '', room: '' },
    ],
  },
};

// Also allow '0000' for testing
SCHOOL_TEMPLATES['0000'] = SCHOOL_TEMPLATES['1234'];

const STORAGE_KEY = 'focas_student_schedule';

export const loadStudentSchedule = (): ScheduleSlot[] | null => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

export const saveStudentSchedule = (slots: ScheduleSlot[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
};

interface SchoolCodeSetupProps {
  onComplete: (slots: ScheduleSlot[]) => void;
}

export const SchoolCodeSetup = ({ onComplete }: SchoolCodeSetupProps) => {
  const { updateSchoolSettings } = useApp();
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [appliedTemplate, setAppliedTemplate] = useState<SchoolDayTemplate | null>(null);
  const [showCodeEntry, setShowCodeEntry] = useState(false);

  const handleCodeComplete = async (value: string) => {
    setCode(value);
    setError(null);

    if (value.length === 4) {
      setIsVerifying(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      const template = SCHOOL_TEMPLATES[value];
      if (template) {
        // Apply school day structure to settings
        updateSchoolSettings({
          schoolName: template.schoolName,
          schoolStartTime: template.startTime,
          schoolEndTime: template.endTime,
        });
        setAppliedTemplate(template);
        // Save the slot structure
        saveStudentSchedule(template.slots);
      } else {
        setError('Code not recognised. Check with your school and try again.');
        setCode('');
      }
      setIsVerifying(false);
    }
  };

  const handleContinue = () => {
    if (appliedTemplate) {
      onComplete(appliedTemplate.slots);
    }
  };

  const handleSkip = () => {
    onComplete([]);
  };

  if (appliedTemplate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="w-14 h-14 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            {appliedTemplate.schoolName}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            School day: {appliedTemplate.startTime} – {appliedTemplate.endTime}
          </p>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-left">
          <p className="text-sm font-medium text-foreground">
            Great — your school day is set up. Now add your own subjects to complete your timetable.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {appliedTemplate.slots.filter(s => s.type === 'class').length} class periods, {' '}
            {appliedTemplate.slots.filter(s => s.type === 'break').length} break(s), and lunch are ready.
          </p>
        </div>

        <Button onClick={handleContinue} className="w-full">
          Add My Subjects
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-5"
    >
      <div className="w-14 h-14 rounded-full bg-muted mx-auto flex items-center justify-center">
        <School className="w-7 h-7 text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground">School Setup Code</h3>
        <p className="text-sm text-muted-foreground mt-1">
          If your school gave you a 4-digit code, enter it below to load your school day structure.
        </p>
      </div>

      {!showCodeEntry ? (
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowCodeEntry(true)}
          >
            <ChevronDown className="w-4 h-4 mr-2" />
            I have a school code
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={handleSkip}>
            Skip — I'll set up manually
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <InputOTP maxLength={4} value={code} onChange={handleCodeComplete} disabled={isVerifying}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {isVerifying && (
            <p className="text-sm text-muted-foreground animate-pulse">Checking code…</p>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-2">
            <Button variant="ghost" className="flex-1 text-muted-foreground" onClick={() => { setShowCodeEntry(false); setCode(''); setError(null); }}>
              <ChevronUp className="w-4 h-4 mr-1" />
              Back
            </Button>
            <Button variant="ghost" className="flex-1 text-muted-foreground" onClick={handleSkip}>
              Skip
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
