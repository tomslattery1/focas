import { motion } from 'framer-motion';
import { School, Shield, Info } from 'lucide-react';

interface SchoolSupervisionNoticeProps {
  variant?: 'compact' | 'full';
  schoolName?: string;
}

/**
 * School Supervision Notice - Apple Compliance Component
 * 
 * Displays required notice that the app operates under school supervision.
 * Required for apps used in educational settings with minors.
 */
export const SchoolSupervisionNotice = ({ 
  variant = 'compact',
  schoolName = 'Your School' 
}: SchoolSupervisionNoticeProps) => {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
        <School className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          This app operates under <span className="font-medium text-foreground">{schoolName}</span> supervision
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-card border border-border space-y-3"
    >
      <div className="flex items-center gap-2">
        <School className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">School-Supervised App</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Fócas is provided by your school to support student focus and wellbeing during 
        study time. The app operates under school supervision.
      </p>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Your school has policies in place governing app use
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Parents/guardians have been informed about this app
          </p>
        </div>
      </div>
    </motion.div>
  );
};
