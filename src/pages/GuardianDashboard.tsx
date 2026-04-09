import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, CheckCircle, AlertTriangle, XCircle, LogOut, Shield, BookOpen, Bell, Heart, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { ComplianceStatus } from '@/types/app';
import { getBlockedCategories } from '@/pages/BlockedCategoriesPage';
import { Badge } from '@/components/ui/badge';
import { ComplianceNotification, Notification } from '@/components/guardian/ComplianceNotification';
import { GuardianNotificationBanner } from '@/components/guardian/GuardianNotificationBanner';
import { EncouragementSender } from '@/components/guardian/EncouragementSender';
import { GuardianCodeGenerator } from '@/components/guardian/GuardianCodeGenerator';
import { useToast } from '@/hooks/use-toast';

interface ChildDevice {
  id: string;
  name: string;
  status: ComplianceStatus;
  lastActive: Date;
  schoolModeActive: boolean;
  todayCompliance: number;
  hasOptedIn: boolean;
}

// Mock child data - with one in amber status to show notifications
const mockChildren: ChildDevice[] = [
  {
    id: '1',
    name: 'Aoife',
    status: 'amber',
    lastActive: new Date(),
    schoolModeActive: false,
    todayCompliance: 94,
    hasOptedIn: true,
  },
  {
    id: '2',
    name: 'Ciarán',
    status: 'green',
    lastActive: new Date(Date.now() - 300000),
    schoolModeActive: false,
    todayCompliance: 88,
    hasOptedIn: false,
  },
];

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: '1',
    childName: 'Aoife',
    status: 'amber',
    message: 'Aoife paused their focus session — they might need a little encouragement!',
    timestamp: new Date(Date.now() - 120000), // 2 minutes ago
    read: false,
  },
];

const statusConfig: Record<ComplianceStatus, { icon: React.ElementType; label: string; className: string; bgClass: string }> = {
  green: { icon: CheckCircle, label: 'Focusing', className: 'text-emerald-500', bgClass: 'bg-emerald-500/10' },
  amber: { icon: AlertTriangle, label: 'Taking a break', className: 'text-amber-500', bgClass: 'bg-amber-500/10' },
  red: { icon: XCircle, label: 'Not started yet', className: 'text-red-500', bgClass: 'bg-red-500/10' },
};

const ParentDashboard = () => {
  const { 
    resetOnboarding, 
    sendEncouragement,
    parentNotifications,
    dismissParentNotification,
    dismissAllParentNotifications
  } = useApp();
  const { toast } = useToast();
  const [children, setChildren] = useState<ChildDevice[]>(mockChildren);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState('overview');

  // Watch for status changes and create notifications
  useEffect(() => {
    const checkStatusChanges = () => {
      children.forEach(child => {
        if (child.status === 'amber' || child.status === 'red') {
          const existingNotification = notifications.find(
            n => n.childName === child.name && !n.read && n.status === child.status
          );
          
          if (!existingNotification) {
            const message = child.status === 'red' 
              ? `${child.name} hasn't started a focus session yet today.`
              : `${child.name} paused their focus session — they might need a little encouragement!`;
            
            const newNotification: Notification = {
              id: Date.now().toString(),
              childName: child.name,
              status: child.status,
              message,
              timestamp: new Date(),
              read: false,
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            
            toast({
              title: `${child.name} — Focus Update`,
              description: message,
              variant: 'default',
            });
          }
        }
      });
    };

    checkStatusChanges();
  }, [children]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const dismissAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold">Fócas Family</h1>
              <p className="text-xs text-muted-foreground">Guardian Dashboard</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => { resetOnboarding(); window.location.href = '/'; }}>
            <LogOut className="w-4 h-4 mr-1" />
            Sign out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        {/* Demo mode banner */}
        <div className="mb-4 rounded-xl border border-border/50 bg-muted/50 px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">
            Demo mode — showing sample data. Real data requires account setup.
          </p>
        </div>
        {/* Guardian Activity Notifications (emergency, early exit, missed sessions) */}
        <GuardianNotificationBanner 
          notifications={parentNotifications}
          onDismiss={dismissParentNotification}
          onDismissAll={dismissAllParentNotifications}
        />

        {/* Compliance Notifications */}
        <ComplianceNotification 
          notifications={notifications}
          onDismiss={dismissNotification}
          onDismissAll={dismissAllNotifications}
        />

        {/* Quick Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Your Children</p>
              <p className="text-3xl font-bold text-primary">{children.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Focusing Today</p>
              <p className="text-2xl font-semibold">
                {children.filter(c => c.status === 'green').length}
              </p>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="unlock" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              <span className="hidden sm:inline">Unlock</span>
            </TabsTrigger>
            <TabsTrigger value="encourage" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Encourage</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Your Children</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Support their focus journey
              </p>
            </div>

            {children.map((child, index) => {
              const StatusIcon = statusConfig[child.status].icon;
              return (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full ${statusConfig[child.status].bgClass} flex items-center justify-center`}>
                            <span className="text-lg font-semibold text-primary">
                              {child.name[0]}
                            </span>
                          </div>
                          <div>
                            <div>
                              <h4 className="font-semibold">{child.name}</h4>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <StatusIcon className={`w-4 h-4 ${statusConfig[child.status].className}`} />
                              <span>{statusConfig[child.status].label}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{child.todayCompliance}%</p>
                          <p className="text-xs text-muted-foreground">Today's Focus Score</p>
                        </div>
                      </div>

                      {localStorage.getItem('focas_share_blocked_with_guardian') === 'true' && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground mb-1.5">Blocking during sessions:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {getBlockedCategories().map((cat) => (
                              <Badge key={cat} variant="secondary" className="text-xs font-normal">
                                {cat}
                              </Badge>
                            ))}
                            {getBlockedCategories().length === 0 && (
                              <span className="text-xs text-muted-foreground italic">None selected</span>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t flex items-center justify-end">
                        <p className="text-xs text-muted-foreground">
                          Last active: {formatLastActive(child.lastActive)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </TabsContent>

          {/* Unlock Tab */}
          <TabsContent value="unlock" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Unlock Codes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Generate a temporary code for your child to end their Fócas session early when needed.
              </p>
            </div>

            {children.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <GuardianCodeGenerator childName={child.name} />
              </motion.div>
            ))}
          </TabsContent>

          {/* Encourage Tab */}
          <TabsContent value="encourage" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Send Encouragement</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Send a quick message of support to your children
              </p>
            </div>

            {children.map((child, index) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EncouragementSender
                  childName={child.name}
                  onSend={(message) => sendEncouragement(message, 'Guardian')}
                />
              </motion.div>
            ))}
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Recent Activity</h3>
              <p className="text-sm text-muted-foreground mb-4">
                See how your children's focus sessions are going
              </p>
            </div>

            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Focus activity will appear here once your child starts using Fócas.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
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

export default ParentDashboard;
