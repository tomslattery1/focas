import { motion } from 'framer-motion';
import { GraduationCap, Users, BookOpen, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/app';

interface RoleSelectionScreenProps {
  onSelectRole: (role: UserRole) => void;
}

const roles = [
  {
    id: 'student' as UserRole,
    label: 'Student',
    icon: GraduationCap,
    description: 'Access focus tools & track progress',
  },
  {
    id: 'parent' as UserRole,
    label: 'Guardian',
    icon: Users,
    description: 'Learn how Fócas supports your child',
  },
  {
    id: 'teacher' as UserRole,
    label: 'Teacher',
    icon: BookOpen,
    description: 'Understand classroom integration',
  },
  {
    id: 'admin' as UserRole,
    label: 'School Admin',
    sublabel: 'Desktop',
    icon: Shield,
    description: 'Manage school settings & approvals',
  },
];

const RoleSelectionScreen = ({ onSelectRole }: RoleSelectionScreenProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col"
      >
        <div className="text-center mb-12">
          <h1 className="text-2xl font-semibold text-foreground mb-3">
            Select how you're using this app
          </h1>
          <p className="text-muted-foreground text-sm">
            Choose your role to get started
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-4 max-w-sm mx-auto w-full">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                className="w-full h-auto p-5 flex items-start gap-4 hover:bg-accent/50 hover:border-primary/30 transition-all"
                onClick={() => onSelectRole(role.id)}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <role.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium text-foreground">
                      {role.label}
                    </span>
                    {role.sublabel && (
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {role.sublabel}
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
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
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-8"
        >
          Some features are role-specific
        </motion.p>
      </motion.div>
    </div>
  );
};

export default RoleSelectionScreen;
