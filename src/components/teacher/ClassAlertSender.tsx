import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, AlertTriangle, Bell, Clock, MapPin, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { TeacherClass } from '@/types/app';

// Mock teacher's classes for selection
const teacherClasses: TeacherClass[] = [
  { id: '1', name: 'Mathematics', yearGroup: '1A', subject: 'Maths', room: 'Room 101', startTime: '08:30', endTime: '09:20', isCurrent: false },
  { id: '2', name: 'Mathematics', yearGroup: '2A', subject: 'Maths', room: 'Room 101', startTime: '09:25', endTime: '10:15', isCurrent: true },
  { id: '3', name: 'Mathematics', yearGroup: '1B', subject: 'Maths', room: 'Room 103', startTime: '10:30', endTime: '11:20', isCurrent: false },
  { id: '4', name: 'Mathematics', yearGroup: '3A', subject: 'Maths', room: 'Room 101', startTime: '11:25', endTime: '12:15', isCurrent: false },
  { id: '6', name: 'Mathematics', yearGroup: '2B', subject: 'Maths', room: 'Room 105', startTime: '13:05', endTime: '13:55', isCurrent: false },
  { id: '7', name: 'Mathematics', yearGroup: '1A', subject: 'Maths', room: 'Room 101', startTime: '14:00', endTime: '14:50', isCurrent: false },
];

interface ClassAlert {
  id: string;
  classId: string;
  className: string;
  yearGroup: string;
  message: string;
  priority: 'normal' | 'urgent';
  timestamp: Date;
}

export const ClassAlertSender = () => {
  const { toast } = useToast();
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(
    teacherClasses.find(c => c.isCurrent) || null
  );
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [recentAlerts, setRecentAlerts] = useState<ClassAlert[]>([]);

  const sendAlert = () => {
    if (!selectedClass || !message.trim()) return;

    const newAlert: ClassAlert = {
      id: String(Date.now()),
      classId: selectedClass.id,
      className: selectedClass.name,
      yearGroup: selectedClass.yearGroup,
      message: message.trim(),
      priority,
      timestamp: new Date(),
    };

    setRecentAlerts(prev => [newAlert, ...prev].slice(0, 5));
    
    toast({
      title: 'Alert sent',
      description: `Your alert has been sent to Year ${selectedClass.yearGroup} students.`,
    });

    setMessage('');
    setPriority('normal');
  };

  // If a class is selected, show the alert composer screen
  if (selectedClass) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedClass(null)}
            className="flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h3 className="text-lg font-semibold">{selectedClass.name}</h3>
            <p className="text-sm text-muted-foreground">
              Year {selectedClass.yearGroup} • {selectedClass.room} • {selectedClass.startTime} - {selectedClass.endTime}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Compose Alert
              <Badge variant="outline">Year {selectedClass.yearGroup}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="e.g., Class moved to Room 205 today..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />

            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Priority:</p>
              <div className="flex gap-2">
                <Button
                  variant={priority === 'normal' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPriority('normal')}
                >
                  <Bell className="w-4 h-4 mr-1" />
                  Normal
                </Button>
                <Button
                  variant={priority === 'urgent' ? 'destructive' : 'outline'}
                  size="sm"
                  onClick={() => setPriority('urgent')}
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Urgent
                </Button>
              </div>
            </div>

            <Button 
              onClick={sendAlert} 
              className="w-full"
              disabled={!message.trim()}
            >
              <Send className="w-4 h-4 mr-2" />
              Send to Year {selectedClass.yearGroup}
            </Button>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        {recentAlerts.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Recent Alerts</h4>
            <div className="space-y-2">
              {recentAlerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg border ${
                    alert.priority === 'urgent' 
                      ? 'bg-destructive/5 border-destructive/20' 
                      : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {alert.priority === 'urgent' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
                        ) : (
                          <Bell className="w-3.5 h-3.5 text-primary" />
                        )}
                        <Badge variant="secondary" className="text-xs">Year {alert.yearGroup}</Badge>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  // Class list view
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Class Alerts</h3>
        <p className="text-sm text-muted-foreground">
          Send quick alerts to students in your classes (e.g., room changes, cancelled classes)
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Select a class to send an alert:</p>
        <div className="space-y-2">
          {teacherClasses.map((classItem, index) => (
            <motion.div
              key={classItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:bg-muted/50 ${
                  classItem.isCurrent ? 'border-primary' : ''
                }`}
                onClick={() => setSelectedClass(classItem)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {classItem.isCurrent && (
                          <Badge variant="default" className="text-xs">Current</Badge>
                        )}
                        <span className="font-medium">{classItem.name}</span>
                        <Badge variant="secondary">{classItem.yearGroup}</Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {classItem.startTime} - {classItem.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {classItem.room}
                        </span>
                      </div>
                    </div>
                    <Bell className="w-5 h-5 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};