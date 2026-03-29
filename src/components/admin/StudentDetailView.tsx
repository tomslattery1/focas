import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  AppWindow,
  Shield,
  TrendingUp,
  Bell,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface StudentDetailViewProps {
  studentId: string;
  onBack: () => void;
}

// Mock student data
const getStudentData = (id: string) => ({
  id,
  firstName: 'Oisin',
  lastName: 'Murphy',
  email: 'oisin.murphy@school.ie',
  yearGroup: '6th Year',
  className: '6B',
  complianceStatus: 'red' as const,
  compliancePercentage: 45,
  studyModeActive: false,
  joinedDate: '2024-09-01',
  guardian: {
    name: 'Margaret Murphy',
    email: 'margaret.murphy@email.ie',
    phone: '+353 86 123 4567',
  },
  stats: {
    totalDaysActive: 87,
    averageCompliance: 62,
    studyModeHoursThisWeek: 12,
    deactivationsThisMonth: 8,
  },
  limitedApps: [
    { name: 'TikTok', limited: true },
    { name: 'Instagram', limited: true },
    { name: 'Snapchat', limited: false },
    { name: 'YouTube', limited: true },
    { name: 'Twitter/X', limited: false },
    { name: 'Games', limited: true },
  ],
  complianceHistory: [
    { date: 'Mon', percentage: 52 },
    { date: 'Tue', percentage: 48 },
    { date: 'Wed', percentage: 35 },
    { date: 'Thu', percentage: 42 },
    { date: 'Fri', percentage: 55 },
    { date: 'Sat', percentage: 68 },
    { date: 'Sun', percentage: 45 },
  ],
  recentActivity: [
    { id: '1', action: 'Study Mode deactivated', time: '2 hours ago', type: 'warning' },
    { id: '2', action: 'Limited app access attempt: TikTok', time: '3 hours ago', type: 'alert' },
    { id: '3', action: 'Compliance dropped below 50%', time: '5 hours ago', type: 'alert' },
    { id: '4', action: 'Study Mode activated via NFC', time: '6 hours ago', type: 'success' },
    { id: '5', action: 'Guardian notification sent', time: '1 day ago', type: 'info' },
  ],
});

const statusConfig = {
  green: { icon: CheckCircle, label: 'Compliant', className: 'text-emerald-500', bgClass: 'bg-emerald-500/10' },
  amber: { icon: AlertTriangle, label: 'Warning', className: 'text-amber-500', bgClass: 'bg-amber-500/10' },
  red: { icon: XCircle, label: 'Non-compliant', className: 'text-red-500', bgClass: 'bg-red-500/10' },
};

const activityTypeConfig = {
  success: { className: 'text-emerald-500 bg-emerald-500/10' },
  warning: { className: 'text-amber-500 bg-amber-500/10' },
  alert: { className: 'text-red-500 bg-red-500/10' },
  info: { className: 'text-primary bg-primary/10' },
};

export const StudentDetailView = ({ studentId, onBack }: StudentDetailViewProps) => {
  const [student] = useState(getStudentData(studentId));
  const StatusIcon = statusConfig[student.complianceStatus].icon;

  const handleSendReminder = () => {
    toast.success('Reminder sent to student');
  };

  const handleNotifyGuardian = () => {
    toast.success('Notification sent to guardian');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{student.firstName} {student.lastName}</h2>
          <p className="text-muted-foreground">{student.yearGroup} • {student.className}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSendReminder}>
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Reminder
          </Button>
          <Button variant="outline" onClick={handleNotifyGuardian}>
            <Bell className="w-4 h-4 mr-2" />
            Notify Guardian
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Student Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-6"
        >
          {/* Profile Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{student.firstName} {student.lastName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-6 h-6 rounded-full ${statusConfig[student.complianceStatus].bgClass} flex items-center justify-center`}>
                      <StatusIcon className={`w-3 h-3 ${statusConfig[student.complianceStatus].className}`} />
                    </div>
                    <span className={`text-sm ${statusConfig[student.complianceStatus].className}`}>
                      {statusConfig[student.complianceStatus].label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Joined {new Date(student.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guardian Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Guardian Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{student.guardian.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{student.guardian.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{student.guardian.phone}</span>
              </div>
            </CardContent>
          </Card>

          {/* App Limit Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AppWindow className="w-4 h-4" />
                App Limit Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {student.limitedApps.map((app) => (
                  <div 
                    key={app.name} 
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                      app.limited ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-500'
                    }`}
                  >
                    {app.limited ? (
                      <CheckCircle className="w-3 h-3" />
                    ) : (
                      <XCircle className="w-3 h-3" />
                    )}
                    <span>{app.name}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {student.limitedApps.filter(a => a.limited).length} of {student.limitedApps.length} recommended apps limited
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Middle Column - Stats & Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          {/* Compliance Score */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground mb-2">Current Compliance</p>
                <p className={`text-5xl font-bold ${statusConfig[student.complianceStatus].className}`}>
                  {student.compliancePercentage}%
                </p>
              </div>
              <Progress 
                value={student.compliancePercentage} 
                className="h-3"
              />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{student.stats.averageCompliance}%</p>
                    <p className="text-xs text-muted-foreground">Avg Compliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{student.stats.studyModeHoursThisWeek}h</p>
                    <p className="text-xs text-muted-foreground">Study Mode</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{student.stats.totalDaysActive}</p>
                    <p className="text-xs text-muted-foreground">Days Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{student.stats.deactivationsThisMonth}</p>
                    <p className="text-xs text-muted-foreground">Deactivations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Weekly Compliance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={student.complianceHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="studentCompliance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11 }} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 11 }} 
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                    />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="percentage" 
                      stroke="hsl(var(--primary))" 
                      fill="url(#studentCompliance)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - Activity */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {student.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activityTypeConfig[activity.type as keyof typeof activityTypeConfig].className
                    }`}>
                      {activity.type === 'success' && <CheckCircle className="w-4 h-4" />}
                      {activity.type === 'warning' && <AlertTriangle className="w-4 h-4" />}
                      {activity.type === 'alert' && <XCircle className="w-4 h-4" />}
                      {activity.type === 'info' && <Bell className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
