import { MobileLayout } from '@/components/layout/MobileLayout';
import { StatsCard } from '@/components/stats/StatsCard';
import { WeeklyChart } from '@/components/stats/WeeklyChart';
import { useApp } from '@/contexts/AppContext';
import { useApp } from '@/contexts/AppContext';
import { Clock, TrendingUp, Award, Target } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * MVP Stats Page - Focus Time Statistics
 * 
 * Core MVP Features:
 * ✅ Today's focus time display
 * ✅ Focus score percentage
 * ✅ Weekly trend chart (mock data)
 * ✅ Current streak display
 * 
 * Phase 2 Features (noted):
 * - Subject-specific focus breakdown
 * - Goal setting and tracking
 * - Teacher-visible class averages
 * 
 * Phase 3 Features (noted):
 * - AI-powered focus recommendations
 * - Gamification and achievements
 */
const MvpStatsPage = () => {
  const { todayStats, weekStats } = useApp();

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const todayFocusScore = Math.round((todayStats.compliantMinutes / todayStats.totalMinutes) * 100);
  
  const weekTotal = weekStats.reduce((acc, stat) => acc + stat.compliantMinutes, 0);
  
  const streak = weekStats.filter(stat => 
    (stat.compliantMinutes / stat.totalMinutes) >= 0.9
  ).length;

  // Determine status color based on score
  const getScoreVariant = (score: number): 'success' | 'warning' | 'default' => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'default';
  };

  return (
    <MobileLayout>
      <div className="px-5 pt-14 pb-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground">Focus Stats</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your focus progress</p>
        </motion.div>

        {/* Today Stats - Core MVP Feature */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Today</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatsCard
              title="Focus Time"
              value={formatTime(todayStats.compliantMinutes)}
              icon={<Clock className="w-4 h-4" />}
              variant="success"
            />
            <StatsCard
              title="Focus Score"
              value={`${todayFocusScore}%`}
              subtitle={todayFocusScore >= 90 ? 'Excellent!' : todayFocusScore >= 70 ? 'Good work!' : 'Keep going!'}
              icon={<TrendingUp className="w-4 h-4" />}
              variant={getScoreVariant(todayFocusScore)}
            />
          </div>
        </motion.div>

        {/* Weekly Chart - Core MVP Feature (Mock Data) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">This Week</h2>
          </div>
          </div>
          <WeeklyChart stats={weekStats} />
          <p className="text-xs text-muted-foreground text-center mt-2">
            Based on your completed Fócas sessions
          </p>
        </motion.div>

        {/* Week Summary - Core MVP Feature */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Summary</h2>
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
              subtitle="90%+ focus score"
              icon={<Award className="w-4 h-4" />}
              variant={streak >= 5 ? 'success' : 'default'}
            />
          </div>
        </motion.div>

        {/* Future Phase Annotations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <PhaseAnnotation
            phase="phase2"
            title="Goal Setting"
            description="Set personal focus targets and track progress. Subject-specific focus breakdowns."
          />
          <PhaseAnnotation
            phase="phase3"
            title="Achievements & Rewards"
            description="Gamification with badges, milestones, and school-wide leaderboards."
          />
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default MvpStatsPage;
