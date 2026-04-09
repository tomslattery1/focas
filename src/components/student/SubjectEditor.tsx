import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, BookOpen, Coffee, UtensilsCrossed, Merge, Unlink } from 'lucide-react';
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

  const mergeWithNext = (index: number) => {
    setSlots(prev => {
      const updated = [...prev];
      const current = updated[index];
      const next = updated[index + 1];
      if (!current || !next || current.type !== 'class' || next.type !== 'class') return prev;

      // Merge: extend current to cover next, remove next
      const mergedLabel = current.label.includes('–')
        ? current.label.replace(/–\s*\d+/, `– ${next.label.replace('Period ', '')}`)
        : `${current.label} – ${next.label.replace('Period ', '')}`;

      updated[index] = {
        ...current,
        endTime: next.endTime,
        label: mergedLabel,
        // Store original IDs so we can unmerge
        mergedIds: [...(current.mergedIds || [current.id]), next.id],
      } as ScheduleSlot & { mergedIds: string[] };

      updated.splice(index + 1, 1);
      return updated;
    });
  };

  const unmergeSlot = (index: number) => {
    const slot = slots[index] as ScheduleSlot & { mergedIds?: string[] };
    if (!slot.mergedIds || slot.mergedIds.length < 2) return;

    // Find the original slots from initialSlots
    const originals = slot.mergedIds
      .map(id => initialSlots.find(s => s.id === id))
      .filter(Boolean) as ScheduleSlot[];

    if (originals.length < 2) return;

    setSlots(prev => {
      const updated = [...prev];
      updated.splice(index, 1, ...originals);
      return updated;
    });
  };

  const handleSave = () => {
    saveStudentSchedule(slots);
    onComplete(slots);
  };

  const classSlots = slots.filter(s => s.type === 'class');
  const filledCount = classSlots.filter(s => s.subject.trim()).length;

  // Check if a class slot can be merged with the next slot
  const canMergeWithNext = (index: number): boolean => {
    const next = slots[index + 1];
    return !!next && next.type === 'class';
  };

  const isMerged = (slot: ScheduleSlot): boolean => {
    return !!((slot as any).mergedIds && (slot as any).mergedIds.length >= 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="text-center mb-2">
        <h3 className="text-lg font-semibold text-foreground">Add Your Subjects</h3>
        <p className="text-xs text-muted-foreground mt-1">
          {filledCount}/{classSlots.length} subjects added · Tap <Merge className="w-3 h-3 inline" /> to combine periods
        </p>
      </div>

      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
        {slots.map((slot, index) => {
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

          const merged = isMerged(slot);

          return (
            <motion.div
              key={slot.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`rounded-xl border bg-card p-3 space-y-2 ${merged ? 'border-primary/30 bg-primary/5' : 'border-border/50'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="font-medium">{slot.label}</span>
                  <span>·</span>
                  <span>{slot.startTime} – {slot.endTime}</span>
                  {merged && (
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                      Double
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  {merged && (
                    <button
                      onClick={() => unmergeSlot(index)}
                      className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      title="Split periods"
                    >
                      <Unlink className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {!merged && canMergeWithNext(index) && (
                    <button
                      onClick={() => mergeWithNext(index)}
                      className="p-1 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Combine with next period"
                    >
                      <Merge className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
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
