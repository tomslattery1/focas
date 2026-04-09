import { useState, useEffect } from 'react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ClassCard } from '@/components/schedule/ClassCard';
import { useApp } from '@/contexts/AppContext';
import { ManualScheduleSetup } from '@/components/student/ManualScheduleSetup';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Pencil, School } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SchoolCodeSetup, loadStudentSchedule, type ScheduleSlot } from '@/components/student/SchoolCodeSetup';
import { SubjectEditor } from '@/components/student/SubjectEditor';
import { ClassPeriod } from '@/types/app';

type SetupPhase = 'view' | 'code-entry' | 'manual-setup' | 'subject-edit';

const slotsToClassPeriods = (slots: ScheduleSlot[]): ClassPeriod[] => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return slots.map(slot => {
    const [sh, sm] = slot.startTime.split(':').map(Number);
    const [eh, em] = slot.endTime.split(':').map(Number);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    const isCurrent = currentMinutes >= startMin && currentMinutes < endMin;

    return {
      id: slot.id,
      name: slot.subject || slot.label,
      teacher: slot.teacher,
      room: slot.room || (slot.type === 'break' ? '' : slot.type === 'lunch' ? 'Cafeteria' : ''),
      startTime: slot.startTime,
      endTime: slot.endTime,
      isCurrent,
    };
  });
};

/**
 * MVP Schedule — daily timetable with school code setup
 */
const MvpSchedulePage = () => {
  const { schedule: defaultSchedule } = useApp();
  const today = new Date();

  const [savedSlots, setSavedSlots] = useState<ScheduleSlot[] | null>(loadStudentSchedule);
  const [phase, setPhase] = useState<SetupPhase>(() => {
    return loadStudentSchedule() ? 'view' : 'code-entry';
  });

  const displaySchedule = savedSlots ? slotsToClassPeriods(savedSlots) : defaultSchedule;

  const handleCodeComplete = (slots: ScheduleSlot[]) => {
    if (slots.length === 0) {
      // Skipped — go to manual setup
      setPhase('manual-setup');
      return;
    }
    setSavedSlots(slots);
    setPhase('subject-edit');
  };

  const handleSubjectsComplete = (slots: ScheduleSlot[]) => {
    setSavedSlots(slots);
    setPhase('view');
  };

  if (phase === 'code-entry') {
    return (
      <MobileLayout>
        <div className="px-5 pt-14 pb-6 flex flex-col justify-center min-h-[60vh]">
          <SchoolCodeSetup onComplete={handleCodeComplete} />
        </div>
      </MobileLayout>
    );
  }

  if (phase === 'manual-setup') {
    return (
      <MobileLayout>
        <div className="px-5 pt-14 pb-6">
          <ManualScheduleSetup
            onComplete={(slots) => {
              setSavedSlots(slots);
              setPhase('subject-edit');
            }}
            onBack={() => setPhase('code-entry')}
          />
        </div>
      </MobileLayout>
    );
  }

  if (phase === 'subject-edit' && savedSlots) {
    return (
      <MobileLayout>
        <div className="px-5 pt-14 pb-6">
          <SubjectEditor slots={savedSlots} onComplete={handleSubjectsComplete} />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="px-5 pt-14 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-start justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {format(today, 'EEEE, MMMM d')}
            </p>
          </div>
          <div className="flex gap-1">
            {!savedSlots && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPhase('code-entry')}>
                <School className="w-4 h-4" />
              </Button>
            )}
            {savedSlots && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPhase('subject-edit')}>
                <Pencil className="w-4 h-4" />
              </Button>
            )}
          </div>
        </motion.div>


        {/* Class list */}
        <div className="space-y-3 mb-6">
          {displaySchedule.map((classInfo, index) => (
            <motion.div
              key={classInfo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ClassCard classInfo={classInfo} />
            </motion.div>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default MvpSchedulePage;
