import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const DURATIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1 hour', value: 60 },
];

interface FocusDurationSelectorProps {
  selected: number;
  onChange: (duration: number) => void;
}

export const FocusDurationSelector = ({ selected, onChange }: FocusDurationSelectorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">How long do you want to focus?</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {DURATIONS.map((d) => (
          <button
            key={d.value}
            onClick={() => onChange(d.value)}
            className={cn(
              'py-3 px-2 rounded-xl text-sm font-semibold transition-all border',
              selected === d.value
                ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                : 'bg-card text-foreground border-border/50 hover:border-primary/30'
            )}
          >
            {d.label}
          </button>
        ))}
      </div>
    </motion.div>
  );
};
