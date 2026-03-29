import { format } from 'date-fns';
import { AlertCircle, Bell } from 'lucide-react';
import { Announcement } from '@/types/app';
import { cn } from '@/lib/utils';

interface AnnouncementCardProps {
  announcement: Announcement;
}

export const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  const { title, message, timestamp, priority, read } = announcement;
  const isUrgent = priority === 'urgent';

  return (
    <div className={cn(
      "rounded-2xl p-4 border transition-all duration-200",
      isUrgent && !read 
        ? "bg-status-amber-light border-status-amber/20" 
        : read 
          ? "bg-muted/50 border-border/30" 
          : "bg-card border-border/50 shadow-card"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          isUrgent ? "bg-status-amber/20" : "bg-primary/10"
        )}>
          {isUrgent ? (
            <AlertCircle className="w-5 h-5 text-status-amber" />
          ) : (
            <Bell className="w-5 h-5 text-primary" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={cn(
              "font-semibold text-sm",
              read ? "text-muted-foreground" : "text-foreground"
            )}>
              {title}
            </h3>
            {!read && (
              <span className="w-2 h-2 bg-primary rounded-full shrink-0 mt-1.5" />
            )}
          </div>
          
          <p className={cn(
            "text-sm leading-relaxed mb-2",
            read ? "text-muted-foreground/70" : "text-muted-foreground"
          )}>
            {message}
          </p>
          
          <span className="text-xs text-muted-foreground/60">
            {format(timestamp, 'MMM d, h:mm a')}
          </span>
        </div>
      </div>
    </div>
  );
};
