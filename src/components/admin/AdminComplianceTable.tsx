import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  MoreHorizontal,
  Mail,
  Eye,
  Download
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { StudentDetailView } from './StudentDetailView';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  yearGroup: string;
  className: string;
  focusStatus: 'green' | 'amber' | 'red';
  focusScore: number;
  focasModeActive: boolean;
  lastActive: Date;
  appRecommendationsAccepted: boolean;
  limitedAppsCount: number;
}

// Irish first names and surnames for realistic data
const firstNames = [
  'Aoife', 'Cian', 'Saoirse', 'Oisin', 'Niamh', 'Sean', 'Emma', 'Liam', 'Grace', 'Jack',
  'Ciara', 'Conor', 'Roisin', 'Eoin', 'Ava', 'Darragh', 'Caoimhe', 'Fionn', 'Sophie', 'Cathal',
  'Ella', 'Tadhg', 'Lucy', 'Rian', 'Mia', 'Cillian', 'Anna', 'Dara', 'Emily', 'Seamus',
  'Molly', 'Padraig', 'Sarah', 'Ruairi', 'Leah', 'Declan', 'Katie', 'Colm', 'Rachel', 'Brendan',
  'Orla', 'Killian', 'Sinead', 'Donnacha', 'Clodagh', 'Lorcan', 'Ailbhe', 'Ronan', 'Meadhbh', 'Diarmuid',
  'Eimear', 'Fergal', 'Grainne', 'Pearse', 'Siobhan', 'Aidan', 'Maeve', 'Cormac', 'Aisling', 'Finn',
  'Aoibhinn', 'Ciaran', 'Deirdre', 'Eoghan', 'Fionnuala', 'Gavin', 'Ide', 'Kevin', 'Laoise', 'Niall',
  'Orlaith', 'Patrick', 'Riona', 'Shane', 'Tara', 'Ultan', 'Vera', 'William', 'Yvonne', 'Zara'
];
const lastNames = [
  'Ryan', 'Kelly', 'Byrne', 'Murphy', 'Walsh', 'Doyle', 'Collins', "O'Connor", 'Fitzgerald', 'Brennan',
  'McCarthy', "O'Sullivan", 'Kennedy', 'Lynch', 'Murray', 'Quinn', 'Moore', 'McLoughlin', "O'Neill", 'Daly',
  'Nolan', 'Dunne', "O'Brien", 'Gallagher', 'Burke', 'Power', 'Healy', 'Connolly', 'Foley', 'Kavanagh',
  'Moran', 'O\'Reilly', 'Hickey', 'Crowley', 'Hogan', 'Barry', 'Keane', 'O\'Rourke', 'Whelan', 'Doherty',
  'Sweeney', 'Buckley', 'O\'Shea', 'Duffy', 'Farrell', 'Regan', 'O\'Donnell', 'Maher', 'Hayes', 'O\'Keeffe'
];

// Year structure: Years 1-6, 4 streams each (A, B, C, D), ~25 students per class
// Classes are named: 1A, 1B, 1C, 1D, 2A, 2B, ... 6D
const years = [1, 2, 3, 4, 5, 6];
const streams = ['A', 'B', 'C', 'D'];

// Generate realistic mock students
const generateMockStudents = (): Student[] => {
  const students: Student[] = [];
  let id = 1;
  
  years.forEach((year) => {
    streams.forEach((stream) => {
      const className = `${year}${stream}`;
      // 24-26 students per class
      const classSize = 24 + Math.floor(Math.random() * 3);
      
      for (let i = 0; i < classSize; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/'/g, '')}${id}@school.ie`;
        
        // Focus score varies - older students tend to be slightly better
        const baseFocusScore = 60 + (year - 1) * 3;
        const variance = Math.floor(Math.random() * 40) - 15;
        const focusScore = Math.max(20, Math.min(100, baseFocusScore + variance));
        
        const focusStatus: 'green' | 'amber' | 'red' = 
          focusScore >= 85 ? 'green' : 
          focusScore >= 65 ? 'amber' : 'red';
        
        const focasModeActive = focusStatus !== 'red' && Math.random() > 0.2;
        const appRecommendationsAccepted = focusScore > 70 && Math.random() > 0.3;
        
        students.push({
          id: String(id),
          firstName,
          lastName,
          email,
          yearGroup: `Year ${year}`,
          className,
          focusStatus,
          focusScore,
          focasModeActive,
          lastActive: new Date(Date.now() - Math.floor(Math.random() * 7200000)),
          appRecommendationsAccepted,
          limitedAppsCount: appRecommendationsAccepted ? 8 + Math.floor(Math.random() * 5) : Math.floor(Math.random() * 6),
        });
        id++;
      }
    });
  });
  
  return students;
};

const mockStudents: Student[] = generateMockStudents();


type SortField = 'name' | 'yearGroup' | 'compliance' | 'lastActive';
type SortDirection = 'asc' | 'desc';

const statusConfig = {
  green: { icon: CheckCircle, label: 'Focused', className: 'text-emerald-500', bgClass: 'bg-emerald-500/10' },
  amber: { icon: AlertTriangle, label: 'Warning', className: 'text-amber-500', bgClass: 'bg-amber-500/10' },
  red: { icon: XCircle, label: 'Needs Focus', className: 'text-red-500', bgClass: 'bg-red-500/10' },
};

export const AdminComplianceTable = () => {
  const [students] = useState<Student[]>(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<string>('all');
  const [appFilter, setAppFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // If viewing a student detail, show that view
  if (selectedStudentId) {
    return <StudentDetailView studentId={selectedStudentId} onBack={() => setSelectedStudentId(null)} />;
  }

  const yearGroups = useMemo(() => 
    [...new Set(students.map(s => s.yearGroup))].sort(),
    [students]
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedStudents = useMemo(() => {
    let result = students.filter(student => {
      const matchesSearch = 
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.className.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || student.focusStatus === statusFilter;
      const matchesYear = yearFilter === 'all' || student.yearGroup === yearFilter;
      const matchesApp = appFilter === 'all' || 
        (appFilter === 'accepted' && student.appRecommendationsAccepted) ||
        (appFilter === 'pending' && !student.appRecommendationsAccepted);
      
      return matchesSearch && matchesStatus && matchesYear && matchesApp;
    });

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);
          break;
        case 'yearGroup':
          comparison = a.yearGroup.localeCompare(b.yearGroup);
          break;
        case 'compliance':
          comparison = a.focusScore - b.focusScore;
          break;
        case 'lastActive':
          comparison = b.lastActive.getTime() - a.lastActive.getTime();
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [students, searchQuery, statusFilter, yearFilter, appFilter, sortField, sortDirection]);

  const stats = useMemo(() => ({
    total: students.length,
    focused: students.filter(s => s.focusStatus === 'green').length,
    warning: students.filter(s => s.focusStatus === 'amber').length,
    needsFocus: students.filter(s => s.focusStatus === 'red').length,
    appsPending: students.filter(s => !s.appRecommendationsAccepted).length,
  }), [students]);

  const toggleSelectAll = () => {
    if (selectedStudents.length === filteredAndSortedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredAndSortedStudents.map(s => s.id));
    }
  };

  const toggleSelectStudent = (id: string) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const formatLastActive = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const handleBulkAction = (action: string) => {
    toast.success(`${action} sent to ${selectedStudents.length} students`);
    setSelectedStudents([]);
  };

  const handleExport = () => {
    toast.success('Exporting compliance data...');
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 ml-1" /> : 
      <ChevronDown className="w-4 h-4 ml-1" />;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-card border"
        >
          <p className="text-sm text-muted-foreground">Total Students</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
        >
          <p className="text-sm text-emerald-600">Focused</p>
          <p className="text-2xl font-bold text-emerald-600">{stats.focused}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20"
        >
          <p className="text-sm text-amber-600">Warning</p>
          <p className="text-2xl font-bold text-amber-600">{stats.warning}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
        >
          <p className="text-sm text-red-600">Needs Focus</p>
          <p className="text-2xl font-bold text-red-600">{stats.needsFocus}</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-primary/10 border border-primary/20"
        >
          <p className="text-sm text-primary">Apps Pending</p>
          <p className="text-2xl font-bold text-primary">{stats.appsPending}</p>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-wrap items-center gap-3"
      >
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search students by name, email, or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="green">Focused</SelectItem>
            <SelectItem value="amber">Warning</SelectItem>
            <SelectItem value="red">Needs Focus</SelectItem>
          </SelectContent>
        </Select>

        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Year Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {yearGroups.map(year => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={appFilter} onValueChange={setAppFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="App Recommendations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Students</SelectItem>
            <SelectItem value="accepted">Apps Accepted</SelectItem>
            <SelectItem value="pending">Apps Pending</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="w-4 h-4" />
          Export
        </Button>
      </motion.div>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
        >
          <span className="text-sm font-medium">{selectedStudents.length} selected</span>
          <Button size="sm" variant="outline" onClick={() => handleBulkAction('Reminder')}>
            Send Reminder
          </Button>
          <Button size="sm" variant="outline" onClick={() => handleBulkAction('Notification')}>
            Notify Guardians
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSelectedStudents([])}>
            Clear
          </Button>
        </motion.div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border bg-card overflow-hidden"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedStudents.length === filteredAndSortedStudents.length && filteredAndSortedStudents.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center">
                  Student <SortIcon field="name" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort('yearGroup')}
              >
                <div className="flex items-center">
                  Year / Class <SortIcon field="yearGroup" />
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort('compliance')}
              >
                <div className="flex items-center">
                  Focus Score <SortIcon field="compliance" />
                </div>
              </TableHead>
              <TableHead>Fócas Mode</TableHead>
              <TableHead>App Recommendations</TableHead>
              <TableHead 
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort('lastActive')}
              >
                <div className="flex items-center">
                  Last Active <SortIcon field="lastActive" />
                </div>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedStudents.map((student) => {
              const StatusIcon = statusConfig[student.focusStatus].icon;
              return (
                <TableRow key={student.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Checkbox 
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => toggleSelectStudent(student.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{student.firstName} {student.lastName}</p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{student.yearGroup}</p>
                      <p className="text-xs text-muted-foreground">{student.className}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${statusConfig[student.focusStatus].bgClass} flex items-center justify-center`}>
                        <StatusIcon className={`w-4 h-4 ${statusConfig[student.focusStatus].className}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{student.focusScore}%</p>
                        <p className={`text-xs ${statusConfig[student.focusStatus].className}`}>
                          {statusConfig[student.focusStatus].label}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={student.focasModeActive ? "default" : "secondary"}>
                      {student.focasModeActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {student.appRecommendationsAccepted ? (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-sm">{student.limitedAppsCount} apps</span>
                      </div>
                    ) : (
                      <Badge variant="outline" className="text-amber-600 border-amber-300">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatLastActive(student.lastActive)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedStudentId(student.id)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Contact Guardian
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredAndSortedStudents.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No students match your filters
          </div>
        )}
      </motion.div>

      {/* Pagination info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {filteredAndSortedStudents.length} of {students.length} students</span>
      </div>
    </div>
  );
};
