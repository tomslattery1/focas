import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, GraduationCap, BookOpen, Shield, Plus, Trash2, Upload, FileText, CheckCircle, XCircle, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  studentNumber?: string;
  role: 'student' | 'teacher' | 'admin';
  status: 'active' | 'inactive';
  yearGroup?: string;
  dateOfBirth?: string;
  pin?: string;
  guardianEmail?: string;
  phone?: string;
}

// Note: In production, user data should be fetched from a secure backend API
// This empty array serves as a placeholder - real data would come from authenticated endpoints
const initialUsers: User[] = [];

export const AdminUserManagement = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [importedUsers, setImportedUsers] = useState<Array<User & { valid: boolean; errors: string[] }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New user form state
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentNumber: '',
    role: 'student' as 'student' | 'teacher' | 'admin',
    yearGroup: '',
    identifierType: 'email' as 'email' | 'studentNumber',
  });

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch = fullName.includes(searchLower) ||
      (user.email?.toLowerCase().includes(searchLower) ?? false) ||
      (user.studentNumber?.toLowerCase().includes(searchLower) ?? false);
    const matchesFilter = userFilter === 'all' || user.role === userFilter;
    return matchesSearch && matchesFilter;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'teacher': return <BookOpen className="w-4 h-4" />;
      case 'admin': return <Shield className="w-4 h-4" />;
      default: return <GraduationCap className="w-4 h-4" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'teacher':
        return <Badge variant="outline" className="gap-1 bg-blue-500/10 text-blue-600 border-blue-500/20">{getRoleIcon(role)} Teacher</Badge>;
      case 'admin':
        return <Badge variant="outline" className="gap-1 bg-purple-500/10 text-purple-600 border-purple-500/20">{getRoleIcon(role)} Admin</Badge>;
      default:
        return <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-600 border-green-500/20">{getRoleIcon(role)} Student</Badge>;
    }
  };

  const handleAddUser = () => {
    if (!newUser.firstName.trim() || !newUser.lastName.trim()) {
      toast.error('Please enter first and last name');
      return;
    }

    if (newUser.role === 'student') {
      if (newUser.identifierType === 'email' && !newUser.email.trim()) {
        toast.error('Please enter an email address');
        return;
      }
      if (newUser.identifierType === 'studentNumber' && !newUser.studentNumber.trim()) {
        toast.error('Please enter a student number');
        return;
      }
    } else if (!newUser.email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      firstName: newUser.firstName.trim(),
      lastName: newUser.lastName.trim(),
      email: newUser.role !== 'student' || newUser.identifierType === 'email' ? newUser.email.trim() : undefined,
      studentNumber: newUser.role === 'student' && newUser.identifierType === 'studentNumber' ? newUser.studentNumber.trim() : undefined,
      role: newUser.role,
      status: 'active',
      yearGroup: newUser.role === 'student' ? newUser.yearGroup : undefined,
    };

    setUsers(prev => [...prev, user]);
    setNewUser({ firstName: '', lastName: '', email: '', studentNumber: '', role: 'student', yearGroup: '', identifierType: 'email' });
    setShowAddDialog(false);
    toast.success(`${user.firstName} ${user.lastName} added successfully`);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;
    
    setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
    toast.success(`${userToDelete.firstName} ${userToDelete.lastName} removed`);
    setUserToDelete(null);
  };

  const parseCSV = (content: string): Array<Record<string, string>> => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });
  };

  const validateImportedUser = (row: Record<string, string>): { user: User; valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    const firstName = row['first name'] || row['firstname'] || '';
    const lastName = row['last name'] || row['lastname'] || '';
    const email = row['email'] || row['email address'] || '';
    const studentNumber = row['student number'] || row['studentnumber'] || row['student_number'] || '';
    const role = (row['role'] || 'student').toLowerCase() as 'student' | 'teacher' | 'admin';
    const yearGroup = row['class/grade'] || row['year group'] || row['yeargroup'] || row['class'] || row['grade'] || '';
    const dateOfBirth = row['date of birth (yyyy-mm-dd)'] || row['date of birth'] || row['dob'] || '';
    const guardianEmail = row['guardian email'] || row['parent email'] || '';
    const phone = row['phone number'] || row['phone'] || '';
    
    // Generate PIN from DOB if not provided
    let pin = row['pin (ddmm)'] || row['pin'] || '';
    if (!pin && dateOfBirth) {
      const dobParts = dateOfBirth.split('-');
      if (dobParts.length === 3) {
        const day = dobParts[2].padStart(2, '0');
        const month = dobParts[1].padStart(2, '0');
        pin = day + month;
      }
    }
    
    if (!firstName) errors.push('First name is required');
    if (!lastName) errors.push('Last name is required');
    if (!['student', 'teacher', 'admin'].includes(role)) errors.push('Invalid role');
    if (role !== 'student' && !email) errors.push('Email required for non-students');
    if (role === 'student' && !email && !studentNumber) errors.push('Email or student number required');
    
    return {
      user: {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        firstName,
        lastName,
        email: email || undefined,
        studentNumber: studentNumber || undefined,
        role,
        status: 'active',
        yearGroup: role === 'student' ? yearGroup : undefined,
        dateOfBirth: dateOfBirth || undefined,
        pin: pin || undefined,
        guardianEmail: guardianEmail || undefined,
        phone: phone || undefined,
      },
      valid: errors.length === 0,
      errors,
    };
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const rows = parseCSV(content);
      
      if (rows.length === 0) {
        toast.error('No valid data found in CSV');
        return;
      }

      const validated = rows.map(row => {
        const result = validateImportedUser(row);
        return { ...result.user, valid: result.valid, errors: result.errors };
      });

      setImportedUsers(validated);
      setShowImportDialog(true);
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImportUsers = () => {
    const validUsers = importedUsers.filter(u => u.valid);
    if (validUsers.length === 0) {
      toast.error('No valid users to import');
      return;
    }

    const usersToAdd: User[] = validUsers.map(({ valid, errors, ...user }) => user);
    setUsers(prev => [...prev, ...usersToAdd]);
    setShowImportDialog(false);
    setImportedUsers([]);
    toast.success(`${validUsers.length} users imported successfully`);
  };

  const downloadCSVTemplate = () => {
    const headers = [
      'Role',
      'First Name',
      'Last Name',
      'Email Address',
      'Student Number',
      'Class/Grade',
      'Date of Birth (YYYY-MM-DD)',
      'PIN (DDMM)',
      'Guardian Email',
      'Phone Number'
    ];
    
    // Use generic placeholder data that doesn't expose real patterns or personal info
    const sampleData = [
      ['student', 'FirstName1', 'LastName1', 'student1@example.com', 'STU001', '1A', '2015-01-01', '0101', 'parent1@example.com', '0000000001'],
      ['student', 'FirstName2', 'LastName2', '', 'STU002', '1A', '2015-02-02', '', 'parent2@example.com', ''],
      ['teacher', 'FirstName3', 'LastName3', 'teacher1@example.com', '', '', '', '', '', '0000000002'],
      ['admin', 'FirstName4', 'LastName4', 'admin1@example.com', '', '', '', '', '', '0000000003'],
    ];

    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'user_import_template.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    
    toast.success('Template downloaded');
  };

  const stats = {
    total: users.length,
    teachers: users.filter(u => u.role === 'teacher').length,
    students: users.filter(u => u.role === 'student').length,
    admins: users.filter(u => u.role === 'admin').length,
  };

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
            <h2 className="text-xl font-semibold">User Management</h2>
            <p className="text-sm text-muted-foreground">
              View and manage school users
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </Button>
        </div>
        
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button variant="outline" size="sm" onClick={downloadCSVTemplate} className="gap-2">
            <Download className="w-4 h-4" />
            Template
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
            <Upload className="w-4 h-4" />
            Import CSV
          </Button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-3"
      >
        <div className="p-4 rounded-xl bg-card border text-center">
          <p className="text-2xl font-semibold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="p-4 rounded-xl bg-card border text-center">
          <p className="text-2xl font-semibold text-green-600">{stats.students}</p>
          <p className="text-xs text-muted-foreground">Students</p>
        </div>
        <div className="p-4 rounded-xl bg-card border text-center">
          <p className="text-2xl font-semibold text-blue-600">{stats.teachers}</p>
          <p className="text-xs text-muted-foreground">Teachers</p>
        </div>
        <div className="p-4 rounded-xl bg-card border text-center">
          <p className="text-2xl font-semibold text-purple-600">{stats.admins}</p>
          <p className="text-xs text-muted-foreground">Admins</p>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={userFilter} onValueChange={setUserFilter}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="student" className="flex-1">Students</TabsTrigger>
            <TabsTrigger value="teacher" className="flex-1">Teachers</TabsTrigger>
            <TabsTrigger value="admin" className="flex-1">Admins</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* User List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-2"
      >
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="p-4 rounded-xl bg-card border flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <h4 className="font-medium">{user.firstName} {user.lastName}</h4>
                <p className="text-xs text-muted-foreground">
                  {user.email || (user.studentNumber ? `#${user.studentNumber}` : '')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {user.yearGroup && (
                <Badge variant="secondary">{user.yearGroup}</Badge>
              )}
              {getRoleBadge(user.role)}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setUserToDelete(user)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No users found</p>
          </div>
        )}
      </motion.div>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Add a new student, teacher, or admin to the school.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="First name"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Last name"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>
            
            {newUser.role === 'student' && (
              <div className="space-y-2">
                <Label>Student Identifier</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={newUser.identifierType === 'email' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setNewUser(prev => ({ ...prev, identifierType: 'email', studentNumber: '' }))}
                  >
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={newUser.identifierType === 'studentNumber' ? 'default' : 'outline'}
                    size="sm"
                    className="flex-1"
                    onClick={() => setNewUser(prev => ({ ...prev, identifierType: 'studentNumber', email: '' }))}
                  >
                    Student Number
                  </Button>
                </div>
              </div>
            )}

            {(newUser.role !== 'student' || newUser.identifierType === 'email') && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newUser.email}
                  onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            )}

            {newUser.role === 'student' && newUser.identifierType === 'studentNumber' && (
              <div className="space-y-2">
                <Label htmlFor="studentNumber">Student Number</Label>
                <Input
                  id="studentNumber"
                  placeholder="Enter student number"
                  value={newUser.studentNumber}
                  onChange={(e) => setNewUser(prev => ({ ...prev, studentNumber: e.target.value }))}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newUser.role} 
                onValueChange={(v) => setNewUser(prev => ({ ...prev, role: v as 'student' | 'teacher' | 'admin' }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newUser.role === 'student' && (
              <div className="space-y-2">
                <Label htmlFor="yearGroup">Year Group</Label>
                <Input
                  id="yearGroup"
                  placeholder="e.g., 6A"
                  value={newUser.yearGroup}
                  onChange={(e) => setNewUser(prev => ({ ...prev, yearGroup: e.target.value }))}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {userToDelete?.firstName} {userToDelete?.lastName}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Import CSV Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Import Users from CSV
            </DialogTitle>
            <DialogDescription>
              Review the users to be imported. Invalid entries will be skipped.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-4 text-sm">
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  {importedUsers.filter(u => u.valid).length} valid
                </span>
                <span className="flex items-center gap-1 text-destructive">
                  <XCircle className="w-4 h-4" />
                  {importedUsers.filter(u => !u.valid).length} invalid
                </span>
              </div>
            </div>
            
            <ScrollArea className="h-[300px] border rounded-lg">
              <div className="p-2 space-y-2">
                {importedUsers.map((user, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      user.valid 
                        ? 'bg-green-500/5 border-green-500/20' 
                        : 'bg-destructive/5 border-destructive/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {user.valid ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-destructive" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{user.firstName} {user.lastName || 'No name'}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email || user.studentNumber || 'No identifier'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.yearGroup && (
                          <Badge variant="secondary" className="text-xs">{user.yearGroup}</Badge>
                        )}
                        {getRoleBadge(user.role)}
                      </div>
                    </div>
                    {!user.valid && user.errors.length > 0 && (
                      <p className="text-xs text-destructive mt-2 ml-7">
                        {user.errors.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <p className="text-xs text-muted-foreground mt-3">
              CSV format: name, email, student number, role, year group
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleImportUsers}
              disabled={importedUsers.filter(u => u.valid).length === 0}
            >
              Import {importedUsers.filter(u => u.valid).length} Users
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
