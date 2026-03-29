import { useState, useEffect } from 'react';
import { Plus, Users, BookOpen, Pencil, Trash2, Upload, Download, Search, ChevronDown, ChevronRight, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface Student {
  id: string;
  name: string;
  baseClass: string;
  yearGroup: string;
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
  students: string[]; // student IDs
  schedule?: ScheduleSlot[]; // when this group meets
}

interface YearSubjectGroups {
  yearGroup: string;
  subjects: SubjectGroup[];
}

const subjects = [
  'Maths',
  'English',
  'Irish',
  'Science',
  'History',
  'Geography',
  'French',
  'German',
  'Spanish',
  'Art',
  'Music',
  'PE',
  'CSPE',
  'Business',
  'Technology',
];

const levels = ['Higher', 'Ordinary', 'Foundation', 'Mixed'];

const availableTeachers = [
  'Ms. O\'Brien',
  'Mr. Murphy',
  'Ms. Kelly',
  'Mr. Walsh',
  'Ms. Byrne',
  'Mr. Ryan',
  'Ms. Doyle',
  'Mr. McCarthy',
  'Ms. Sullivan',
  'Mr. Connolly',
  'Ms. Gallagher',
  'Mr. Fitzgerald',
];

const generateMockStudents = (): Student[] => {
  const firstNames = ['Aoife', 'Cian', 'Saoirse', 'Oisin', 'Niamh', 'Conor', 'Ciara', 'Sean', 'Roisin', 'Darragh', 'Ava', 'Liam', 'Emma', 'Jack', 'Sophie', 'James', 'Grace', 'Daniel', 'Lucy', 'Michael'];
  const lastNames = ['Murphy', 'Kelly', 'O\'Sullivan', 'Walsh', 'Smith', 'O\'Brien', 'Byrne', 'Ryan', 'O\'Connor', 'O\'Neill', 'Doyle', 'McCarthy', 'Gallagher', 'Doherty', 'Kennedy', 'Lynch', 'Murray', 'Quinn', 'Moore', 'McLoughlin'];
  
  const students: Student[] = [];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', '6th Year'];
  const classes = ['A', 'B', 'C', 'D'];
  
  years.forEach((year) => {
    classes.forEach((cls) => {
      for (let i = 0; i < 25; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        students.push({
          id: `${year}-${cls}-${i}`,
          name: `${firstName} ${lastName}`,
          baseClass: `${year.charAt(0)}${cls}`,
          yearGroup: year,
        });
      }
    });
  });
  
  return students;
};

const generateInitialSubjectGroups = (): YearSubjectGroups[] => {
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', '6th Year'];
  
  return years.map((year) => ({
    yearGroup: year,
    subjects: [
      {
        id: `${year}-maths-higher`,
        subject: 'Maths',
        level: 'Higher',
        teacher: 'Mr. Murphy',
        yearGroup: year,
        students: [],
      },
      {
        id: `${year}-maths-ordinary`,
        subject: 'Maths',
        level: 'Ordinary',
        teacher: 'Ms. Kelly',
        yearGroup: year,
        students: [],
      },
      {
        id: `${year}-maths-foundation`,
        subject: 'Maths',
        level: 'Foundation',
        teacher: 'Mr. Walsh',
        yearGroup: year,
        students: [],
      },
    ],
  }));
};

export const AdminSubjectGroups = () => {
  const [yearSubjectGroups, setYearSubjectGroups] = useState<YearSubjectGroups[]>([]);
  const [allStudents] = useState<Student[]>(generateMockStudents);
  const [expandedYears, setExpandedYears] = useState<string[]>(['1st Year']);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Dialog states
  const [showAddGroupDialog, setShowAddGroupDialog] = useState(false);
  const [showEditGroupDialog, setShowEditGroupDialog] = useState(false);
  const [showManageStudentsDialog, setShowManageStudentsDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  
  // Form states
  const [selectedYearGroup, setSelectedYearGroup] = useState('1st Year');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [editingGroup, setEditingGroup] = useState<SubjectGroup | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleSlot[]>([]);
  
  // Periods from localStorage
  const [periods, setPeriods] = useState<{ id: string; name: string; startTime: string; endTime: string }[]>([]);
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  useEffect(() => {
    const saved = localStorage.getItem('adminSubjectGroups');
    if (saved) {
      setYearSubjectGroups(JSON.parse(saved));
    } else {
      setYearSubjectGroups(generateInitialSubjectGroups());
    }
  }, []);

  useEffect(() => {
    const savedPeriods = localStorage.getItem('focas_periods');
    if (savedPeriods) {
      setPeriods(JSON.parse(savedPeriods));
    }
  }, []);

  useEffect(() => {
    if (yearSubjectGroups.length > 0) {
      localStorage.setItem('adminSubjectGroups', JSON.stringify(yearSubjectGroups));
    }
  }, [yearSubjectGroups]);

  const toggleYear = (year: string) => {
    setExpandedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  const handleAddGroup = () => {
    if (!selectedSubject || !selectedLevel || !selectedTeacher) {
      toast.error('Please fill in all fields');
      return;
    }

    const newGroup: SubjectGroup = {
      id: `${selectedYearGroup}-${selectedSubject.toLowerCase()}-${selectedLevel.toLowerCase()}-${Date.now()}`,
      subject: selectedSubject,
      level: selectedLevel,
      teacher: selectedTeacher,
      yearGroup: selectedYearGroup,
      students: [],
    };

    setYearSubjectGroups((prev) =>
      prev.map((ysg) =>
        ysg.yearGroup === selectedYearGroup
          ? { ...ysg, subjects: [...ysg.subjects, newGroup] }
          : ysg
      )
    );

    toast.success(`Added ${selectedSubject} ${selectedLevel} group`);
    setShowAddGroupDialog(false);
    resetForm();
  };

  const handleEditGroup = () => {
    if (!editingGroup || !selectedSubject || !selectedLevel || !selectedTeacher) {
      toast.error('Please fill in all fields');
      return;
    }

    setYearSubjectGroups((prev) =>
      prev.map((ysg) =>
        ysg.yearGroup === editingGroup.yearGroup
          ? {
              ...ysg,
              subjects: ysg.subjects.map((sg) =>
                sg.id === editingGroup.id
                  ? { ...sg, subject: selectedSubject, level: selectedLevel, teacher: selectedTeacher }
                  : sg
              ),
            }
          : ysg
      )
    );

    toast.success('Group updated');
    setShowEditGroupDialog(false);
    setEditingGroup(null);
    resetForm();
  };

  const handleDeleteGroup = () => {
    if (!editingGroup) return;

    setYearSubjectGroups((prev) =>
      prev.map((ysg) =>
        ysg.yearGroup === editingGroup.yearGroup
          ? { ...ysg, subjects: ysg.subjects.filter((sg) => sg.id !== editingGroup.id) }
          : ysg
      )
    );

    toast.success('Group deleted');
    setShowDeleteDialog(false);
    setEditingGroup(null);
  };

  const handleSaveStudents = () => {
    if (!editingGroup) return;

    setYearSubjectGroups((prev) =>
      prev.map((ysg) =>
        ysg.yearGroup === editingGroup.yearGroup
          ? {
              ...ysg,
              subjects: ysg.subjects.map((sg) =>
                sg.id === editingGroup.id ? { ...sg, students: selectedStudents } : sg
              ),
            }
          : ysg
      )
    );

    toast.success(`${selectedStudents.length} students assigned`);
    setShowManageStudentsDialog(false);
    setEditingGroup(null);
    setSelectedStudents([]);
  };

  const openEditDialog = (group: SubjectGroup) => {
    setEditingGroup(group);
    setSelectedSubject(group.subject);
    setSelectedLevel(group.level);
    setSelectedTeacher(group.teacher);
    setShowEditGroupDialog(true);
  };

  const openManageStudentsDialog = (group: SubjectGroup) => {
    setEditingGroup(group);
    setSelectedStudents(group.students);
    setStudentSearchQuery('');
    setShowManageStudentsDialog(true);
  };

  const openDeleteDialog = (group: SubjectGroup) => {
    setEditingGroup(group);
    setShowDeleteDialog(true);
  };

  const openScheduleDialog = (group: SubjectGroup) => {
    setEditingGroup(group);
    setSelectedSchedule(group.schedule || []);
    setShowScheduleDialog(true);
  };

  const handleSaveSchedule = () => {
    if (!editingGroup) return;

    setYearSubjectGroups((prev) =>
      prev.map((ysg) =>
        ysg.yearGroup === editingGroup.yearGroup
          ? {
              ...ysg,
              subjects: ysg.subjects.map((sg) =>
                sg.id === editingGroup.id ? { ...sg, schedule: selectedSchedule } : sg
              ),
            }
          : ysg
      )
    );

    toast.success(`Schedule updated with ${selectedSchedule.length} time slots`);
    setShowScheduleDialog(false);
    setEditingGroup(null);
    setSelectedSchedule([]);
  };

  const toggleScheduleSlot = (day: string, periodId: string) => {
    const exists = selectedSchedule.some(s => s.day === day && s.periodId === periodId);
    if (exists) {
      setSelectedSchedule(prev => prev.filter(s => !(s.day === day && s.periodId === periodId)));
    } else {
      setSelectedSchedule(prev => [...prev, { day, periodId }]);
    }
  };

  const isSlotSelected = (day: string, periodId: string) => {
    return selectedSchedule.some(s => s.day === day && s.periodId === periodId);
  };

  const isBreakPeriod = (period: { name: string }) =>
    period.name.toLowerCase().includes('break') || 
    period.name.toLowerCase().includes('lunch');

  const resetForm = () => {
    setSelectedSubject('');
    setSelectedLevel('');
    setSelectedTeacher('');
  };

  const handleImportCSV = () => {
    toast.success('CSV import functionality would be implemented here');
    setShowImportDialog(false);
  };

  const handleExportCSV = (group: SubjectGroup) => {
    const studentsInGroup = allStudents.filter((s) => group.students.includes(s.id));
    const csvContent = [
      ['Student ID', 'Name', 'Base Class', 'Subject', 'Level', 'Teacher'].join(','),
      ...studentsInGroup.map((s) =>
        [s.id, s.name, s.baseClass, group.subject, group.level, group.teacher].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${group.subject}-${group.level}-${group.yearGroup}.csv`;
    a.click();
    toast.success('Exported to CSV');
  };

  const filteredYearGroups = yearSubjectGroups.filter((ysg) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      ysg.yearGroup.toLowerCase().includes(query) ||
      ysg.subjects.some(
        (sg) =>
          sg.subject.toLowerCase().includes(query) ||
          sg.level.toLowerCase().includes(query) ||
          sg.teacher.toLowerCase().includes(query)
      )
    );
  });

  const getStudentsForYear = (yearGroup: string) =>
    allStudents.filter((s) => s.yearGroup === yearGroup);

  const filteredStudentsForDialog = editingGroup
    ? getStudentsForYear(editingGroup.yearGroup).filter((s) =>
        s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
        s.baseClass.toLowerCase().includes(studentSearchQuery.toLowerCase())
      )
    : [];

  const totalGroups = yearSubjectGroups.reduce((acc, ysg) => acc + ysg.subjects.length, 0);
  const totalAssignments = yearSubjectGroups.reduce(
    (acc, ysg) => acc + ysg.subjects.reduce((a, sg) => a + sg.students.length, 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Button onClick={() => setShowAddGroupDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Subject Group
          </Button>
          <Button variant="outline" onClick={() => setShowImportDialog(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{totalGroups}</div>
            <p className="text-sm text-muted-foreground">Subject Groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{totalAssignments}</div>
            <p className="text-sm text-muted-foreground">Student Assignments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{allStudents.length}</div>
            <p className="text-sm text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search subjects, levels, teachers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Year Groups with Subject Groups */}
      <div className="space-y-4">
        {filteredYearGroups.map((ysg) => (
          <Collapsible
            key={ysg.yearGroup}
            open={expandedYears.includes(ysg.yearGroup)}
            onOpenChange={() => toggleYear(ysg.yearGroup)}
          >
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {expandedYears.includes(ysg.yearGroup) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                      <CardTitle className="text-lg">{ysg.yearGroup}</CardTitle>
                      <Badge variant="secondary">{ysg.subjects.length} groups</Badge>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0">
                  {ysg.subjects.length === 0 ? (
                    <p className="text-muted-foreground text-sm py-4">
                      No subject groups created yet. Click "Add Subject Group" to get started.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Level</TableHead>
                          <TableHead>Teacher</TableHead>
                          <TableHead>Students</TableHead>
                          <TableHead>Schedule</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ysg.subjects.map((group) => (
                          <TableRow key={group.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-muted-foreground" />
                                {group.subject}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{group.level}</Badge>
                            </TableCell>
                            <TableCell>{group.teacher}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openManageStudentsDialog(group)}
                                className="gap-1"
                              >
                                <Users className="w-4 h-4" />
                                {group.students.length}
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openScheduleDialog(group)}
                                className="gap-1"
                              >
                                <Calendar className="w-4 h-4" />
                                {group.schedule?.length || 0} slots
                              </Button>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleExportCSV(group)}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openEditDialog(group)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => openDeleteDialog(group)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>

      {/* Add Group Dialog */}
      <Dialog open={showAddGroupDialog} onOpenChange={setShowAddGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Subject Group</DialogTitle>
            <DialogDescription>
              Create a new subject group for streaming or ability-based classes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Year Group</Label>
              <Select value={selectedYearGroup} onValueChange={setSelectedYearGroup}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year', '6th Year'].map(
                    (year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level / Stream</Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Teacher</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {availableTeachers.map((teacher) => (
                    <SelectItem key={teacher} value={teacher}>
                      {teacher}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddGroupDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddGroup}>Add Group</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Group Dialog */}
      <Dialog open={showEditGroupDialog} onOpenChange={setShowEditGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Level / Stream</Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Teacher</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTeachers.map((teacher) => (
                    <SelectItem key={teacher} value={teacher}>
                      {teacher}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditGroupDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditGroup}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Students Dialog */}
      <Dialog open={showManageStudentsDialog} onOpenChange={setShowManageStudentsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Manage Students - {editingGroup?.subject} {editingGroup?.level}
            </DialogTitle>
            <DialogDescription>
              Select students from {editingGroup?.yearGroup} to assign to this group.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={studentSearchQuery}
                onChange={(e) => setStudentSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>{selectedStudents.length} students selected</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSelectedStudents(filteredStudentsForDialog.map((s) => s.id))
                  }
                >
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedStudents([])}>
                  Clear
                </Button>
              </div>
            </div>
            <ScrollArea className="h-[300px] border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Base Class</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudentsForDialog.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStudents((prev) => [...prev, student.id]);
                            } else {
                              setSelectedStudents((prev) =>
                                prev.filter((id) => id !== student.id)
                              );
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.baseClass}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowManageStudentsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStudents}>Save ({selectedStudents.length})</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subject Group?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {editingGroup?.subject} {editingGroup?.level} and
              remove all student assignments. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGroup}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import CSV Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Subject Groups from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with columns: Student ID, Subject, Level
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag and drop your CSV file here, or click to browse
              </p>
              <Input type="file" accept=".csv" className="mt-4" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImportCSV}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Schedule: {editingGroup?.subject} {editingGroup?.level}
            </DialogTitle>
            <DialogDescription>
              Click on time slots to assign when this group meets. Selected slots are highlighted.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {periods.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No periods configured.</p>
                <p className="text-sm">Go to Schedule → Periods to set up your school timetable first.</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="min-w-[600px]">
                  {/* Header row with days */}
                  <div className="grid grid-cols-[100px_repeat(5,1fr)] gap-1 mb-2">
                    <div className="p-2 text-sm font-medium text-center">Period</div>
                    {days.map((day) => (
                      <div key={day} className="p-2 text-sm font-medium text-center bg-muted rounded">
                        {day.slice(0, 3)}
                      </div>
                    ))}
                  </div>

                  {/* Period rows */}
                  {periods
                    .filter((p) => !isBreakPeriod(p))
                    .map((period) => (
                      <div key={period.id} className="grid grid-cols-[100px_repeat(5,1fr)] gap-1 mb-1">
                        <div className="p-2 text-xs text-center border rounded bg-card">
                          <div className="font-medium">{period.name}</div>
                          <div className="text-muted-foreground">{period.startTime}</div>
                        </div>
                        {days.map((day) => {
                          const selected = isSlotSelected(day, period.id);
                          return (
                            <button
                              key={`${day}-${period.id}`}
                              onClick={() => toggleScheduleSlot(day, period.id)}
                              className={`p-2 rounded border transition-colors ${
                                selected
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-card hover:bg-muted border-border'
                              }`}
                            >
                              {selected && <span className="text-xs">✓</span>}
                            </button>
                          );
                        })}
                      </div>
                    ))}
                </div>
              </ScrollArea>
            )}

            {selectedSchedule.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">Selected slots ({selectedSchedule.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {selectedSchedule.map((slot) => {
                    const period = periods.find((p) => p.id === slot.periodId);
                    return (
                      <Badge key={`${slot.day}-${slot.periodId}`} variant="secondary" className="gap-1">
                        {slot.day.slice(0, 3)} - {period?.name || slot.periodId}
                        <button
                          onClick={() => toggleScheduleSlot(slot.day, slot.periodId)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSchedule}>Save Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
