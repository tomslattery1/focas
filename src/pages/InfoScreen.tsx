import { motion } from 'framer-motion';
import { Users, BookOpen, Shield, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/app';

interface InfoScreenProps {
  role: 'parent' | 'teacher';
  onBack: () => void;
}

const roleContent = {
  parent: {
    icon: Users,
    title: 'For Parents',
    subtitle: 'Supporting your child\'s focus at school',
    points: [
      'Fócas helps students stay focused during school hours',
      'Your child\'s school has adopted this wellbeing tool',
      'No personal data is shared without consent',
      'Contact your school for more information about enrollment',
    ],
  },
  teacher: {
    icon: BookOpen,
    title: 'For Teachers',
    subtitle: 'Understanding classroom integration',
    points: [
      'Fócas supports a distraction-free learning environment',
      'Students can easily see their compliance status',
      'Emergency unlock options are available when needed',
      'Contact your administrator for implementation details',
    ],
  },
};

const InfoScreen = ({ role, onBack }: InfoScreenProps) => {
  const content = roleContent[role];
  const Icon = content.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col mt-8"
      >
        {/* Icon */}
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Icon className="w-10 h-10 text-primary" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold text-foreground text-center mb-2">
          {content.title}
        </h1>
        <p className="text-muted-foreground text-center mb-10">
          {content.subtitle}
        </p>

        {/* Info points */}
        <div className="space-y-4 max-w-sm mx-auto w-full">
          {content.points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-status-green flex-shrink-0 mt-0.5" />
              <p className="text-foreground text-sm leading-relaxed">{point}</p>
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-10 p-4 rounded-xl bg-muted/50 max-w-sm mx-auto w-full">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Privacy First
              </p>
              <p className="text-xs text-muted-foreground">
                Fócas is designed with student privacy in mind. All data handling complies with educational privacy standards.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="pt-8 pb-4">
        <Button
          variant="outline"
          className="w-full h-12"
          onClick={onBack}
        >
          Go back to role selection
        </Button>
      </div>
    </div>
  );
};

export default InfoScreen;
