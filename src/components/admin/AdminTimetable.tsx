import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Period {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  order: number;
}

interface ScheduleSlot {
  day: string;
  periodId: string;
}

interface SubjectGroup {
  id: string;
  subject: string;
  level: string;
  teacher: string;
  yearGroup: string;
  students: string[];
  schedule?: ScheduleSlot[];
}

interface YearSubjectGroups {
  yearGroup: string;
  subjects: SubjectGroup[];
}

const defaultPeriods: Period[] = [
  { id: 'p1', name: 'Period 1', startTime: '08:50', endTime: '09:40', order: 1 },
  { id: 'p2', name: 'Period 2', startTime: '09:45', endTime: '10:35', order: 2 },
  { id: 'break1', name: 'Break', startTime: '10:35', endTime: '10:55', order: 3 },
  { id: 'p3', name: 'Period 3', startTime: '10:55', endTime: '11:45', order: 4 },
  { id: 'p4', name: 'Period 4', startTime: '11:50', endTime: '12:40', order: 5 },
  { id: 'lunch', name: 'Lunch', startTime: '12:40', endTime: '13:20', order: 6 },
  { id: 'p5', name: 'Period 5', startTime: '13:20', endTime: '14:10', order: 7 },
  { id: 'p6', name: 'Period 6', startTime: '14:15', endTime: '15:05', order: 8 },
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const AdminTimetable = () => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [subjectGroups, setSubjectGroups] = useState<YearSubjectGroups[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  useEffect(() => {
    const savedPeriods = localStorage.getItem('focas_periods');
    setPeriods(savedPeriods ? JSON.parse(savedPeriods) : defaultPeriods);

    const savedSubjectGroups = localStorage.getItem('adminSubjectGroups');
    if (savedSubjectGroups) {
      setSubjectGroups(JSON.parse(savedSubjectGroups));
    }
  }, []);

  const isBreakPeriod = (period: Period) =>
    period.name.toLowerCase().includes('break') || 
    period.name.toLowerCase().includes('lunch');

  const currentDay = days[currentDayIndex];

  // Get all subject groups for selected year that have schedule entries for current day and period
  const getGroupsForSlot = (periodId: string) => {
    const filteredGroups = selectedYear === 'all' 
      ? subjectGroups 
      : subjectGroups.filter(ysg => ysg.yearGroup === selectedYear);

    return filteredGroups.flatMap(ysg => 
      ysg.subjects.filter(sg => 
        sg.schedule?.some(slot => slot.day === currentDay && slot.periodId === periodId)
      ).map(sg => ({ ...sg, yearGroup: ysg.yearGroup }))
    );
  };

  const yearOptions = subjectGroups.map(ysg => ysg.yearGroup);

  return (
    <div className="space-y-6">
      {/* Filters and Day Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center gap-4"
      >
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {yearOptions.map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 flex-1 justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentDayIndex(Math.max(0, currentDayIndex - 1))}
            disabled={currentDayIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex gap-1">
            {days.map((day, index) => (
              <Button
                key={day}
                variant={index === currentDayIndex ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setCurrentDayIndex(index)}
                className="min-w-[60px]"
              >
                {day.slice(0, 3)}
              </Button>
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentDayIndex(Math.min(days.length - 1, currentDayIndex + 1))}
            disabled={currentDayIndex === days.length - 1}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Timetable Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ScrollArea className="w-full">
          <div className="space-y-2 min-w-[600px]">
            {/* Header Row */}
            <div className="grid grid-cols-[100px_1fr] gap-2">
              <div className="p-3 rounded-lg bg-muted font-medium text-center text-sm">
                Time
              </div>
              <div className="p-3 rounded-lg bg-muted font-medium text-center text-sm">
                {days[currentDayIndex]} Classes
              </div>
            </div>

            {/* Period Rows */}
            {periods.map((period, index) => {
              const groups = getGroupsForSlot(period.id);
              const isBreak = isBreakPeriod(period);
              
              return (
                <motion.div
                  key={period.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`grid grid-cols-[100px_1fr] gap-2 ${
                    isBreak ? 'opacity-60' : ''
                  }`}
                >
                  {/* Time Column */}
                  <div className={`p-3 rounded-lg border flex flex-col items-center justify-center ${
                    isBreak ? 'bg-muted/50' : 'bg-card'
                  }`}>
                    <span className="text-xs font-medium">{period.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {period.startTime}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {period.endTime}
                    </span>
                  </div>

                  {/* Classes Column */}
                  <div className={`p-3 rounded-lg border ${
                    isBreak ? 'bg-muted/30 flex items-center justify-center' : 'bg-card'
                  }`}>
                    {isBreak ? (
                      <Badge variant="secondary">{period.name}</Badge>
                    ) : groups.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {groups.map(group => (
                          <div
                            key={group.id}
                            className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20"
                          >
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {group.subject} {group.level}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {group.teacher}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-muted-foreground">
                                {group.yearGroup}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                • {group.students.length} students
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No classes scheduled
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4 text-xs text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary/10 border border-primary/20" />
          <span>Subject Group</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-muted/50" />
          <span>Break Period</span>
        </div>
      </motion.div>
    </div>
  );
};
