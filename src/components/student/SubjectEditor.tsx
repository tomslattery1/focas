import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, BookOpen, Coffee, UtensilsCrossed } from 'lucide-react';
import { type ScheduleSlot, saveStudentSchedule } from './SchoolCodeSetup';

interface SubjectEditorProps {
  slots: ScheduleSlot[];
  onComplete: (slots: ScheduleSlot[]) => void;
}

export const SubjectEditor = ({ slots: initialSlots, onComplete }: SubjectEditorProps) => {
  const [slots, setSlots] = useState<ScheduleSlot[]>(initialSlots);

  const updateSlot = (id: string, field: 'subject' | 'teacher' | 'room', value: string) => {
    setSlots(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = () => {
    saveStudentSchedule(slots);
    onComplete(slots);
  };

  const classSlots = slots.filter(s => s.type === 'class');
  const filledCount = classSlots.filter(s => s.subject.trim()).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="text-center mb-2">
        <h3 className="text-lg font-semibold text-foreground">Add Your Subjects</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {filledCount}/{classSlots.length} subjects added
        </p>
      </div>

      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
        {slots.map((slot) => {
          if (slot.type === 'break') {
            return (
              <div key={slot.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 text-muted-foreground">
                <Coffee className="w-4 h-4 shrink-0" />
                <span className="text-xs font-medium">{slot.startTime} – {slot.endTime}</span>
                <span className="text-xs">{slot.label}</span>
              </div>
            );
          }
          if (slot.type === 'lunch') {
            return (
              <div key={slot.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 text-muted-foreground">
                <UtensilsCrossed className="w-4 h-4 shrink-0" />
                <span className="text-xs font-medium">{slot.startTime} – {slot.endTime}</span>
                <span className="text-xs">{slot.label}</span>
              </div>
            );
          }

          return (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-border/50 bg-card p-3 space-y-2"
            >
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="font-medium">{slot.label}</span>
                <span>·</span>
                <span>{slot.startTime} – {slot.endTime}</span>
              </div>
              <Input
                placeholder="Subject (e.g. Maths, Irish, Biology)"
                value={slot.subject}
                onChange={(e) => updateSlot(slot.id, 'subject', e.target.value)}
                className="h-8 text-sm"
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Teacher"
                  value={slot.teacher}
                  onChange={(e) => updateSlot(slot.id, 'teacher', e.target.value)}
                  className="h-8 text-sm flex-1"
                />
                <Input
                  placeholder="Room"
                  value={slot.room}
                  onChange={(e) => updateSlot(slot.id, 'room', e.target.value)}
                  className="h-8 text-sm w-20"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-2 pt-2">
        <Button variant="ghost" className="flex-1" onClick={handleSave}>
          Save & Continue
        </Button>
        {filledCount < classSlots.length && (
          <Button variant="ghost" className="flex-1 text-muted-foreground text-xs" onClick={handleSave}>
            Save what I have
          </Button>
        )}
      </div>

      {filledCount === classSlots.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-2 text-primary text-sm"
        >
          <CheckCircle className="w-4 h-4" />
          <span>All subjects added!</span>
        </motion.div>
      )}
    </motion.div>
  );
};
