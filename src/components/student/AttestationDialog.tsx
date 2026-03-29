import { motion } from 'framer-motion';
import { Check, AlertTriangle, X, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRecommendations } from '@/contexts/RecommendationContext';
import { useToast } from '@/hooks/use-toast';
import { AttestationStatus } from '@/types/recommendations';

interface AttestationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AttestationDialog = ({ open, onOpenChange }: AttestationDialogProps) => {
  const { submitAttestation, pendingRecommendation } = useRecommendations();
  const { toast } = useToast();

  const handleSubmit = (status: AttestationStatus) => {
    submitAttestation(status);
    onOpenChange(false);
    
    const messages = {
      applied: {
        title: 'Focus mode activated',
        description: 'Your teacher has been notified. Stay focused!',
      },
      partial: {
        title: 'Settings partially applied',
        description: 'Your teacher has been notified of your response.',
      },
      skipped: {
        title: 'Recommendation skipped',
        description: 'Your teacher has been notified that you skipped this time.',
      },
    };

    toast(messages[status]);
  };

  const options = [
    {
      status: 'applied' as AttestationStatus,
      label: 'Applied',
      description: 'I blocked the recommended apps',
      icon: Check,
      color: 'bg-status-green/10 border-status-green/30 hover:bg-status-green/20',
      iconColor: 'text-status-green',
    },
    {
      status: 'partial' as AttestationStatus,
      label: 'Partially Applied',
      description: 'I blocked some of the apps',
      icon: AlertTriangle,
      color: 'bg-status-amber/10 border-status-amber/30 hover:bg-status-amber/20',
      iconColor: 'text-status-amber',
    },
    {
      status: 'skipped' as AttestationStatus,
      label: 'Skipped',
      description: "I didn't block any apps",
      icon: X,
      color: 'bg-status-red/10 border-status-red/30 hover:bg-status-red/20',
      iconColor: 'text-status-red',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            <Shield className="w-7 h-7 text-primary" />
          </div>
          <DialogTitle className="text-xl">
            Did you apply the focus settings?
          </DialogTitle>
          <DialogDescription className="text-center">
            Let your teacher know if you activated focus mode for{' '}
            <span className="font-medium">{pendingRecommendation?.className || 'this class'}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {options.map((option, index) => (
            <motion.div
              key={option.status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                onClick={() => handleSubmit(option.status)}
                className={`w-full h-auto p-4 justify-start gap-4 ${option.color}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${option.color}`}>
                  <option.icon className={`w-5 h-5 ${option.iconColor}`} />
                </div>
                <div className="text-left">
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm text-muted-foreground font-normal">
                    {option.description}
                  </div>
                </div>
              </Button>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Your specific app choices remain private — only your response is shared.
        </p>
      </DialogContent>
    </Dialog>
  );
};
