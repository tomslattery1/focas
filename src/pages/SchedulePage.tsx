import { MobileLayout } from '@/components/layout/MobileLayout';
import { ClassCard } from '@/components/schedule/ClassCard';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const SchedulePage = () => {
  const { schedule } = useApp();
  const today = new Date();

  return (
    <MobileLayout>
      <div className="px-5 pt-14 pb-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">Class Schedule</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {format(today, 'EEEE, MMMM d')}
          </p>
        </motion.div>

        {/* Schedule List */}
        <div className="space-y-3">
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
      </div>
    </MobileLayout>
  );
};

export default SchedulePage;
