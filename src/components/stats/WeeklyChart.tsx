import { DailyStats } from '@/types/app';
import { cn } from '@/lib/utils';

interface WeeklyChartProps {
  stats: DailyStats[];
}

// Get short day label from date
const getDayLabel = (date: Date): string => {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  return days[date.getDay()];
};

export const WeeklyChart = ({ stats }: WeeklyChartProps) => {
  const maxMinutes = Math.max(...stats.map(s => s.totalMinutes), 1);
  const today = new Date().toDateString();

  return (
    <div className="bg-card rounded-2xl p-5 shadow-card border border-border/50">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">This Week (School Days)</h3>
      <div className="flex items-end justify-between gap-2 h-32">
        {stats.map((stat, index) => {
          const percentage = (stat.compliantMinutes / maxMinutes) * 100;
          const complianceRate = stat.totalMinutes > 0 
            ? (stat.compliantMinutes / stat.totalMinutes) * 100 
            : 0;
          const isToday = stat.date.toDateString() === today;
          
          return (
            <div key={index} className="flex flex-col items-center gap-2 flex-1">
              <div className="relative w-full h-24 bg-muted rounded-lg overflow-hidden">
                <div 
                  className={cn(
                    "absolute bottom-0 left-0 right-0 rounded-lg transition-all duration-500",
                    complianceRate >= 90 ? "bg-status-green" : 
                    complianceRate >= 70 ? "bg-status-amber" : "bg-status-red",
                    isToday && "animate-pulse-soft"
                  )}
                  style={{ height: `${percentage}%` }}
                />
              </div>
              <span className={cn(
                "text-xs font-medium",
                isToday ? "text-foreground" : "text-muted-foreground"
              )}>
                {getDayLabel(stat.date)}
              </span>
            </div>
          );
        })}
      </div>
      {stats.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-8">
          No school days recorded this week
        </p>
      )}
    </div>
  );
};
