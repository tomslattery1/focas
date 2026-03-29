import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Check, Save, Plus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface DaySchedule {
  dayOfWeek: number;
  dayName: string;
  shortName: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface Period {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  order: number;
}

const defaultSchedule: DaySchedule[] = [
  { dayOfWeek: 1, dayName: 'Monday', shortName: 'Mon', startTime: '08:50', endTime: '15:05', isActive: true },
  { dayOfWeek: 2, dayName: 'Tuesday', shortName: 'Tue', startTime: '08:50', endTime: '15:05', isActive: true },
  { dayOfWeek: 3, dayName: 'Wednesday', shortName: 'Wed', startTime: '08:50', endTime: '15:05', isActive: true },
  { dayOfWeek: 4, dayName: 'Thursday', shortName: 'Thu', startTime: '08:50', endTime: '15:05', isActive: true },
  { dayOfWeek: 5, dayName: 'Friday', shortName: 'Fri', startTime: '08:50', endTime: '12:40', isActive: true },
];

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

export const AdminScheduleManager = () => {
  const [activeTab, setActiveTab] = useState('hours');
  
  // School hours state
  const [schedules, setSchedules] = useState<DaySchedule[]>(() => {
    const saved = localStorage.getItem('focas_admin_schedule');
    return saved ? JSON.parse(saved) : defaultSchedule;
  });
  const [isSaved, setIsSaved] = useState(true);

  // Periods state
  const [periods, setPeriods] = useState<Period[]>(() => {
    const saved = localStorage.getItem('focas_periods');
    return saved ? JSON.parse(saved) : defaultPeriods;
  });
  const [showAddPeriodDialog, setShowAddPeriodDialog] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<Period | null>(null);
  const [periodToDelete, setPeriodToDelete] = useState<Period | null>(null);
  const [newPeriod, setNewPeriod] = useState({ name: '', startTime: '', endTime: '' });


  const updateSchedule = (dayOfWeek: number, updates: Partial<DaySchedule>) => {
    setSchedules(prev =>
      prev.map(s => (s.dayOfWeek === dayOfWeek ? { ...s, ...updates } : s))
    );
    setIsSaved(false);
  };

  const handleSaveSchedule = () => {
    localStorage.setItem('focas_admin_schedule', JSON.stringify(schedules));
    setIsSaved(true);
    toast.success('Schedule saved', {
      description: 'School mode schedule has been updated.',
    });
  };

  const handleAddPeriod = () => {
    if (!newPeriod.name.trim() || !newPeriod.startTime || !newPeriod.endTime) {
      toast.error('Please fill in all fields');
      return;
    }

    const period: Period = {
      id: `p${Date.now()}`,
      name: newPeriod.name.trim(),
      startTime: newPeriod.startTime,
      endTime: newPeriod.endTime,
      order: periods.length + 1,
    };

    const updatedPeriods = [...periods, period].sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    );
    setPeriods(updatedPeriods);
    localStorage.setItem('focas_periods', JSON.stringify(updatedPeriods));
    setNewPeriod({ name: '', startTime: '', endTime: '' });
    setShowAddPeriodDialog(false);
    toast.success(`${period.name} added`);
  };

  const handleEditPeriod = () => {
    if (!editingPeriod) return;

    const updatedPeriods = periods
      .map(p => p.id === editingPeriod.id ? editingPeriod : p)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    setPeriods(updatedPeriods);
    localStorage.setItem('focas_periods', JSON.stringify(updatedPeriods));
    setEditingPeriod(null);
    toast.success('Period updated');
  };

  const handleDeletePeriod = () => {
    if (!periodToDelete) return;

    const updatedPeriods = periods.filter(p => p.id !== periodToDelete.id);
    setPeriods(updatedPeriods);
    localStorage.setItem('focas_periods', JSON.stringify(updatedPeriods));
    
    toast.success(`${periodToDelete.name} removed`);
    setPeriodToDelete(null);
  };

  const isBreakPeriod = (period: Period) =>
    period.name.toLowerCase().includes('break') || period.name.toLowerCase().includes('lunch');

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-semibold">Schedule Management</h2>
        <p className="text-sm text-muted-foreground">
          Configure school hours and class periods
        </p>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hours">School Hours</TabsTrigger>
          <TabsTrigger value="periods">Periods</TabsTrigger>
        </TabsList>

        {/* School Hours Tab */}
        <TabsContent value="hours" className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {schedules.map((schedule, index) => (
              <motion.div
                key={schedule.dayOfWeek}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border ${
                  schedule.isActive ? 'bg-card' : 'bg-muted/30'
                }`}
              >
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="w-24">
                    <span className={`font-medium ${!schedule.isActive && 'text-muted-foreground'}`}>
                      {schedule.dayName}
                    </span>
                  </div>

                  <Switch
                    checked={schedule.isActive}
                    onCheckedChange={(checked) => updateSchedule(schedule.dayOfWeek, { isActive: checked })}
                  />

                  {schedule.isActive && (
                    <div className="flex items-center gap-2 flex-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <Input
                        type="time"
                        value={schedule.startTime}
                        onChange={(e) => updateSchedule(schedule.dayOfWeek, { startTime: e.target.value })}
                        className="w-28"
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        value={schedule.endTime}
                        onChange={(e) => updateSchedule(schedule.dayOfWeek, { endTime: e.target.value })}
                        className="w-28"
                      />
                    </div>
                  )}

                  {!schedule.isActive && (
                    <span className="text-sm text-muted-foreground italic">No school</span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <Button onClick={handleSaveSchedule} className="w-full gap-2" disabled={isSaved}>
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                Schedule Saved
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Schedule
              </>
            )}
          </Button>
        </TabsContent>

        {/* Periods Tab */}
        <TabsContent value="periods" className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => setShowAddPeriodDialog(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Period
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            {periods.map((period, index) => (
              <motion.div
                key={period.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className={`p-4 rounded-xl border flex items-center justify-between group ${
                  isBreakPeriod(period) ? 'bg-muted/50' : 'bg-card'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{period.name}</h4>
                      {isBreakPeriod(period) && (
                        <Badge variant="secondary" className="text-xs">Break</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {period.startTime} - {period.endTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditingPeriod(period)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setPeriodToDelete(period)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

      </Tabs>

      {/* Add Period Dialog */}
      <Dialog open={showAddPeriodDialog} onOpenChange={setShowAddPeriodDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Period</DialogTitle>
            <DialogDescription>
              Create a new period in the daily schedule.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="periodName">Period Name</Label>
              <Input
                id="periodName"
                placeholder="e.g., Period 1, Break, Lunch"
                value={newPeriod.name}
                onChange={(e) => setNewPeriod(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={newPeriod.startTime}
                  onChange={(e) => setNewPeriod(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={newPeriod.endTime}
                  onChange={(e) => setNewPeriod(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPeriodDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPeriod}>Add Period</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Period Dialog */}
      <Dialog open={!!editingPeriod} onOpenChange={(open) => !open && setEditingPeriod(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Period</DialogTitle>
            <DialogDescription>
              Update period details.
            </DialogDescription>
          </DialogHeader>
          
          {editingPeriod && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editPeriodName">Period Name</Label>
                <Input
                  id="editPeriodName"
                  value={editingPeriod.name}
                  onChange={(e) => setEditingPeriod(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="editStartTime">Start Time</Label>
                  <Input
                    id="editStartTime"
                    type="time"
                    value={editingPeriod.startTime}
                    onChange={(e) => setEditingPeriod(prev => prev ? { ...prev, startTime: e.target.value } : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEndTime">End Time</Label>
                  <Input
                    id="editEndTime"
                    type="time"
                    value={editingPeriod.endTime}
                    onChange={(e) => setEditingPeriod(prev => prev ? { ...prev, endTime: e.target.value } : null)}
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPeriod(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditPeriod}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Period Confirmation */}
      <AlertDialog open={!!periodToDelete} onOpenChange={(open) => !open && setPeriodToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Period</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{periodToDelete?.name}"? All assignments for this period will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePeriod}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
