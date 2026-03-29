import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Clock, Sparkles } from 'lucide-react';

type Phase = 'phase2' | 'phase3' | 'future';

interface PhaseAnnotationProps {
  phase: Phase;
  title: string;
  description?: string;
  className?: string;
}

const phaseConfig = {
  phase2: {
    label: 'Phase 2',
    color: 'bg-blue-500/10 border-blue-500/30 text-blue-600',
    icon: Clock,
  },
  phase3: {
    label: 'Phase 3',
    color: 'bg-purple-500/10 border-purple-500/30 text-purple-600',
    icon: Sparkles,
  },
  future: {
    label: 'Future',
    color: 'bg-gray-500/10 border-gray-500/30 text-gray-500',
    icon: Clock,
  },
};

/**
 * Phase Annotation Component
 * 
 * Used to mark features that are planned for future phases.
 * Helps stakeholders and testers understand what's in the MVP
 * vs. what's coming later.
 * 
 * Usage:
 * - Phase 2: Teacher dashboard, class management
 * - Phase 3: Parent portal, advanced analytics
 * - Future: AI recommendations, gamification
 */
export const PhaseAnnotation = ({ phase, title, description, className }: PhaseAnnotationProps) => {
  const config = phaseConfig[phase];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-4 rounded-xl border-2 border-dashed",
        config.color,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-current/10">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-current/10">
              {config.label}
            </span>
            <h4 className="font-semibold text-sm">{title}</h4>
          </div>
          {description && (
            <p className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Inline phase badge for compact annotations
 */
export const PhaseBadge = ({ phase }: { phase: Phase }) => {
  const config = phaseConfig[phase];
  
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
      config.color
    )}>
      {config.label}
    </span>
  );
};
