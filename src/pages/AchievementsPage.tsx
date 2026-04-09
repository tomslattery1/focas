import { MobileLayout } from '@/components/layout/MobileLayout';
import { useGamification } from '@/contexts/GamificationContext';
import { Badge } from '@/types/gamification';
import { motion } from 'framer-motion';
import { Award, Flame, Target, Star } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

const AchievementsPage = () => {
  const { state, setWeeklyGoal } = useGamification();
  const [goalValue, setGoalValue] = useState(state.weeklyGoal.targetHours);

  const unlockedBadges = state.badges.filter(b => b.unlockedAt);
  const lockedBadges = state.badges.filter(b => !b.unlockedAt);

  const handleGoalChange = (values: number[]) => {
    setGoalValue(values[0]);
  };

  const handleGoalCommit = () => {
    if (goalValue !== state.weeklyGoal.targetHours) {
      setWeeklyGoal(goalValue);
    }
  };

  return (
    <MobileLayout>
      <div className="px-5 pt-14 pb-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">Achievements</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Celebrate your focus journey
          </p>
        </motion.div>

        {/* Summary stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-card text-center">
            <Flame className="w-5 h-5 text-[hsl(var(--status-amber))] mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">{state.currentStreak}</p>
            <p className="text-[10px] text-muted-foreground">Day streak</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-card text-center">
            <Star className="w-5 h-5 text-[hsl(var(--status-green))] mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">{state.totalSessions}</p>
            <p className="text-[10px] text-muted-foreground">Sessions</p>
          </div>
          <div className="bg-card rounded-2xl p-4 border border-border/50 shadow-card text-center">
            <Award className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="text-xl font-bold text-foreground">{unlockedBadges.length}</p>
            <p className="text-[10px] text-muted-foreground">Badges</p>
          </div>
        </motion.div>

        {/* Weekly Goal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            My Weekly Goal
          </h2>
          <div className="bg-card rounded-2xl p-5 border border-border/50 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-foreground">
                I want to focus for <span className="font-bold text-[hsl(var(--status-green))]">{goalValue} hour{goalValue !== 1 ? 's' : ''}</span> this week
              </p>
            </div>
            <Slider
              value={[goalValue]}
              onValueChange={handleGoalChange}
              onValueCommit={() => handleGoalCommit()}
              min={1}
              max={20}
              step={1}
              className="mb-2"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>1h</span>
              <span>10h</span>
              <span>20h</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Set a goal that feels right for you — every bit of focus counts.
            </p>
          </div>
        </motion.div>

        {/* Unlocked badges */}
        {unlockedBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Earned Badges
            </h2>
            <div className="space-y-3">
              {unlockedBadges.map((badge, i) => (
                <BadgeCard key={badge.id} badge={badge} unlocked index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Locked badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            {unlockedBadges.length > 0 ? 'Keep Going' : 'Badges to Earn'}
          </h2>
          <div className="space-y-3">
            {lockedBadges.map((badge, i) => (
              <BadgeCard key={badge.id} badge={badge} unlocked={false} index={i} />
            ))}
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

const BadgeCard = ({ badge, unlocked, index }: { badge: Badge; unlocked: boolean; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
      unlocked
        ? 'bg-[hsl(var(--status-green-light))] border-[hsl(var(--status-green)/0.2)]'
        : 'bg-muted/50 border-border/50 opacity-60'
    }`}
  >
    <span className="text-3xl">{badge.icon}</span>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-foreground text-sm">{badge.nameIrish}</p>
      <p className="text-xs text-muted-foreground">{badge.nameEnglish}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{badge.description}</p>
    </div>
    {unlocked && (
      <span className="text-[hsl(var(--status-green))] text-xs font-medium shrink-0">✓</span>
    )}
  </motion.div>
);

export default AchievementsPage;
