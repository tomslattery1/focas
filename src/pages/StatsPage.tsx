import { MobileLayout } from '@/components/layout/MobileLayout';
import { StatsCard } from '@/components/stats/StatsCard';
import { WeeklyChart } from '@/components/stats/WeeklyChart';
import { useApp } from '@/contexts/AppContext';
import { Clock, TrendingUp, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const StatsPage = () => {
  const { todayStats, weekStats } = useApp();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const todayCompliance = Math.round((todayStats.compliantMinutes / todayStats.totalMinutes) * 100);
  
  const weekTotal = weekStats.reduce((acc, stat) => acc + stat.compliantMinutes, 0);
  const weekAverage = Math.round(weekTotal / weekStats.length);
  
  const streak = weekStats.filter(stat => 
    (stat.compliantMinutes / stat.totalMinutes) >= 0.9
  ).length;

  return (
    <MobileLayout>
      <div className="px-5 pt-14 pb-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">Statistics</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your focus progress</p>
        </motion.div>

        {/* Today Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Today</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatsCard
              title="Time in Study Mode"
              value={formatTime(todayStats.compliantMinutes)}
              icon={<Clock className="w-4 h-4" />}
              variant="success"
            />
            <StatsCard
              title="Compliance Rate"
              value={`${todayCompliance}%`}
              subtitle={todayCompliance >= 90 ? 'Excellent!' : 'Keep going!'}
              icon={<TrendingUp className="w-4 h-4" />}
              variant={todayCompliance >= 90 ? 'success' : todayCompliance >= 70 ? 'warning' : 'default'}
            />
          </div>
        </motion.div>

        {/* Weekly Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <WeeklyChart stats={weekStats} />
        </motion.div>

        {/* Week Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">This Week</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatsCard
              title="Weekly Total"
              value={formatTime(weekTotal)}
              subtitle="Total focus time"
              icon={<Clock className="w-4 h-4" />}
            />
            <StatsCard
              title="Current Streak"
              value={`${streak} days`}
              subtitle="90%+ compliance"
              icon={<Award className="w-4 h-4" />}
              variant={streak >= 5 ? 'success' : 'default'}
            />
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default StatsPage;
