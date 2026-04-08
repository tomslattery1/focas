import { MobileLayout } from '@/components/layout/MobileLayout';

import { useApp } from '@/contexts/AppContext';
import { motion } from 'framer-motion';
import {
  User,
  LogOut,
  ChevronRight,
  FileText,
  Lock,
  Heart,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const MvpSettingsPage = () => {
  const { resetOnboarding, hasOptedInToShare, setHasOptedInToShare, schoolSettings } = useApp();
  const navigate = useNavigate();
  const [shareWithTeacher, setShareWithTeacher] = useState(() => {
    return localStorage.getItem('focas_share_with_teacher') === 'true';
  });

  const handleTeacherShareChange = (checked: boolean) => {
    setShareWithTeacher(checked);
    localStorage.setItem('focas_share_with_teacher', String(checked));
  };

  const handleSignOut = () => {
    resetOnboarding();
    window.location.href = '/';
  };

  return (
    <MobileLayout>
      <div className="px-5 pt-14 pb-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </motion.div>


        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-5 border border-border/50 shadow-card mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Student User</h3>
              <p className="text-sm text-muted-foreground">Student</p>
            </div>
          </div>
        </motion.div>

        {/* Sharing & settings */}
        <div className="space-y-4 mb-6">
          {/* Guardian sharing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-card rounded-xl p-4 border border-border/50 shadow-card flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground text-sm">Let your guardian cheer you on</h4>
              <p className="text-xs text-muted-foreground">They see on/off only — never your apps</p>
            </div>
            <Switch checked={hasOptedInToShare} onCheckedChange={setHasOptedInToShare} />
          </motion.div>

          {/* Teacher sharing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="bg-card rounded-xl p-4 border border-border/50 shadow-card flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground text-sm">Let your teacher see you're focused</h4>
              <p className="text-xs text-muted-foreground">On/off only — your apps stay private</p>
            </div>
            <Switch checked={shareWithTeacher} onCheckedChange={setShareWithTeacher} />
          </motion.div>

          {/* Privacy Policy */}
          <SettingsLink
            icon={<Lock className="w-5 h-5 text-primary" />}
            label="Privacy Policy"
            sub="How we protect your data"
            onClick={() => navigate('/privacy')}
            delay={0.1}
          />

          {/* Terms */}
          <SettingsLink
            icon={<FileText className="w-5 h-5 text-primary" />}
            label="Terms of Service"
            sub="Usage terms and conditions"
            onClick={() => navigate('/terms')}
            delay={0.15}
          />
        </div>

        {/* Account sync notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-muted/50 rounded-xl p-4 border border-border/50 mb-4"
        >
          <p className="text-sm text-muted-foreground text-center">
            Account sync coming soon — your data is currently stored on this device only.
          </p>
        </motion.div>

        {/* Reset */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full text-muted-foreground hover:text-foreground hover:bg-muted/50 border-border"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Restart Onboarding
          </Button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-xs text-muted-foreground text-center mt-6"
        >
          Fócas v1.0.0 (MVP) · © 2026 Fócas Education
        </motion.p>
      </div>
    </MobileLayout>
  );
};

function SettingsLink({
  icon,
  label,
  sub,
  onClick,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  onClick: () => void;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <button
        onClick={onClick}
        className="w-full bg-card rounded-xl p-4 border border-border/50 shadow-card flex items-center gap-4 hover:bg-accent/50 transition-colors"
      >
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1 text-left">
          <h4 className="font-medium text-foreground text-sm">{label}</h4>
          <p className="text-xs text-muted-foreground">{sub}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </button>
    </motion.div>
  );
}

export default MvpSettingsPage;
