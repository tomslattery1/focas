import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Bell,
  LogOut,
  Send,
  Shield,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhaseAnnotation } from '@/components/mvp/PhaseAnnotation';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';

/**
 * MVP Admin Dashboard
 * 
 * Core MVP Features:
 * ✅ High-level student focus status (Green/Amber/Red counts)
 * ✅ Ability to post announcements to students
 * ✅ Privacy-focused - no detailed tracking
 * 
 * Phase 2 Features (noted):
 * - Detailed student analytics
 * - App approval management
 * - Teacher management
 * 
 * Phase 3 Features (noted):
 * - Parent communication portal
 * - Scheduled announcements
 * - Custom reporting
 */

// Mock data for MVP - simplified, no sensitive details
const mvpStats = {
  totalStudents: 156,
  greenStatus: 128,
  amberStatus: 21,
  redStatus: 7,
  focasModeActive: 134,
};

const MvpAdminDashboard = () => {
  const { resetOnboarding, addAnnouncement, schoolSettings } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const handleSignOut = () => {
    resetOnboarding();
    window.location.href = '/';
  };

  const handlePostAnnouncement = () => {
    if (!announcementTitle.trim() || !announcementMessage.trim()) {
      toast.error('Please fill in both title and message');
      return;
    }

    addAnnouncement({
      title: announcementTitle,
      message: announcementMessage,
      priority: isUrgent ? 'urgent' : 'normal',
      recipients: 'students',
    });

    toast.success('Announcement posted', {
      description: 'All students will see this announcement.',
    });

    setAnnouncementTitle('');
    setAnnouncementMessage('');
    setIsUrgent(false);
  };

  const focusScore = Math.round((mvpStats.greenStatus / mvpStats.totalStudents) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div>
            <h1 className="text-xl font-bold">{schoolSettings.schoolName}</h1>
            <p className="text-sm text-muted-foreground">Admin Dashboard</p>
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 pb-24 space-y-6">
        {/* Privacy Notice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-primary/5 border border-primary/20"
        >
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Privacy-First Design</p>
              <p className="text-xs text-muted-foreground mt-1">
                Fócas shows aggregate focus status only. We don't track individual app usage, 
                location, or personal data. Students control their own privacy settings.
              </p>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">
              <Users className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Bell className="w-4 h-4 mr-2" />
              Announcements
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Focus Score Hero */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <CardContent className="pt-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">School Focus Score</p>
                  <p className="text-5xl font-bold text-primary">{focusScore}%</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {mvpStats.focasModeActive} of {mvpStats.totalStudents} students in Fócas Mode
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <Card className="border-status-green/30 bg-status-green/5">
                  <CardContent className="pt-4 pb-4 text-center">
                    <CheckCircle className="w-6 h-6 text-status-green mx-auto mb-2" />
                    <p className="text-2xl font-bold text-status-green">{mvpStats.greenStatus}</p>
                    <p className="text-xs text-muted-foreground">Focused</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-status-amber/30 bg-status-amber/5">
                  <CardContent className="pt-4 pb-4 text-center">
                    <AlertTriangle className="w-6 h-6 text-status-amber mx-auto mb-2" />
                    <p className="text-2xl font-bold text-status-amber">{mvpStats.amberStatus}</p>
                    <p className="text-xs text-muted-foreground">Needs Focus</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card className="border-status-red/30 bg-status-red/5">
                  <CardContent className="pt-4 pb-4 text-center">
                    <XCircle className="w-6 h-6 text-status-red mx-auto mb-2" />
                    <p className="text-2xl font-bold text-status-red">{mvpStats.redStatus}</p>
                    <p className="text-xs text-muted-foreground">Unfocused</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Info Note */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-3 rounded-xl bg-muted/50 border border-border/50"
            >
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  Status is based on Fócas Mode activation during school hours. 
                  Green = Active &gt;80% of time, Amber = 50-80%, Red = &lt;50%.
                </p>
              </div>
            </motion.div>

            {/* Future Phase Annotations */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-3"
            >
              <PhaseAnnotation
                phase="phase2"
                title="Detailed Analytics"
                description="View focus trends over time, class-by-class breakdowns, and identify students who may need support."
              />
              <PhaseAnnotation
                phase="phase2"
                title="Teacher Management"
                description="Add teachers, assign classes, and manage permissions."
              />
              <PhaseAnnotation
                phase="phase3"
                title="Parent Portal"
                description="Enable parent access to view their child's focus reports and receive notifications."
              />
            </motion.div>
          </TabsContent>

          {/* Announcements Tab */}
          <TabsContent value="announcements" className="space-y-4 mt-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Post Announcement
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Announcement title..."
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Write your message to students..."
                    value={announcementMessage}
                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                    rows={4}
                  />
                  
                  <div className="flex items-center justify-between">
                    <Button
                      variant={isUrgent ? 'destructive' : 'outline'}
                      size="sm"
                      onClick={() => setIsUrgent(!isUrgent)}
                    >
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {isUrgent ? 'Urgent' : 'Mark as Urgent'}
                    </Button>
                    
                    <Button onClick={handlePostAnnouncement}>
                      <Send className="w-4 h-4 mr-2" />
                      Post to Students
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Info about announcements */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-3 rounded-xl bg-muted/50 border border-border/50"
            >
              <p className="text-xs text-muted-foreground">
                Announcements appear in all students' Fócas app. Urgent announcements are highlighted in red.
              </p>
            </motion.div>

            <PhaseAnnotation
              phase="phase2"
              title="Targeted Announcements"
              description="Send announcements to specific year groups or classes."
            />
            <PhaseAnnotation
              phase="phase3"
              title="Parent Notifications"
              description="Option to also send announcements to parents/guardians."
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MvpAdminDashboard;
