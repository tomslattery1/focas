import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, AppWindow, Users, Settings, Calendar, Shield, Bell, Clock, GraduationCap, LayoutGrid, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useApp } from '@/contexts/AppContext';
import { AdminAppApprovals } from '@/components/admin/AdminAppApprovals';
import { AdminUserManagement } from '@/components/admin/AdminUserManagement';
import { AdminSchoolSettings } from '@/components/admin/AdminSchoolSettings';
import { AdminScheduleManager } from '@/components/admin/AdminScheduleManager';
import { AdminClassManagement } from '@/components/admin/AdminClassManagement';
import { AdminTimetable } from '@/components/admin/AdminTimetable';
import { AnnouncementManager } from '@/components/teacher/AnnouncementManager';
import { DeactivationLog } from '@/components/shared/DeactivationLog';
import AdminDesktopDashboard from './AdminDesktopDashboard';

const AdminMobileDashboard = () => {
  const { resetOnboarding, announcements, schoolSettings, adminViewMode, setAdminViewMode } = useApp();
  const [activeTab, setActiveTab] = useState('apps');

  const handleSignOut = () => {
    resetOnboarding();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b px-4 py-3"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-semibold">Admin</h1>
              <p className="text-xs text-muted-foreground truncate max-w-[120px]">{schoolSettings.schoolName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <ToggleGroup 
              type="single" 
              value={adminViewMode} 
              onValueChange={(value) => value && setAdminViewMode(value as 'mobile' | 'desktop')}
              className="bg-muted rounded-md"
            >
              <ToggleGroupItem 
                value="mobile" 
                aria-label="Mobile view" 
                className="px-2 py-1 h-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <Smartphone className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem 
                value="desktop" 
                aria-label="Desktop view" 
                className="px-2 py-1 h-8 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                <Monitor className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            <Button variant="ghost" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="apps" className="flex-col gap-1 py-2 text-xs">
              <AppWindow className="w-4 h-4" />
              Apps
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex-col gap-1 py-2 text-xs">
              <GraduationCap className="w-4 h-4" />
              Classes
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex-col gap-1 py-2 text-xs">
              <Clock className="w-4 h-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-col gap-1 py-2 text-xs">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="timetable" className="flex-col gap-1 py-2 text-xs">
              <LayoutGrid className="w-4 h-4" />
              Timetable
            </TabsTrigger>
            <TabsTrigger value="announcements" className="flex-col gap-1 py-2 text-xs">
              <Bell className="w-4 h-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="log" className="flex-col gap-1 py-2 text-xs">
              <Calendar className="w-4 h-4" />
              Log
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-col gap-1 py-2 text-xs">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="apps" className="mt-4">
            <AdminAppApprovals />
          </TabsContent>

          <TabsContent value="classes" className="mt-4">
            <AdminClassManagement />
          </TabsContent>

          <TabsContent value="schedule" className="mt-4">
            <AdminScheduleManager />
          </TabsContent>

          <TabsContent value="timetable" className="mt-4">
            <AdminTimetable />
          </TabsContent>

          <TabsContent value="announcements" className="mt-4">
            <AnnouncementManager announcements={announcements} />
          </TabsContent>

          <TabsContent value="log" className="mt-4">
            <DeactivationLog showFilters />
          </TabsContent>

          <TabsContent value="users" className="mt-4">
            <AdminUserManagement />
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <AdminSchoolSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const AdminDashboard = () => {
  const { adminViewMode } = useApp();

  return adminViewMode === 'mobile' ? <AdminMobileDashboard /> : <AdminDesktopDashboard />;
};

export default AdminDashboard;
