import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpen, Shield, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types/app';

interface DemoRoleSelectorProps {
  onSelectRole: (role: UserRole) => void;
  onContinueAsStudent: () => void;
}

const demoRoles = [
  {
    id: 'student' as UserRole,
    label: 'Student',
    icon: GraduationCap,
    description: 'Full onboarding & focus experience',
    isPrimary: true,
  },
  {
    id: 'parent' as UserRole,
    label: 'Guardian',
    icon: Users,
    description: 'Family oversight dashboard',
  },
  {
    id: 'teacher' as UserRole,
    label: 'Teacher',
    icon: BookOpen,
    description: 'Classroom view & tools',
  },
  {
    id: 'admin' as UserRole,
    label: 'School Admin',
    icon: Shield,
    description: 'School-wide management',
  },
];

const DemoRoleSelector = ({ onSelectRole, onContinueAsStudent }: DemoRoleSelectorProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col"
      >
        {/* Demo Mode Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          <Badge variant="outline" className="px-3 py-1.5 gap-1.5 text-sm border-primary/30 bg-primary/5">
            <FlaskConical className="w-3.5 h-3.5 text-primary" />
            Demo Mode
          </Badge>
        </motion.div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold text-foreground mb-3">
            Choose a role to explore
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            In the final app, your role will be set by your login credentials. For now, pick a view to explore.
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-3 max-w-sm mx-auto w-full">
          {demoRoles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            >
              <Button
                variant={role.isPrimary ? 'default' : 'outline'}
                className={`w-full h-auto p-4 flex items-start gap-4 transition-all ${
                  role.isPrimary
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'hover:bg-accent/50 hover:border-primary/30'
                }`}
                onClick={() => onSelectRole(role.id)}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  role.isPrimary ? 'bg-primary-foreground/20' : 'bg-primary/10'
                }`}>
                  <role.icon className={`w-5 h-5 ${role.isPrimary ? 'text-primary-foreground' : 'text-primary'}`} />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className={`text-base font-medium ${role.isPrimary ? '' : 'text-foreground'}`}>
                      {role.label}
                    </span>
                    {role.isPrimary && (
                      <span className="text-xs bg-primary-foreground/20 px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <span className={`text-sm ${role.isPrimary ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {role.description}
                  </span>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          This selector is for demonstration only and won't appear in the final app
        </motion.p>
      </motion.div>
    </div>
  );
};

export default DemoRoleSelector;
