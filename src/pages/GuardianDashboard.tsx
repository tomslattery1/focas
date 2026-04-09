import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Heart, Key, UserPlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { GuardianNotificationBanner } from '@/components/guardian/GuardianNotificationBanner';
import { EncouragementSender } from '@/components/guardian/EncouragementSender';
import { GuardianCodeGenerator } from '@/components/guardian/GuardianCodeGenerator';
import { GuardianLayout } from '@/components/layout/GuardianLayout';
import { useLocation } from 'react-router-dom';

const GuardianDashboard = () => {
  const { 
    sendEncouragement,
    parentNotifications,
    dismissParentNotification,
    dismissAllParentNotifications
  } = useApp();
  const location = useLocation();

  const getView = () => {
    const path = location.pathname;
    if (path === '/guardian/unlock') return 'unlock';
    if (path === '/guardian/encourage') return 'encourage';
    if (path === '/guardian/activity') return 'activity';
    return 'overview';
  };
  const view = getView();

  return (
    <GuardianLayout>
      <div className="px-5 pt-14 pb-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Fócas Family</h1>
          </div>
        </motion.div>

        <GuardianNotificationBanner 
          notifications={parentNotifications}
          onDismiss={dismissParentNotification}
          onDismissAll={dismissAllParentNotifications}
        />

        {/* Overview */}
        {view === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-8 text-center">
                <UserPlus className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">No students linked yet</p>
                <p className="text-xs text-muted-foreground">
                  Your student can invite you from their app during setup. Once linked, you'll see their focus status here.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Unlock */}
        {view === 'unlock' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Unlock Codes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate a temporary code for your student to end their Fócas session early when needed.
              </p>
            </div>
            <GuardianCodeGenerator childName="Your Student" />
          </div>
        )}

        {/* Encourage */}
        {view === 'encourage' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Send Encouragement</h3>
              <p className="text-sm text-muted-foreground mb-4">Send a quick message of support to your student</p>
            </div>
            <EncouragementSender childName="Your Student" onSend={(message) => sendEncouragement(message, 'Guardian')} />
          </div>
        )}

        {/* Activity */}
        {view === 'activity' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Recent Activity</h3>
              <p className="text-sm text-muted-foreground mb-4">See how your student's focus sessions are going</p>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Focus activity will appear here once your student starts using Fócas.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </GuardianLayout>
  );
};

export default GuardianDashboard;
