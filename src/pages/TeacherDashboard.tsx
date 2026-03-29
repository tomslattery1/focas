import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Bell, Key, User, LogOut, AppWindow } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { TeacherClassSchedule } from '@/components/teacher/TeacherClassSchedule';
import { StudentStatusTable } from '@/components/teacher/StudentStatusTable';
import { ClassCodeGenerator } from '@/components/teacher/ClassCodeGenerator';
import { ClassAlertSender } from '@/components/teacher/ClassAlertSender';
import { TeacherProfile } from '@/components/teacher/TeacherProfile';
import { TeacherAppsHub } from '@/components/teacher/TeacherAppsHub';
import { DeactivationLog } from '@/components/shared/DeactivationLog';
import { useApp } from '@/contexts/AppContext';
import { Student } from '@/types/app';

const mockStudents: Student[] = [
  { 
    id: '1', 
    name: 'Aoife Murphy', 
    grade: '5th Year', 
    status: 'green', 
    lastActive: new Date(Date.now() - 5 * 60000),
    focasModeActive: true,
    hasOptedIn: true
  },
  { 
    id: '2', 
    name: 'Cian O\'Brien', 
    grade: '5th Year', 
    status: 'red', 
    lastActive: new Date(Date.now() - 15 * 60000),
    focasModeActive: false,
    hasOptedIn: true
  },
  { 
    id: '3', 
    name: 'Saoirse Kelly', 
    grade: '5th Year', 
    status: 'amber', 
    lastActive: new Date(Date.now() - 2 * 60000),
    focasModeActive: true,
    hasOptedIn: false
  },
  { 
    id: '4', 
    name: 'Darragh Walsh', 
    grade: '6th Year', 
    status: 'green', 
    lastActive: new Date(Date.now() - 1 * 60000),
    focasModeActive: true,
    hasOptedIn: true
  },
];

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('classes');
  const { resetOnboarding } = useApp();

  const handleSignOut = () => {
    resetOnboarding();
    window.location.href = '/';
  };
  
  const complianceRate = Math.round(
    (mockStudents.filter(s => s.status === 'green').length / mockStudents.length) * 100
  );
  
  const studentsNotOptedIn = mockStudents.filter(s => !s.hasOptedIn).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div>
            <h1 className="text-xl font-bold">Teacher Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {complianceRate}% compliance • {studentsNotOptedIn} not opted in
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 pb-24 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-card border">
              <p className="text-2xl font-bold text-primary">{complianceRate}%</p>
              <p className="text-xs text-muted-foreground">Compliance</p>
            </div>
            <div className="p-4 rounded-2xl bg-card border">
              <p className="text-2xl font-bold">{mockStudents.length}</p>
              <p className="text-xs text-muted-foreground">Students</p>
            </div>
            <div className="p-4 rounded-2xl bg-card border">
              <p className="text-2xl font-bold text-yellow-500">{studentsNotOptedIn}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="classes" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Classes</span>
            </TabsTrigger>
            <TabsTrigger value="apps" className="flex items-center gap-2">
              <AppWindow className="w-4 h-4" />
              <span className="hidden sm:inline">Apps</span>
            </TabsTrigger>
            <TabsTrigger value="codes" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">Codes</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Students</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Alerts</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classes">
            <TeacherClassSchedule />
          </TabsContent>

          <TabsContent value="apps">
            <TeacherAppsHub />
          </TabsContent>

          <TabsContent value="codes">
            <div className="space-y-6">
              <ClassCodeGenerator />
              <DeactivationLog />
            </div>
          </TabsContent>

          <TabsContent value="students">
            <StudentStatusTable students={mockStudents} />
          </TabsContent>

          <TabsContent value="alerts">
            <ClassAlertSender />
          </TabsContent>

          <TabsContent value="profile">
            <TeacherProfile />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default TeacherDashboard;
