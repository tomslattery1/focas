import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, AppWindow, Shield, User, Smartphone } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import TeacherAppSuggestions from '@/components/student/TeacherAppSuggestions';
import { useAppSuggestions } from '@/contexts/AppSuggestionContext';

type AppManagementView = 'main' | 'suggestions' | 'myapps';

const AppManagementPage = () => {
  const [currentView, setCurrentView] = useState<AppManagementView>('main');
  const { pendingSuggestions, studentResponses, respondToSuggestion } = useAppSuggestions();

  // Filter out suggestions the student has already responded to
  const respondedIds = studentResponses
    .filter(r => r.studentId === 'student-1')
    .map(r => r.suggestionId);
  
  const unresolvedSuggestions = pendingSuggestions.filter(s => !respondedIds.includes(s.id));
  const acceptedSuggestions = studentResponses
    .filter(r => r.studentId === 'student-1' && r.status === 'accepted')
    .map(r => pendingSuggestions.find(s => s.id === r.suggestionId))
    .filter(Boolean);

  const handleAccept = (id: string) => {
    respondToSuggestion(id, 'accepted');
  };

  const handleReject = (id: string) => {
    respondToSuggestion(id, 'rejected');
  };

  const handleAcceptAll = () => {
    unresolvedSuggestions.forEach(s => respondToSuggestion(s.id, 'accepted'));
  };

  const pendingCount = unresolvedSuggestions.length;

  if (currentView === 'suggestions') {
    return (
      <MobileLayout>
        <div className="px-5 pt-14 pb-6">
          <button
            onClick={() => setCurrentView('main')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back to App Settings</span>
          </button>
          <TeacherAppSuggestions
            unresolvedSuggestions={unresolvedSuggestions}
            acceptedSuggestions={acceptedSuggestions}
            onAccept={handleAccept}
            onReject={handleReject}
            onAcceptAll={handleAcceptAll}
          />
        </div>
      </MobileLayout>
    );
  }

  if (currentView === 'myapps') {
    return (
      <MobileLayout>
        <div className="px-5 pt-14 pb-6">
          <button
            onClick={() => setCurrentView('main')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back to App Settings</span>
          </button>
          <MyAppsContent />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <div className="px-5 pt-14 pb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">App Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose which apps to limit during Study Mode
          </p>
        </motion.div>

        <div className="space-y-3">
          {/* Teacher Suggestions */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => setCurrentView('suggestions')}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <p className="font-medium">Teacher Suggestions</p>
                  {pendingCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Review suggested apps to limit
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          {/* My Blocked Apps */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setCurrentView('myapps')}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-status-red/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-status-red" />
              </div>
              <div className="text-left">
                <p className="font-medium">My App Limits</p>
                <p className="text-xs text-muted-foreground">
                  Manage apps you've chosen to limit
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 rounded-xl bg-muted/50 border"
        >
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">How it works</p>
              <p className="text-xs text-muted-foreground mt-1">
                When you accept app suggestions or add apps to your limit list, 
                they'll be managed when you enable Study Mode. 
                You're always in control of your settings.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

// My blocked apps content
const MyAppsContent = () => {
  const [blockedApps] = useState([
    { id: '1', name: 'YouTube', category: 'Entertainment' },
    { id: '2', name: 'Games', category: 'Category' },
  ]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">My App Limits</h2>
        <p className="text-muted-foreground mt-2">
          Apps you've chosen to limit during Study Mode.
        </p>
      </motion.div>

      {/* Current blocked apps */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-card border"
      >
        <h3 className="text-lg font-semibold mb-4">Currently Limited</h3>
        
        <div className="space-y-3">
          {blockedApps.map((app) => (
            <div 
              key={app.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
            >
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                <AppWindow className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{app.name}</p>
                <p className="text-xs text-muted-foreground">{app.category}</p>
              </div>
            </div>
          ))}
        </div>

        <Button className="w-full mt-4" variant="outline">
          <AppWindow className="w-4 h-4 mr-2" />
          Add Apps to Limit
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-3">
          Opens Apple's app picker in the native app
        </p>
      </motion.div>

      {/* Allowed apps section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-card border"
      >
        <h3 className="text-lg font-semibold mb-2">Always Allowed</h3>
        <p className="text-sm text-muted-foreground mb-4">
          These apps remain accessible during Study Mode.
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-status-green/5 border border-status-green/20">
            <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
              <AppWindow className="w-5 h-5 text-status-green" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Phone</p>
              <p className="text-xs text-muted-foreground">Always allowed for safety</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-status-green/5 border border-status-green/20">
            <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
              <AppWindow className="w-5 h-5 text-status-green" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">Messages</p>
              <p className="text-xs text-muted-foreground">Family contacts only</p>
            </div>
          </div>
        </div>

        <Button className="w-full mt-4" variant="outline">
          Manage Allowed Apps
        </Button>
      </motion.div>
    </div>
  );
};

export default AppManagementPage;
