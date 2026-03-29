import { MobileLayout } from '@/components/layout/MobileLayout';
import { AnnouncementCard } from '@/components/announcements/AnnouncementCard';
import { PhaseAnnotation } from '@/components/mvp/PhaseAnnotation';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import { Bell, MessageCircle } from 'lucide-react';

/**
 * MVP Announcements Page - School Notices
 * 
 * Core MVP Features:
 * ✅ School-wide announcements display
 * ✅ Read/unread status
 * ✅ Priority indicators
 * 
 * Phase 2 Features (noted):
 * - Teacher class-specific announcements
 * - Push notifications for urgent messages
 * - Read receipts for teachers
 * 
 * Phase 3 Features (noted):
 * - Two-way messaging (parent-teacher)
 * - Announcement scheduling
 */
const MvpAnnouncementsPage = () => {
  const { announcements, userRole } = useApp();

  // Filter announcements for student view
  const filteredAnnouncements = announcements.filter(a => {
    if (a.recipients === 'both') return true;
    if (userRole === 'student' && a.recipients === 'students') return true;
    return false;
  });

  const unreadCount = filteredAnnouncements.filter(a => !a.read).length;

  return (
    <MobileLayout>
      <div className="px-5 pt-14 pb-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">School notices and alerts</p>
        </motion.div>

        {/* Announcements List - Core MVP Feature */}
        {filteredAnnouncements.length > 0 ? (
          <div className="space-y-3 mb-6">
            {filteredAnnouncements.map((announcement, index) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AnnouncementCard announcement={announcement} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 mb-6"
          >
            <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground">No announcements yet</p>
            <p className="text-sm text-muted-foreground/70">Check back later for school updates</p>
          </motion.div>
        )}

        {/* Future Phase Annotations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <PhaseAnnotation
            phase="phase2"
            title="Class Announcements"
            description="Teachers can send class-specific messages. Push notifications for urgent updates."
          />
          <PhaseAnnotation
            phase="phase3"
            title="Messaging System"
            description="Two-way communication between parents and teachers. Message scheduling and templates."
          />
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default MvpAnnouncementsPage;
