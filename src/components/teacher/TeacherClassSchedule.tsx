import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, Users, ChevronRight, CheckCircle, AlertTriangle, XCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TeacherClass, Student, FocusStatus } from '@/types/app';

// Mock teacher's class schedule
const teacherClasses: TeacherClass[] = [
  { id: '1', name: 'Mathematics', yearGroup: '1A', subject: 'Maths', room: 'Room 101', startTime: '08:30', endTime: '09:20', isCurrent: false },
  { id: '2', name: 'Mathematics', yearGroup: '2A', subject: 'Maths', room: 'Room 101', startTime: '09:25', endTime: '10:15', isCurrent: true },
  { id: '3', name: 'Mathematics', yearGroup: '1B', subject: 'Maths', room: 'Room 103', startTime: '10:30', endTime: '11:20', isCurrent: false },
  { id: '4', name: 'Mathematics', yearGroup: '3A', subject: 'Maths', room: 'Room 101', startTime: '11:25', endTime: '12:15', isCurrent: false },
  { id: '5', name: 'Lunch Break', yearGroup: '', subject: '', room: 'Staff Room', startTime: '12:15', endTime: '13:00', isCurrent: false },
  { id: '6', name: 'Mathematics', yearGroup: '2B', subject: 'Maths', room: 'Room 105', startTime: '13:05', endTime: '13:55', isCurrent: false },
  { id: '7', name: 'Mathematics', yearGroup: '1A', subject: 'Maths', room: 'Room 101', startTime: '14:00', endTime: '14:50', isCurrent: false },
];

// Mock students organized by year group
const studentsByYearGroup: Record<string, Student[]> = {
  '1A': [
    { id: '1', name: 'Aoife Murphy', grade: '1A', status: 'green', lastActive: new Date(), focasModeActive: true, hasOptedIn: true },
    { id: '2', name: 'Cillian O\'Connor', grade: '1A', status: 'green', lastActive: new Date(Date.now() - 120000), focasModeActive: true, hasOptedIn: true },
    { id: '3', name: 'Meadhbh Ní Bhriain', grade: '1A', status: 'amber', lastActive: new Date(Date.now() - 600000), focasModeActive: true, hasOptedIn: false },
    { id: '4', name: 'Tadhg Mac Carthaigh', grade: '1A', status: 'green', lastActive: new Date(Date.now() - 180000), focasModeActive: true, hasOptedIn: true },
    { id: '5', name: 'Clodagh Fitzpatrick', grade: '1A', status: 'green', lastActive: new Date(), focasModeActive: true, hasOptedIn: true },
  ],
  '1B': [
    { id: '6', name: 'Ciarán O\'Brien', grade: '1B', status: 'green', lastActive: new Date(Date.now() - 300000), focasModeActive: true, hasOptedIn: true },
    { id: '7', name: 'Síofra Doherty', grade: '1B', status: 'red', lastActive: new Date(Date.now() - 1800000), focasModeActive: false, hasOptedIn: true },
    { id: '8', name: 'Lorcan Ó Floinn', grade: '1B', status: 'green', lastActive: new Date(Date.now() - 60000), focasModeActive: true, hasOptedIn: false },
    { id: '9', name: 'Aisling Healy', grade: '1B', status: 'green', lastActive: new Date(), focasModeActive: true, hasOptedIn: true },
  ],
  '2A': [
    { id: '10', name: 'Oisín Walsh', grade: '2A', status: 'green', lastActive: new Date(Date.now() - 120000), focasModeActive: true, hasOptedIn: true },
    { id: '11', name: 'Gráinne Ní Shúilleabháin', grade: '2A', status: 'green', lastActive: new Date(), focasModeActive: true, hasOptedIn: true },
    { id: '12', name: 'Fionnán Burke', grade: '2A', status: 'amber', lastActive: new Date(Date.now() - 900000), focasModeActive: true, hasOptedIn: true },
    { id: '13', name: 'Sorcha Kennedy', grade: '2A', status: 'green', lastActive: new Date(Date.now() - 240000), focasModeActive: true, hasOptedIn: false },
    { id: '14', name: 'Daithí Ó Dónaill', grade: '2A', status: 'green', lastActive: new Date(Date.now() - 180000), focasModeActive: true, hasOptedIn: true },
  ],
  '2B': [
    { id: '15', name: 'Niamh Ryan', grade: '2B', status: 'red', lastActive: new Date(Date.now() - 1800000), focasModeActive: false, hasOptedIn: true },
    { id: '16', name: 'Ruairí Mac Giolla Phádraig', grade: '2B', status: 'green', lastActive: new Date(Date.now() - 60000), focasModeActive: true, hasOptedIn: true },
    { id: '17', name: 'Bláithín Whelan', grade: '2B', status: 'green', lastActive: new Date(), focasModeActive: true, hasOptedIn: true },
    { id: '18', name: 'Cathal Ó Ceallaigh', grade: '2B', status: 'green', lastActive: new Date(Date.now() - 300000), focasModeActive: true, hasOptedIn: false },
  ],
  '3A': [
    { id: '19', name: 'Seán Byrne', grade: '3A', status: 'green', lastActive: new Date(Date.now() - 60000), focasModeActive: true, hasOptedIn: true },
    { id: '20', name: 'Caoimhe Doyle', grade: '3A', status: 'green', lastActive: new Date(Date.now() - 180000), focasModeActive: true, hasOptedIn: true },
    { id: '21', name: 'Éanna Ó Riain', grade: '3A', status: 'amber', lastActive: new Date(Date.now() - 600000), focasModeActive: true, hasOptedIn: false },
    { id: '22', name: 'Muireann Gallagher', grade: '3A', status: 'green', lastActive: new Date(), focasModeActive: true, hasOptedIn: true },
    { id: '23', name: 'Pádraic Ó Murchú', grade: '3A', status: 'green', lastActive: new Date(Date.now() - 420000), focasModeActive: true, hasOptedIn: true },
    { id: '24', name: 'Sadhbh Brennan', grade: '3A', status: 'green', lastActive: new Date(Date.now() - 120000), focasModeActive: true, hasOptedIn: true },
  ],
};

const statusConfig: Record<FocusStatus, { icon: React.ElementType; label: string; className: string }> = {
  green: { icon: CheckCircle, label: 'Focused', className: 'text-emerald-500' },
  amber: { icon: AlertTriangle, label: 'Warning', className: 'text-amber-500' },
  red: { icon: XCircle, label: 'Needs Focus', className: 'text-red-500' },
};

export const TeacherClassSchedule = () => {
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(
    teacherClasses.find(c => c.isCurrent) || null
  );

  const students = selectedClass?.yearGroup ? studentsByYearGroup[selectedClass.yearGroup] || [] : [];

  const getClassComplianceStats = (yearGroup: string) => {
    const classStudents = studentsByYearGroup[yearGroup] || [];
    const green = classStudents.filter(s => s.status === 'green').length;
    const amber = classStudents.filter(s => s.status === 'amber').length;
    const red = classStudents.filter(s => s.status === 'red').length;
    return { green, amber, red, total: classStudents.length };
  };

  // If a class is selected, show the student detail view
  if (selectedClass && selectedClass.yearGroup) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-4"
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
            <h3 className="text-lg font-semibold">
              {selectedClass.name} - Year {selectedClass.yearGroup}
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedClass.room} • {selectedClass.startTime} - {selectedClass.endTime}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Enrolled Students</span>
              <Badge variant="outline">{students.length} Students</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {students.map((student, index) => {
              const StatusIcon = statusConfig[student.status].icon;
              return (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{student.name}</p>
                        {!student.hasOptedIn && (
                          <span className="text-xs px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600">
                            Not opted in
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {student.focasModeActive ? 'Fócas Mode Active' : 'Fócas Mode Off'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-5 h-5 ${statusConfig[student.status].className}`} />
                  </div>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Show the class list view
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Today's Classes</h3>
        <p className="text-sm text-muted-foreground">
          Select a class to view enrolled students
        </p>
      </div>

      <div className="space-y-2">
        {teacherClasses.map((classItem, index) => {
          const isBreak = !classItem.yearGroup;
          const stats = !isBreak ? getClassComplianceStats(classItem.yearGroup) : null;

          return (
            <motion.div
              key={classItem.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:bg-muted/50 ${
                  classItem.isCurrent ? 'border-primary' : ''
                }`}
                onClick={() => !isBreak && setSelectedClass(classItem)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {classItem.isCurrent && (
                          <Badge variant="default" className="text-xs">Current</Badge>
                        )}
                        <span className="font-medium">{classItem.name}</span>
                        {!isBreak && (
                          <Badge variant="secondary">{classItem.yearGroup}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {classItem.startTime} - {classItem.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {classItem.room}
                        </span>
                      </div>
                    </div>
                    
                    {!isBreak && stats && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{stats.total}</span>
                        </div>
                        <div className="flex gap-1">
                          {stats.green > 0 && (
                            <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 text-xs flex items-center justify-center font-medium">
                              {stats.green}
                            </span>
                          )}
                          {stats.amber > 0 && (
                            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 text-xs flex items-center justify-center font-medium">
                              {stats.amber}
                            </span>
                          )}
                          {stats.red > 0 && (
                            <span className="w-6 h-6 rounded-full bg-red-500/20 text-red-600 text-xs flex items-center justify-center font-medium">
                              {stats.red}
                            </span>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
