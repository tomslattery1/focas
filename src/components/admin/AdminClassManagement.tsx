import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit2, 
  ChevronDown, 
  ChevronRight,
  GraduationCap,
  BookOpen,
  Search,
  MapPin,
  UserPlus,
  X,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { toast } from 'sonner';

interface Period {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  order: number;
}

interface ClassGroup {
  id: string;
  name: string;
  yearLevel: number;
  teacher?: string;
  room?: string;
  periodId?: string;
  studentIds: string[];
}

interface YearGroup {
  id: string;
  name: string;
  level: number;
  classes: ClassGroup[];
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
}

// Generate initial year groups with all 6 years and 4 classes each
const generateInitialYearGroups = (): YearGroup[] => {
  const teachers = [
    'Ms. Murphy', 'Mr. Walsh', 'Ms. Kelly', 'Mr. Ryan', 'Ms. Byrne', 'Mr. Doyle',
    'Ms. Collins', "Mr. O'Connor", 'Ms. Fitzgerald', 'Mr. Brennan', 'Ms. McCarthy',
    "Mr. O'Sullivan", 'Ms. Kennedy', 'Mr. Lynch', 'Ms. Murray', 'Mr. Quinn',
    'Ms. Moore', 'Mr. McLoughlin', "Ms. O'Neill", 'Mr. Daly', 'Ms. Nolan', 'Mr. Dunne',
    "Ms. O'Brien", 'Mr. Gallagher'
  ];
  
  let teacherIndex = 0;
  const years: YearGroup[] = [];
  
  for (let level = 1; level <= 6; level++) {
    const yearName = level === 1 ? '1st Year' : 
                     level === 2 ? '2nd Year' : 
                     level === 3 ? '3rd Year' : 
                     `${level}th Year`;
    
    const classes: ClassGroup[] = ['A', 'B', 'C', 'D'].map(stream => ({
      id: `${level}${stream.toLowerCase()}`,
      name: `${level}${stream}`,
      yearLevel: level,
      teacher: teachers[teacherIndex++ % teachers.length],
      room: `Room ${level}0${stream.charCodeAt(0) - 64}`,
      studentIds: [],
    }));
    
    years.push({
      id: `y${level}`,
      name: yearName,
      level,
      classes,
    });
  }
  
  return years;
};

const initialYearGroups: YearGroup[] = generateInitialYearGroups();

// Generate mock students - ~25 per class = 600 total
const generateMockStudents = (): Student[] => {
  const firstNames = [
    'Aoife', 'Cian', 'Saoirse', 'Oisin', 'Niamh', 'Sean', 'Emma', 'Liam', 'Grace', 'Jack',
    'Ciara', 'Conor', 'Roisin', 'Eoin', 'Ava', 'Darragh', 'Caoimhe', 'Fionn', 'Sophie', 'Cathal',
    'Ella', 'Tadhg', 'Lucy', 'Rian', 'Mia', 'Cillian', 'Anna', 'Dara', 'Emily', 'Seamus',
    'Molly', 'Padraig', 'Sarah', 'Ruairi', 'Leah', 'Declan', 'Katie', 'Colm', 'Rachel', 'Brendan',
    'Orla', 'Killian', 'Sinead', 'Donnacha', 'Clodagh', 'Lorcan', 'Ailbhe', 'Ronan', 'Meadhbh', 'Diarmuid'
  ];
  const lastNames = [
    'Ryan', 'Kelly', 'Byrne', 'Murphy', 'Walsh', 'Doyle', 'Collins', "O'Connor", 'Fitzgerald', 'Brennan',
    'McCarthy', "O'Sullivan", 'Kennedy', 'Lynch', 'Murray', 'Quinn', 'Moore', 'McLoughlin', "O'Neill", 'Daly',
    'Nolan', 'Dunne', "O'Brien", 'Gallagher', 'Burke', 'Power', 'Healy', 'Connolly', 'Foley', 'Kavanagh'
  ];
  
  const students: Student[] = [];
  for (let i = 1; i <= 600; i++) {
    students.push({
      id: `s${i}`,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    });
  }
  return students;
};

const mockStudents: Student[] = generateMockStudents();

const availableTeachers = [
  'Ms. Murphy', 'Mr. Walsh', 'Ms. Kelly', 'Mr. Ryan', 'Ms. Byrne', 'Mr. Doyle',
  'Ms. Collins', "Mr. O'Connor", 'Ms. Fitzgerald', 'Mr. Brennan', 'Ms. McCarthy',
  "Mr. O'Sullivan", 'Ms. Kennedy', 'Mr. Lynch', 'Ms. Murray', 'Mr. Quinn',
  'Ms. Moore', 'Mr. McLoughlin', "Ms. O'Neill", 'Mr. Daly', 'Ms. Nolan', 'Mr. Dunne',
  "Ms. O'Brien", 'Mr. Gallagher', 'Ms. Moran', "Mr. O'Reilly", 'Ms. Hickey', 'Mr. Crowley',
  'Ms. Hogan', 'Mr. Barry', 'Ms. Keane', "Mr. O'Rourke", 'Ms. Whelan', 'Mr. Doherty',
  'Ms. Sweeney', 'Mr. Buckley', "Ms. O'Shea", 'Mr. Duffy', 'Ms. Farrell', 'Mr. Regan'
];

const availableRooms = [
  'Room 101', 'Room 102', 'Room 103', 'Room 104',
  'Room 201', 'Room 202', 'Room 203', 'Room 204',
  'Room 301', 'Room 302', 'Room 303', 'Room 304',
  'Room 401', 'Room 402', 'Room 403', 'Room 404',
  'Room 501', 'Room 502', 'Room 503', 'Room 504',
  'Room 601', 'Room 602', 'Room 603', 'Room 604',
  'Science Lab 1', 'Science Lab 2', 'Science Lab 3',
  'Computer Lab 1', 'Computer Lab 2',
  'Art Room', 'Music Room', 'PE Hall', 'Library',
];

const defaultPeriods: Period[] = [
  { id: 'p1', name: 'Period 1', startTime: '08:50', endTime: '09:40', order: 1 },
  { id: 'p2', name: 'Period 2', startTime: '09:45', endTime: '10:35', order: 2 },
  { id: 'p3', name: 'Period 3', startTime: '10:55', endTime: '11:45', order: 4 },
  { id: 'p4', name: 'Period 4', startTime: '11:50', endTime: '12:40', order: 5 },
  { id: 'p5', name: 'Period 5', startTime: '13:20', endTime: '14:10', order: 7 },
  { id: 'p6', name: 'Period 6', startTime: '14:15', endTime: '15:05', order: 8 },
];

export const AdminClassManagement = () => {
  const [yearGroups, setYearGroups] = useState<YearGroup[]>(() => {
    const saved = localStorage.getItem('focas_year_groups');
    return saved ? JSON.parse(saved) : initialYearGroups;
  });
  const [allStudents] = useState<Student[]>(mockStudents);
  const [expandedYears, setExpandedYears] = useState<string[]>(['y6']);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Periods from schedule
  const [periods, setPeriods] = useState<Period[]>(() => {
    const saved = localStorage.getItem('focas_periods');
    if (saved) {
      const allPeriods: Period[] = JSON.parse(saved);
      // Filter out break/lunch periods
      return allPeriods.filter(p => 
        !p.name.toLowerCase().includes('break') && 
        !p.name.toLowerCase().includes('lunch')
      );
    }
    return defaultPeriods;
  });
  
  // Dialog states
  const [showAddYearDialog, setShowAddYearDialog] = useState(false);
  const [showAddClassDialog, setShowAddClassDialog] = useState(false);
  const [showEditClassDialog, setShowEditClassDialog] = useState(false);
  const [showStudentsDialog, setShowStudentsDialog] = useState(false);
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [classToDelete, setClassToDelete] = useState<{ yearId: string; classId: string } | null>(null);
  
  // Form states
  const [newYear, setNewYear] = useState({ name: '', level: 1 });
  const [selectedYearForClass, setSelectedYearForClass] = useState<string>('');
  const [newClass, setNewClass] = useState({ name: '', teacher: '', room: '', periodId: '' });
  const [editingClass, setEditingClass] = useState<ClassGroup | null>(null);
  const [editingClassYearId, setEditingClassYearId] = useState<string>('');
  const [managingStudentsClass, setManagingStudentsClass] = useState<{ classId: string; yearId: string } | null>(null);
  const [selectedStudentsToAdd, setSelectedStudentsToAdd] = useState<string[]>([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');

  // Bulk reassign states
  const [sourceClass, setSourceClass] = useState('');
  const [targetClass, setTargetClass] = useState('');
  const [selectedStudentsForReassign, setSelectedStudentsForReassign] = useState<string[]>([]);

  // Persist year groups to localStorage
  const saveYearGroups = (groups: YearGroup[]) => {
    setYearGroups(groups);
    localStorage.setItem('focas_year_groups', JSON.stringify(groups));
  };

  const getPeriodName = (periodId?: string): string => {
    if (!periodId) return '';
    const period = periods.find(p => p.id === periodId);
    return period ? `${period.name} (${period.startTime})` : '';
  };

  const toggleYear = (yearId: string) => {
    setExpandedYears(prev => 
      prev.includes(yearId) 
        ? prev.filter(id => id !== yearId)
        : [...prev, yearId]
    );
  };

  const getStudentsInClass = (classId: string): Student[] => {
    const classGroup = yearGroups.flatMap(y => y.classes).find(c => c.id === classId);
    if (!classGroup) return [];
    return allStudents.filter(s => classGroup.studentIds.includes(s.id));
  };

  const getStudentCount = (classId: string): number => {
    const classGroup = yearGroups.flatMap(y => y.classes).find(c => c.id === classId);
    return classGroup?.studentIds.length || 0;
  };

  const getAvailableStudents = (): Student[] => {
    const assignedStudentIds = yearGroups.flatMap(y => y.classes.flatMap(c => c.studentIds));
    return allStudents.filter(s => !assignedStudentIds.includes(s.id));
  };

  const handleAddYear = () => {
    if (!newYear.name.trim()) {
      toast.error('Please enter a year name');
      return;
    }

    const yearGroup: YearGroup = {
      id: `y${Date.now()}`,
      name: newYear.name.trim(),
      level: newYear.level,
      classes: [],
    };

    setYearGroups(prev => [...prev, yearGroup].sort((a, b) => a.level - b.level));
    setNewYear({ name: '', level: 1 });
    setShowAddYearDialog(false);
    toast.success(`${yearGroup.name} added`);
  };

  const handleAddClass = () => {
    if (!newClass.name.trim() || !selectedYearForClass) {
      toast.error('Please fill in all required fields');
      return;
    }

    const yearGroup = yearGroups.find(y => y.id === selectedYearForClass);
    if (!yearGroup) return;

    const classGroup: ClassGroup = {
      id: `c${Date.now()}`,
      name: newClass.name.trim(),
      yearLevel: yearGroup.level,
      teacher: newClass.teacher || undefined,
      room: newClass.room || undefined,
      periodId: newClass.periodId || undefined,
      studentIds: [],
    };

    const updatedGroups = yearGroups.map(y => 
      y.id === selectedYearForClass 
        ? { ...y, classes: [...y.classes, classGroup] }
        : y
    );
    saveYearGroups(updatedGroups);
    setNewClass({ name: '', teacher: '', room: '', periodId: '' });
    setSelectedYearForClass('');
    setShowAddClassDialog(false);
    toast.success(`Class ${classGroup.name} added to ${yearGroup.name}`);
  };

  const handleEditClass = () => {
    if (!editingClass) return;

    const updatedGroups = yearGroups.map(y => ({
      ...y,
      classes: y.classes.map(c => 
        c.id === editingClass.id ? editingClass : c
      ),
    }));
    saveYearGroups(updatedGroups);
    setEditingClass(null);
    setEditingClassYearId('');
    setShowEditClassDialog(false);
    toast.success('Class updated');
  };

  const handleDeleteClass = () => {
    if (!classToDelete) return;

    setYearGroups(prev => prev.map(y => 
      y.id === classToDelete.yearId
        ? { ...y, classes: y.classes.filter(c => c.id !== classToDelete.classId) }
        : y
    ));
    
    const deletedClass = yearGroups
      .find(y => y.id === classToDelete.yearId)
      ?.classes.find(c => c.id === classToDelete.classId);
    
    toast.success(`Class ${deletedClass?.name} removed`);
    setClassToDelete(null);
  };

  const handleOpenStudentsDialog = (classId: string, yearId: string) => {
    setManagingStudentsClass({ classId, yearId });
    setSelectedStudentsToAdd([]);
    setStudentSearchQuery('');
    setShowStudentsDialog(true);
  };

  const handleAddStudentsToClass = () => {
    if (!managingStudentsClass || selectedStudentsToAdd.length === 0) return;

    setYearGroups(prev => prev.map(y => 
      y.id === managingStudentsClass.yearId
        ? {
            ...y,
            classes: y.classes.map(c => 
              c.id === managingStudentsClass.classId
                ? { ...c, studentIds: [...c.studentIds, ...selectedStudentsToAdd] }
                : c
            ),
          }
        : y
    ));

    toast.success(`${selectedStudentsToAdd.length} student(s) added`);
    setSelectedStudentsToAdd([]);
  };

  const handleRemoveStudentFromClass = (studentId: string) => {
    if (!managingStudentsClass) return;

    setYearGroups(prev => prev.map(y => 
      y.id === managingStudentsClass.yearId
        ? {
            ...y,
            classes: y.classes.map(c => 
              c.id === managingStudentsClass.classId
                ? { ...c, studentIds: c.studentIds.filter(id => id !== studentId) }
                : c
            ),
          }
        : y
    ));

    const student = allStudents.find(s => s.id === studentId);
    toast.success(`${student?.firstName} ${student?.lastName} removed from class`);
  };

  const handleBulkReassign = () => {
    if (!sourceClass || !targetClass || selectedStudentsForReassign.length === 0) {
      toast.error('Please select source, target class, and students');
      return;
    }

    setYearGroups(prev => prev.map(y => ({
      ...y,
      classes: y.classes.map(c => {
        if (c.id === sourceClass) {
          return { ...c, studentIds: c.studentIds.filter(id => !selectedStudentsForReassign.includes(id)) };
        }
        if (c.id === targetClass) {
          return { ...c, studentIds: [...c.studentIds, ...selectedStudentsForReassign] };
        }
        return c;
      }),
    })));

    const targetClassName = yearGroups
      .flatMap(y => y.classes)
      .find(c => c.id === targetClass)?.name;

    toast.success(`${selectedStudentsForReassign.length} students moved to ${targetClassName}`);
    setSelectedStudentsForReassign([]);
    setSourceClass('');
    setTargetClass('');
    setShowReassignDialog(false);
  };

  const allClasses = yearGroups.flatMap(y => 
    y.classes.map(c => ({ ...c, yearName: y.name, yearId: y.id }))
  );

  const filteredYearGroups = yearGroups.map(y => ({
    ...y,
    classes: y.classes.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacher?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.room?.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(y => y.classes.length > 0 || !searchQuery);

  const totalStudents = yearGroups.reduce((sum, y) => 
    sum + y.classes.reduce((classSum, c) => classSum + c.studentIds.length, 0), 0
  );

  const totalClasses = yearGroups.reduce((sum, y) => sum + y.classes.length, 0);

  const filteredAvailableStudents = getAvailableStudents().filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Class Management</h2>
            <p className="text-sm text-muted-foreground">
              Manage year groups, classes, teachers, rooms, and students
            </p>
          </div>
          <Button onClick={() => setShowReassignDialog(true)} variant="outline" className="gap-2">
            <Users className="w-4 h-4" />
            Reassign Students
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setShowAddYearDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Year Group
          </Button>
          <Button size="sm" variant="outline" onClick={() => setShowAddClassDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Class
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="p-4 rounded-xl bg-card border text-center">
          <p className="text-2xl font-semibold">{yearGroups.length}</p>
          <p className="text-xs text-muted-foreground">Year Groups</p>
        </div>
        <div className="p-4 rounded-xl bg-card border text-center">
          <p className="text-2xl font-semibold text-blue-600">{totalClasses}</p>
          <p className="text-xs text-muted-foreground">Classes</p>
        </div>
        <div className="p-4 rounded-xl bg-card border text-center">
          <p className="text-2xl font-semibold text-green-600">{totalStudents}</p>
          <p className="text-xs text-muted-foreground">Students Assigned</p>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search classes, teachers, or rooms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Year Groups */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        {filteredYearGroups.map((yearGroup) => (
          <Collapsible
            key={yearGroup.id}
            open={expandedYears.includes(yearGroup.id)}
            onOpenChange={() => toggleYear(yearGroup.id)}
          >
            <div className="rounded-xl bg-card border overflow-hidden">
              <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">{yearGroup.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {yearGroup.classes.length} classes • {yearGroup.classes.reduce((sum, c) => sum + c.studentIds.length, 0)} students
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{yearGroup.classes.length} classes</Badge>
                  {expandedYears.includes(yearGroup.id) ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="border-t p-3 space-y-2 bg-muted/30">
                  {yearGroup.classes.map((classGroup) => (
                    <div
                      key={classGroup.id}
                      className="p-3 rounded-lg bg-background border flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm">{classGroup.name}</h4>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                            <span>{classGroup.teacher || 'No teacher'}</span>
                            {classGroup.room && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {classGroup.room}
                              </span>
                            )}
                            {classGroup.periodId && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {getPeriodName(classGroup.periodId)}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {classGroup.studentIds.length} students
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleOpenStudentsDialog(classGroup.id, yearGroup.id)}
                          title="Manage students"
                        >
                          <UserPlus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingClass(classGroup);
                            setEditingClassYearId(yearGroup.id);
                            setShowEditClassDialog(true);
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setClassToDelete({ yearId: yearGroup.id, classId: classGroup.id })}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {yearGroup.classes.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No classes in this year group
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}

        {filteredYearGroups.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No year groups found</p>
          </div>
        )}
      </motion.div>

      {/* Add Year Group Dialog */}
      <Dialog open={showAddYearDialog} onOpenChange={setShowAddYearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Year Group</DialogTitle>
            <DialogDescription>
              Create a new year group to organize classes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="yearName">Year Group Name</Label>
              <Input
                id="yearName"
                placeholder="e.g., 1st Year, 6th Year"
                value={newYear.name}
                onChange={(e) => setNewYear(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="yearLevel">Year Level</Label>
              <Select 
                value={newYear.level.toString()} 
                onValueChange={(v) => setNewYear(prev => ({ ...prev, level: parseInt(v) }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map(level => (
                    <SelectItem key={level} value={level.toString()}>
                      Level {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddYearDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddYear}>Add Year Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Class Dialog */}
      <Dialog open={showAddClassDialog} onOpenChange={setShowAddClassDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Class</DialogTitle>
            <DialogDescription>
              Add a new class to a year group with teacher and room assignment.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Year Group</Label>
              <Select 
                value={selectedYearForClass} 
                onValueChange={setSelectedYearForClass}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year group" />
                </SelectTrigger>
                <SelectContent>
                  {yearGroups.map(y => (
                    <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="className">Class Name</Label>
              <Input
                id="className"
                placeholder="e.g., 6A, 6B"
                value={newClass.name}
                onChange={(e) => setNewClass(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Assign Teacher (optional)</Label>
              <Select 
                value={newClass.teacher} 
                onValueChange={(v) => setNewClass(prev => ({ ...prev, teacher: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {availableTeachers.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assign Room (optional)</Label>
              <Select 
                value={newClass.room} 
                onValueChange={(v) => setNewClass(prev => ({ ...prev, room: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {availableRooms.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assign Period (optional)</Label>
              <Select 
                value={newClass.periodId} 
                onValueChange={(v) => setNewClass(prev => ({ ...prev, periodId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map(p => (
                    <SelectItem key={p.id} value={p.id}>
                      <span className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {p.name} ({p.startTime} - {p.endTime})
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddClassDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddClass}>Add Class</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={showEditClassDialog} onOpenChange={setShowEditClassDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              Update class details, teacher, and room assignment.
            </DialogDescription>
          </DialogHeader>
          
          {editingClass && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="editClassName">Class Name</Label>
                <Input
                  id="editClassName"
                  value={editingClass.name}
                  onChange={(e) => setEditingClass(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Assign Teacher</Label>
                <Select 
                  value={editingClass.teacher || ''} 
                  onValueChange={(v) => setEditingClass(prev => prev ? { ...prev, teacher: v } : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTeachers.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assign Room</Label>
                <Select 
                  value={editingClass.room || ''} 
                  onValueChange={(v) => setEditingClass(prev => prev ? { ...prev, room: v } : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Assign Period</Label>
                <Select 
                  value={editingClass.periodId || ''} 
                  onValueChange={(v) => setEditingClass(prev => prev ? { ...prev, periodId: v } : null)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map(p => (
                      <SelectItem key={p.id} value={p.id}>
                        <span className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {p.name} ({p.startTime} - {p.endTime})
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditClassDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditClass}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Students Dialog */}
      <Dialog open={showStudentsDialog} onOpenChange={setShowStudentsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage Students</DialogTitle>
            <DialogDescription>
              Add or remove students from this class.
            </DialogDescription>
          </DialogHeader>
          
          {managingStudentsClass && (
            <div className="space-y-4 py-4">
              {/* Current students */}
              <div className="space-y-2">
                <Label>Current Students ({getStudentsInClass(managingStudentsClass.classId).length})</Label>
                <ScrollArea className="h-32 rounded-lg border p-2">
                  {getStudentsInClass(managingStudentsClass.classId).length > 0 ? (
                    <div className="space-y-1">
                      {getStudentsInClass(managingStudentsClass.classId).map(student => (
                        <div key={student.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="text-sm">{student.firstName} {student.lastName}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveStudentFromClass(student.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No students assigned</p>
                  )}
                </ScrollArea>
              </div>

              {/* Add students */}
              <div className="space-y-2">
                <Label>Add Students</Label>
                <Input
                  placeholder="Search students..."
                  value={studentSearchQuery}
                  onChange={(e) => setStudentSearchQuery(e.target.value)}
                />
                <ScrollArea className="h-40 rounded-lg border p-2">
                  {filteredAvailableStudents.length > 0 ? (
                    <div className="space-y-1">
                      {filteredAvailableStudents.map(student => (
                        <div key={student.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50">
                          <Checkbox
                            id={student.id}
                            checked={selectedStudentsToAdd.includes(student.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedStudentsToAdd(prev => [...prev, student.id]);
                              } else {
                                setSelectedStudentsToAdd(prev => prev.filter(id => id !== student.id));
                              }
                            }}
                          />
                          <label htmlFor={student.id} className="text-sm cursor-pointer flex-1">
                            {student.firstName} {student.lastName}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No available students</p>
                  )}
                </ScrollArea>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStudentsDialog(false)}>
              Close
            </Button>
            <Button 
              onClick={handleAddStudentsToClass}
              disabled={selectedStudentsToAdd.length === 0}
            >
              Add {selectedStudentsToAdd.length} Student(s)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Reassign Dialog */}
      <Dialog open={showReassignDialog} onOpenChange={setShowReassignDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Reassign Students</DialogTitle>
            <DialogDescription>
              Move students between classes.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Source Class</Label>
              <Select 
                value={sourceClass} 
                onValueChange={(v) => {
                  setSourceClass(v);
                  setSelectedStudentsForReassign([]);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class to move students from" />
                </SelectTrigger>
                <SelectContent>
                  {allClasses.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.yearName}) - {c.studentIds.length} students
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {sourceClass && (
              <div className="space-y-2">
                <Label>Select Students to Move</Label>
                <ScrollArea className="h-32 rounded-lg border p-2">
                  {getStudentsInClass(sourceClass).length > 0 ? (
                    <div className="space-y-1">
                      {getStudentsInClass(sourceClass).map(student => (
                        <div key={student.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50">
                          <Checkbox
                            id={`reassign-${student.id}`}
                            checked={selectedStudentsForReassign.includes(student.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedStudentsForReassign(prev => [...prev, student.id]);
                              } else {
                                setSelectedStudentsForReassign(prev => prev.filter(id => id !== student.id));
                              }
                            }}
                          />
                          <label htmlFor={`reassign-${student.id}`} className="text-sm cursor-pointer flex-1">
                            {student.firstName} {student.lastName}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No students in this class</p>
                  )}
                </ScrollArea>
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Target Class</Label>
              <Select value={targetClass} onValueChange={setTargetClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination class" />
                </SelectTrigger>
                <SelectContent>
                  {allClasses.filter(c => c.id !== sourceClass).map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.yearName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReassignDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleBulkReassign}
              disabled={selectedStudentsForReassign.length === 0 || !targetClass}
            >
              Move {selectedStudentsForReassign.length} Students
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Class Confirmation */}
      <AlertDialog open={!!classToDelete} onOpenChange={(open) => !open && setClassToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this class? Students in this class will need to be reassigned.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteClass}
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
