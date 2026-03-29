import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminOverview } from '@/components/admin/AdminOverview';
import { AdminComplianceTable } from '@/components/admin/AdminComplianceTable';
import { AdminUserManagement } from '@/components/admin/AdminUserManagement';
import { AdminClassManagement } from '@/components/admin/AdminClassManagement';
import { AdminSubjectGroups } from '@/components/admin/AdminSubjectGroups';
import { AdminScheduleManager } from '@/components/admin/AdminScheduleManager';
import { AdminTimetable } from '@/components/admin/AdminTimetable';
import { AdminAppApprovals } from '@/components/admin/AdminAppApprovals';
import { AdminAppBlockingSuggestions } from '@/components/admin/AdminAppBlockingSuggestions';
import { AdminSchoolSettings } from '@/components/admin/AdminSchoolSettings';
import { AnnouncementManager } from '@/components/teacher/AnnouncementManager';
import { DeactivationLog } from '@/components/shared/DeactivationLog';
import { useApp } from '@/contexts/AppContext';

const sectionTitles: Record<string, { title: string; description: string }> = {
  overview: { title: 'Dashboard Overview', description: 'School-wide statistics and alerts' },
  'focus-scores': { title: 'Student Focus Scores', description: 'Monitor and manage student focus during school hours' },
  users: { title: 'User Management', description: 'Add, remove, and manage students, teachers, and admins' },
  classes: { title: 'Class Management', description: 'Organize year groups, classes, and student assignments' },
  'subject-groups': { title: 'Subject Groups', description: 'Create subject-based groups for streaming and mixed-ability classes' },
  schedule: { title: 'Schedule', description: 'Configure school hours and class periods' },
  timetable: { title: 'Timetable', description: 'View class schedule by period and day' },
  apps: { title: 'App Approvals', description: 'Review and approve app recommendations' },
  'app-suggestions': { title: 'App Blocking Suggestions', description: 'Suggest apps for students to block during focus time' },
  announcements: { title: 'Announcements', description: 'Create and manage school-wide announcements' },
  log: { title: 'Activity Log', description: 'View Study Mode deactivation history' },
  settings: { title: 'School Settings', description: 'Configure school-wide settings and preferences' },
};

const AdminDesktopDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const { announcements } = useApp();

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <AdminOverview />;
      case 'focus-scores':
        return <AdminComplianceTable />;
      case 'users':
        return <AdminUserManagement />;
      case 'classes':
        return <AdminClassManagement />;
      case 'subject-groups':
        return <AdminSubjectGroups />;
      case 'schedule':
        return <AdminScheduleManager />;
      case 'timetable':
        return <AdminTimetable />;
      case 'apps':
        return <AdminAppApprovals />;
      case 'app-suggestions':
        return <AdminAppBlockingSuggestions />;
      case 'announcements':
        return <AnnouncementManager announcements={announcements} />;
      case 'log':
        return <DeactivationLog showFilters />;
      case 'settings':
        return <AdminSchoolSettings />;
      default:
        return <AdminOverview />;
    }
  };

  const currentSection = sectionTitles[activeSection] || sectionTitles.overview;

  return (
    <div className="min-h-screen bg-background flex w-full">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b px-8 py-4">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-xl font-semibold">{currentSection.title}</h1>
            <p className="text-sm text-muted-foreground">{currentSection.description}</p>
          </motion.div>
        </header>

        {/* Content */}
        <div className="p-8">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default AdminDesktopDashboard;
