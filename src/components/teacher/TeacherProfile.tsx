import { motion } from 'framer-motion';
import { User, Mail, Building2, Shield, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useApp } from '@/contexts/AppContext';

export const TeacherProfile = () => {
  const { schoolSettings } = useApp();

  const profile = {
    name: 'Tom Slattery',
    email: 'tom.slattery@school.ie',
    role: 'Teacher',
    school: schoolSettings.schoolName,
    joinedDate: 'September 2024',
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 p-6 rounded-2xl bg-card border"
      >
        <Avatar className="w-20 h-20">
          <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
            TS
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          <p className="text-muted-foreground">{profile.role}</p>
        </div>
      </motion.div>

      {/* Account Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-card border space-y-4"
      >
        <h3 className="text-lg font-semibold mb-4">Account Information</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <User className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="font-medium">{profile.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <Mail className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email Address</p>
              <p className="font-medium">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">School</p>
              <p className="font-medium">{profile.school}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="font-medium">{profile.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Member Since</p>
              <p className="font-medium">{profile.joinedDate}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
