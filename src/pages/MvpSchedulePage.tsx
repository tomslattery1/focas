import { MobileLayout } from '@/components/layout/MobileLayout';
import { ClassCard } from '@/components/schedule/ClassCard';
import { PhaseAnnotation } from '@/components/mvp/PhaseAnnotation';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

/**
 * MVP Schedule — daily timetable
 *
 * Core MVP:
 * ✅ Daily class list with current-class highlight
 * ✅ Note: school hours auto-trigger Fócas Mode (Phase 2)
 *
 * Phase 2: Auto-trigger focus mode from schedule, push notifications
 */
const MvpSchedulePage = () => {
  const { schedule } = useApp();
  const today = new Date();

  return (
    <MobileLayout>
      <div className="px-5 pt-14 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground">Schedule</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {format(today, 'EEEE, MMMM d')}
          </p>
        </motion.div>

        {/* Auto-trigger hint */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-4 p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3"
        >
          <Clock className="w-5 h-5 text-primary shrink-0" />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Auto-trigger enabled:</span> Fócas Mode activates automatically during scheduled class times via the DeviceActivity framework.
          </p>
        </motion.div>

        {/* Class list */}
        <div className="space-y-3 mb-6">
          {schedule.map((classInfo, index) => (
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

        {/* Phase notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <PhaseAnnotation
            phase="phase2"
            title="Enhanced Schedule Sync"
            description="Real-time schedule updates with push notifications for timetable changes and room swaps."
          />
          <PhaseAnnotation
            phase="phase2"
            title="Schedule Sync"
            description="Real-time updates from school timetable system including room and teacher changes."
          />
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default MvpSchedulePage;
