import { MobileLayout } from '@/components/layout/MobileLayout';
import { AnnouncementCard } from '@/components/announcements/AnnouncementCard';
import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';

const AnnouncementsPage = () => {
  const { announcements, userRole } = useApp();

  // Filter announcements based on user role
  const filteredAnnouncements = announcements.filter(a => {
    if (a.recipients === 'both') return true;
    if (userRole === 'student' && a.recipients === 'students') return true;
    if (userRole === 'parent' && a.recipients === 'guardians') return true;
    // Teachers and admins see all announcements
    if (userRole === 'teacher' || userRole === 'admin') return true;
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
          className="mb-8"
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

        {/* Announcements List */}
        <div className="space-y-3">
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

        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No announcements yet</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default AnnouncementsPage;
