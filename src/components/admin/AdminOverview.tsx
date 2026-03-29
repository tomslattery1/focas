import { motion } from 'framer-motion';
import { 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  TrendingUp,
  Clock,
  AppWindow,
  GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ComplianceTrendCharts } from './ComplianceTrendCharts';
import { useApp } from '@/contexts/AppContext';

const stats = {
  totalStudents: 598, // ~100 per year × 6 years
  totalTeachers: 42,
  totalClasses: 24, // 4 classes per year × 6 years
  focusScore: 89,
  activeFocasMode: 512,
  appsPending: 47,
};

const recentAlerts = [
  { id: '1', student: 'Oisin Murphy', type: 'red', message: 'Needs focus for 2+ hours', time: '10 min ago' },
  { id: '2', student: "Liam O'Connor", type: 'red', message: 'Fócas Mode deactivated during school hours', time: '25 min ago' },
  { id: '3', student: 'Saoirse Byrne', type: 'amber', message: 'Focus score dropped below 80%', time: '1 hour ago' },
  { id: '4', student: 'Jack Brennan', type: 'amber', message: 'App recommendations not accepted', time: '2 hours ago' },
];

const topCompliant = [
  { name: 'Aoife Ryan', class: '6A', percentage: 98 },
  { name: 'Grace Fitzgerald', class: '3A', percentage: 96 },
  { name: 'Cian Kelly', class: '6A', percentage: 95 },
  { name: 'Niamh Walsh', class: '5A', percentage: 92 },
];

export const AdminOverview = () => {
  const { schoolSettings } = useApp();
  
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-semibold">Welcome back, Admin</h2>
        <p className="text-muted-foreground">Here's what's happening at {schoolSettings.schoolName} today</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold">{stats.totalStudents}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-emerald-500/20 bg-emerald-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-600">Focus Score</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats.focusScore}%</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Fócas Mode</p>
                  <p className="text-3xl font-bold">{stats.activeFocasMode}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-600">Apps Pending</p>
                  <p className="text-3xl font-bold text-amber-600">{stats.appsPending}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <AppWindow className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Compliance Trend Charts */}
      <ComplianceTrendCharts />

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    alert.type === 'red' ? 'bg-red-500/10' : 'bg-amber-500/10'
                  }`}>
                    {alert.type === 'red' ? (
                      <XCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{alert.student}</p>
                    <p className="text-xs text-muted-foreground truncate">{alert.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{alert.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Focused */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Top Focused Students
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {topCompliant.map((student, index) => (
                <div key={student.name} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.class}</p>
                  </div>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">
                    {student.percentage}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="grid grid-cols-3 gap-4"
      >
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalTeachers}</p>
              <p className="text-sm text-muted-foreground">Teachers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalClasses}</p>
              <p className="text-sm text-muted-foreground">Classes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">{Math.round(stats.activeFocasMode / stats.totalStudents * 100)}%</p>
              <p className="text-sm text-muted-foreground">Currently Focused</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
