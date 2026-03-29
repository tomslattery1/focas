import { Clock, MapPin, User } from 'lucide-react';
import { ClassPeriod } from '@/types/app';
import { cn } from '@/lib/utils';

interface ClassCardProps {
  classInfo: ClassPeriod;
}

export const ClassCard = ({ classInfo }: ClassCardProps) => {
  const { name, teacher, room, startTime, endTime, isCurrent } = classInfo;

  return (
    <div className={cn(
      "rounded-2xl p-4 border transition-all duration-200",
      isCurrent 
        ? "bg-primary/5 border-primary/20 shadow-card" 
        : "bg-card border-border/50"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className={cn(
            "font-semibold text-base",
            isCurrent ? "text-primary" : "text-foreground"
          )}>
            {name}
          </h3>
          {isCurrent && (
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 inline-block">
              Now
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">{startTime} - {endTime}</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        {teacher && (
          <div className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            <span>{teacher}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>{room}</span>
        </div>
      </div>
    </div>
  );
};
