import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning';
}

export const StatsCard = ({ title, value, subtitle, icon, variant = 'default' }: StatsCardProps) => {
  return (
    <div className={cn(
      "bg-card rounded-2xl p-5 shadow-card border border-border/50",
      variant === 'success' && "bg-status-green-light border-status-green/20",
      variant === 'warning' && "bg-status-amber-light border-status-amber/20"
    )}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <div className={cn(
        "text-3xl font-bold",
        variant === 'success' && "text-status-green",
        variant === 'warning' && "text-status-amber",
        variant === 'default' && "text-foreground"
      )}>
        {value}
      </div>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
};
