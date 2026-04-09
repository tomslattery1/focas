import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Clock, BookOpen, Coffee, UtensilsCrossed, ArrowRight, Minus, Plus } from 'lucide-react';
import { type ScheduleSlot, saveStudentSchedule } from './SchoolCodeSetup';
import { useApp } from '@/contexts/AppContext';

interface ManualScheduleSetupProps {
  onComplete: (slots: ScheduleSlot[]) => void;
  onBack: () => void;
}

const addMinutes = (time: string, mins: number): string => {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  const newH = Math.floor(total / 60) % 24;
  const newM = total % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
};

const formatDuration = (mins: number): string => {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

export const ManualScheduleSetup = ({ onComplete, onBack }: ManualScheduleSetupProps) => {
  const { updateSchoolSettings } = useApp();
  const [startTime, setStartTime] = useState('08:50');
  const [classDuration, setClassDuration] = useState(40);
  const [breakDuration, setBreakDuration] = useState(15);
  const [lunchDuration, setLunchDuration] = useState(45);
  const [periodsBeforeBreak, setPeriodsBeforeBreak] = useState(3);
  const [periodsBeforeLunch, setPeriodsBeforeLunch] = useState(3);
  const [periodsAfterLunch, setPeriodsAfterLunch] = useState(2);

  const totalPeriods = periodsBeforeBreak + periodsBeforeLunch + periodsAfterLunch;

  const generateSlots = (): ScheduleSlot[] => {
    const slots: ScheduleSlot[] = [];
    let current = startTime;
    let id = 1;
    let periodNum = 1;

    // Before break
    for (let i = 0; i < periodsBeforeBreak; i++) {
      const end = addMinutes(current, classDuration);
      slots.push({
        id: String(id++),
        startTime: current,
        endTime: end,
        type: 'class',
        label: `Period ${periodNum++}`,
        subject: '',
        teacher: '',
        room: '',
      });
      current = end;
    }

    // Morning break
    const breakEnd = addMinutes(current, breakDuration);
    slots.push({
      id: String(id++),
      startTime: current,
      endTime: breakEnd,
      type: 'break',
      label: 'Morning Break',
      subject: '',
      teacher: '',
      room: '',
    });
    current = breakEnd;

    // Before lunch
    for (let i = 0; i < periodsBeforeLunch; i++) {
      const end = addMinutes(current, classDuration);
      slots.push({
        id: String(id++),
        startTime: current,
        endTime: end,
        type: 'class',
        label: `Period ${periodNum++}`,
        subject: '',
        teacher: '',
        room: '',
      });
      current = end;
    }

    // Lunch
    const lunchEnd = addMinutes(current, lunchDuration);
    slots.push({
      id: String(id++),
      startTime: current,
      endTime: lunchEnd,
      type: 'lunch',
      label: 'Lunch',
      subject: '',
      teacher: '',
      room: '',
    });
    current = lunchEnd;

    // After lunch
    for (let i = 0; i < periodsAfterLunch; i++) {
      const end = addMinutes(current, classDuration);
      slots.push({
        id: String(id++),
        startTime: current,
        endTime: end,
        type: 'class',
        label: `Period ${periodNum++}`,
        subject: '',
        teacher: '',
        room: '',
      });
      current = end;
    }

    return slots;
  };

  const handleGenerate = () => {
    const slots = generateSlots();
    const endTime = slots[slots.length - 1].endTime;
    updateSchoolSettings({
      schoolName: 'My School',
      schoolStartTime: startTime,
      schoolEndTime: endTime,
    });
    saveStudentSchedule(slots);
    onComplete(slots);
  };

  // Preview end time
  const previewSlots = generateSlots();
  const endTime = previewSlots.length > 0 ? previewSlots[previewSlots.length - 1].endTime : startTime;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5"
    >
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-3">
          <Clock className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Build Your School Day</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Set your times and we'll create your timetable
        </p>
      </div>

      {/* Start time */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          School starts at
        </Label>
        <Input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="h-11 text-base"
        />
      </div>

      {/* Class duration */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          Class duration
        </Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[classDuration]}
            onValueChange={([v]) => setClassDuration(v)}
            min={30}
            max={60}
            step={5}
            className="flex-1"
          />
          <span className="text-sm font-medium text-foreground w-14 text-right">
            {classDuration} min
          </span>
        </div>
      </div>

      {/* Break duration */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <Coffee className="w-4 h-4 text-muted-foreground" />
          Break duration
        </Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[breakDuration]}
            onValueChange={([v]) => setBreakDuration(v)}
            min={5}
            max={30}
            step={5}
            className="flex-1"
          />
          <span className="text-sm font-medium text-foreground w-14 text-right">
            {breakDuration} min
          </span>
        </div>
      </div>

      {/* Lunch duration */}
      <div className="space-y-2">
        <Label className="text-sm font-medium flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-muted-foreground" />
          Lunch duration
        </Label>
        <div className="flex items-center gap-3">
          <Slider
            value={[lunchDuration]}
            onValueChange={([v]) => setLunchDuration(v)}
            min={20}
            max={60}
            step={5}
            className="flex-1"
          />
          <span className="text-sm font-medium text-foreground w-14 text-right">
            {lunchDuration} min
          </span>
        </div>
      </div>

      {/* Period counts */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Number of classes</Label>
        <div className="grid grid-cols-3 gap-3">
          <CounterField
            label="Morning"
            value={periodsBeforeBreak}
            onChange={setPeriodsBeforeBreak}
            min={1}
            max={5}
          />
          <CounterField
            label="Mid-morning"
            value={periodsBeforeLunch}
            onChange={setPeriodsBeforeLunch}
            min={1}
            max={5}
          />
          <CounterField
            label="Afternoon"
            value={periodsAfterLunch}
            onChange={setPeriodsAfterLunch}
            min={1}
            max={5}
          />
        </div>
      </div>

      {/* Preview summary */}
      <div className="rounded-xl bg-muted/50 border border-border/50 p-4 space-y-1">
        <p className="text-sm font-medium text-foreground">
          {totalPeriods} classes · {startTime} – {endTime}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDuration(classDuration)} classes · {formatDuration(breakDuration)} break · {formatDuration(lunchDuration)} lunch
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-1">
        <Button onClick={handleGenerate} className="w-full h-11">
          <span className="flex items-center gap-2">
            Continue to Subjects
            <ArrowRight className="w-4 h-4" />
          </span>
        </Button>
        <button
          onClick={onBack}
          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
        >
          Back
        </button>
      </div>
    </motion.div>
  );
};

/* Small stepper for period counts */
const CounterField = ({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) => (
  <div className="flex flex-col items-center gap-1.5">
    <span className="text-xs text-muted-foreground text-center leading-tight">{label}</span>
    <div className="flex items-center gap-1">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        disabled={value <= min}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-6 text-center text-sm font-semibold text-foreground">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        disabled={value >= max}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);
