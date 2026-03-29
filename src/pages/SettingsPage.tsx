import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, AlertTriangle, ChevronRight, LogOut, Clock, Smartphone, CheckCircle, XCircle, Loader2, AppWindow } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { useScreenTime } from '@/hooks/useScreenTime';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type EmergencyDuration = 5 | 10 | null; // null means "Until I re-enable"

type SettingsView = 'main' | 'profile' | 'emergency' | 'screentime';

// Emergency deactivation reasons
const EMERGENCY_REASONS = [
  { value: 'medical', label: 'Medical emergency' },
  { value: 'family_contact', label: 'Need to contact family' },
  { value: 'school_activity', label: 'School activity requires phone' },
  { value: 'transport', label: 'Transport/pickup coordination' },
  { value: 'safety', label: 'Safety concern' },
  { value: 'other', label: 'Other reason' },
];

const SettingsPage = () => {
  const [currentView, setCurrentView] = useState<SettingsView>('main');
  const { resetOnboarding, isEmergencyUnlocked, setEmergencyUnlocked } = useApp();

  if (currentView === 'profile') {
    return (
      <MobileLayout>
        <div className="px-5 pt-14 pb-6">
          <button
            onClick={() => setCurrentView('main')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back to Settings</span>
          </button>
          <ProfileContent />
        </div>
      </MobileLayout>
    );
  }

  if (currentView === 'emergency') {
    return (
      <MobileLayout>
        <div className="px-5 pt-14 pb-6">
          <button
            onClick={() => setCurrentView('main')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back to Settings</span>
          </button>
          <EmergencyContent />
        </div>
      </MobileLayout>
    );
  }

  if (currentView === 'screentime') {
    return (
      <MobileLayout>
        <div className="px-5 pt-14 pb-6">
          <button
            onClick={() => setCurrentView('main')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back to Settings</span>
          </button>
          <ScreenTimeContent />
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
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your account</p>
        </motion.div>

        <div className="space-y-3">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => setCurrentView('profile')}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">Profile</p>
                <p className="text-xs text-muted-foreground">View your account info</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setCurrentView('screentime')}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium">Screen Time</p>
                <p className="text-xs text-muted-foreground">View permission status</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => setCurrentView('emergency')}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-status-amber/10 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-status-amber" />
              </div>
              <div className="text-left">
                <p className="font-medium">Emergency Unlock</p>
                <p className="text-xs text-muted-foreground">Temporarily disable Study Mode</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => window.location.href = '/apps'}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center">
                <AppWindow className="w-5 h-5 text-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium">App Management</p>
                <p className="text-xs text-muted-foreground">Choose apps to limit</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetOnboarding();
              window.location.href = '/';
            }}
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

const ProfileContent = () => {
  const { schoolSettings } = useApp();
  
  const profile = {
    name: 'Student User',
    email: 'student@school.ie',
    grade: '5A',
    school: schoolSettings.schoolName,
    joinedDate: 'September 2024',
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-6 rounded-2xl bg-card border"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-2xl font-semibold text-primary">SU</span>
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          <p className="text-muted-foreground">Student</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-card border space-y-4"
      >
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        
        <div className="space-y-4">
          {[
            { label: 'Full Name', value: profile.name },
            { label: 'Email Address', value: profile.email },
            { label: 'School', value: profile.school },
            { label: 'Grade', value: profile.grade },
            { label: 'Member Since', value: profile.joinedDate },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const ScreenTimeContent = () => {
  const { status, isAuthorized, isLoading, isNative, requestAuthorization, refreshStatus } = useScreenTime();

  const getStatusDisplay = () => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          label: 'Connected',
          description: 'Screen Time is connected and active',
          color: 'text-status-green',
          bgColor: 'bg-status-green/10'
        };
      case 'denied':
        return {
          icon: XCircle,
          label: 'Denied',
          description: 'Permission was denied. Enable in Settings > Screen Time',
          color: 'text-status-red',
          bgColor: 'bg-status-red/10'
        };
      case 'notDetermined':
      default:
        return {
          icon: Smartphone,
          label: 'Not Connected',
          description: 'Connect to enable focus mode support',
          color: 'text-muted-foreground',
          bgColor: 'bg-muted/50'
        };
    }
  };

  const statusDisplay = getStatusDisplay();
  const StatusIcon = statusDisplay.icon;

  const handleRequestPermission = async () => {
    await requestAuthorization();
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className={`w-20 h-20 rounded-full ${statusDisplay.bgColor} flex items-center justify-center mx-auto mb-4`}>
          {isLoading ? (
            <Loader2 className="w-10 h-10 text-muted-foreground animate-spin" />
          ) : (
            <StatusIcon className={`w-10 h-10 ${statusDisplay.color}`} />
          )}
        </div>
        <h2 className="text-2xl font-bold">Screen Time</h2>
        <p className="text-muted-foreground mt-2">
          Manage Screen Time integration for focus mode support.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-card border"
      >
        <h3 className="text-lg font-semibold mb-4">Permission Status</h3>

        <div className={`p-4 rounded-xl ${statusDisplay.bgColor} mb-4`}>
          <div className="flex items-center gap-3">
            <StatusIcon className={`w-6 h-6 ${statusDisplay.color}`} />
            <div>
              <p className={`font-medium ${statusDisplay.color}`}>{statusDisplay.label}</p>
              <p className="text-sm text-muted-foreground">{statusDisplay.description}</p>
            </div>
          </div>
        </div>

        {!isNative && (
          <div className="p-3 rounded-xl bg-status-amber/10 border border-status-amber/20 mb-4">
            <p className="text-sm text-status-amber">
              <strong>Note:</strong> Full Screen Time integration requires the native iOS app. 
              This is a simulated permission for demo purposes.
            </p>
          </div>
        )}

        {status !== 'approved' && (
          <Button
            onClick={handleRequestPermission}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              'Connect to Screen Time'
            )}
          </Button>
        )}

        {status === 'approved' && (
          <Button
            variant="outline"
            onClick={refreshStatus}
            disabled={isLoading}
            className="w-full"
          >
            Refresh Status
          </Button>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-card border"
      >
        <h3 className="text-lg font-semibold mb-4">How Screen Time Helps You</h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Focus Mode Support</p>
              <p className="text-xs text-muted-foreground">Helps you stay focused by managing app access when you enable Study Mode</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Screen Time Insights</p>
              <p className="text-xs text-muted-foreground">View your screen time patterns to build healthy digital habits</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Schedule-Aware Settings</p>
              <p className="text-xs text-muted-foreground">Your focus preferences can sync with your school timetable if you choose</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const EmergencyContent = () => {
  const { isEmergencyUnlocked, setEmergencyUnlocked, setFocasModeActive, notifyParent } = useApp();
  const [selectedDuration, setSelectedDuration] = useState<EmergencyDuration>(5);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [otherReason, setOtherReason] = useState<string>('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [unlockEndTime, setUnlockEndTime] = useState<Date | null>(null);

  // Timer effect for timed unlocks
  useEffect(() => {
    if (!isEmergencyUnlocked || !unlockEndTime) {
      setTimeRemaining(null);
      return;
    }

    const updateRemaining = () => {
      const now = new Date();
      const remaining = Math.max(0, Math.floor((unlockEndTime.getTime() - now.getTime()) / 1000));
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        handleReactivate();
      }
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [isEmergencyUnlocked, unlockEndTime]);

  const getReasonText = () => {
    if (selectedReason === 'other') {
      return otherReason.trim() || 'Other reason (not specified)';
    }
    return EMERGENCY_REASONS.find(r => r.value === selectedReason)?.label || 'Unknown reason';
  };

  const handleEmergencyUnlock = (duration: EmergencyDuration) => {
    if (!selectedReason) return;

    const reasonText = getReasonText();
    
    setEmergencyUnlocked(true);
    setFocasModeActive(false);
    
    if (duration) {
      const endTime = new Date(Date.now() + duration * 60 * 1000);
      setUnlockEndTime(endTime);
    } else {
      setUnlockEndTime(null);
    }

    // Save emergency log for admin tracking
    const emergencyLog = {
      timestamp: new Date().toISOString(),
      reason: selectedReason,
      reasonText,
      duration: duration ? `${duration} minutes` : 'indefinite',
      studentName: 'Student User',
    };
    const existingLogs = JSON.parse(localStorage.getItem('focas_emergency_logs') || '[]');
    localStorage.setItem('focas_emergency_logs', JSON.stringify([emergencyLog, ...existingLogs]));

    // Notify guardian with reason
    const durationText = duration ? `${duration} minutes` : 'indefinitely';
    notifyParent(
      'emergency_exit',
      'Student User',
      `Used emergency unlock for ${durationText}. Reason: ${reasonText}`
    );
  };

  const handleReactivate = () => {
    setEmergencyUnlocked(false);
    setFocasModeActive(true);
    setUnlockEndTime(null);
    setTimeRemaining(null);
    setSelectedReason('');
    setOtherReason('');
  };

  const formatTimeRemaining = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const durationOptions: { value: EmergencyDuration; label: string; description: string }[] = [
    { value: 5, label: '5 minutes', description: 'Quick call or message' },
    { value: 10, label: '10 minutes', description: 'Short break' },
    { value: null, label: 'Until I re-enable', description: 'Manual reactivation required' },
  ];

  const canUnlock = selectedReason && (selectedReason !== 'other' || otherReason.trim());

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-full bg-status-amber/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-10 h-10 text-status-amber" />
        </div>
        <h2 className="text-2xl font-bold">Emergency Unlock</h2>
        <p className="text-muted-foreground mt-2">
          Use this only in genuine emergencies when you need immediate access to your phone.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-card border"
      >
        {isEmergencyUnlocked ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-status-amber/10 border border-status-amber/20">
              <p className="text-sm text-center">
                <span className="font-semibold text-status-amber">Emergency mode is active.</span>
                <br />
                Study Mode has been temporarily disabled.
              </p>
              {timeRemaining !== null && (
                <div className="mt-3 flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-status-amber" />
                  <span className="text-lg font-bold text-status-amber">
                    {formatTimeRemaining(timeRemaining)}
                  </span>
                  <span className="text-sm text-muted-foreground">remaining</span>
                </div>
              )}
            </div>
            <Button
              onClick={handleReactivate}
              className="w-full"
              variant="outline"
            >
              Reactivate Study Mode
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              This will notify your teacher and temporarily disable Study Mode. Only use for real emergencies.
            </p>

            {/* Reason Selection */}
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Reason for Emergency Unlock
              </Label>
              <Select value={selectedReason} onValueChange={setSelectedReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent>
                  {EMERGENCY_REASONS.map((reason) => (
                    <SelectItem key={reason.value} value={reason.value}>
                      {reason.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Other Reason Input */}
            {selectedReason === 'other' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <Label htmlFor="otherReason" className="text-xs font-medium text-muted-foreground">
                  Please describe your reason
                </Label>
                <Input
                  id="otherReason"
                  placeholder="Enter your reason..."
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  maxLength={100}
                />
              </motion.div>
            )}
            
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Select Duration
              </p>
              {durationOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => setSelectedDuration(option.value)}
                  className={`w-full p-3 rounded-xl border text-left transition-all ${
                    selectedDuration === option.value
                      ? 'border-status-amber bg-status-amber/10'
                      : 'border-border hover:border-status-amber/50 hover:bg-muted/50'
                  }`}
                >
                  <p className={`font-medium ${selectedDuration === option.value ? 'text-status-amber' : ''}`}>
                    {option.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </button>
              ))}
            </div>
            
            <Button
              onClick={() => handleEmergencyUnlock(selectedDuration)}
              disabled={!canUnlock}
              className="w-full bg-status-amber hover:bg-status-amber/90 text-white disabled:opacity-50"
            >
              Emergency Unlock {selectedDuration ? `for ${selectedDuration} min` : ''}
            </Button>

            {!selectedReason && (
              <p className="text-xs text-muted-foreground text-center">
                Please select a reason to continue
              </p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SettingsPage;
