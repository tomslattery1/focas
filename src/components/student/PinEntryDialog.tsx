import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Loader2, Check } from 'lucide-react';

interface PinEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  validPin?: string; // Default PIN for demo
}

export const PinEntryDialog = ({
  open,
  onOpenChange,
  onSuccess,
  validPin = '1234', // Demo PIN
}: PinEntryDialogProps) => {
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(false);

  const handlePinComplete = async (value: string) => {
    setPin(value);
    setIsVerifying(true);
    setError(false);

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (value === validPin) {
      toast.success('PIN verified!', {
        description: 'School Mode activated.',
      });
      onSuccess();
      onOpenChange(false);
      setPin('');
    } else {
      setError(true);
      toast.error('Invalid PIN', {
        description: 'Please try again or ask your teacher.',
      });
      setPin('');
    }
    
    setIsVerifying(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Classroom PIN</DialogTitle>
          <DialogDescription>
            Enter the 4-digit PIN displayed in your classroom to activate School Mode.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <motion.div
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
          >
            <InputOTP
              maxLength={4}
              value={pin}
              onChange={setPin}
              onComplete={handlePinComplete}
              disabled={isVerifying}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} className={error ? 'border-destructive' : ''} />
                <InputOTPSlot index={1} className={error ? 'border-destructive' : ''} />
                <InputOTPSlot index={2} className={error ? 'border-destructive' : ''} />
                <InputOTPSlot index={3} className={error ? 'border-destructive' : ''} />
              </InputOTPGroup>
            </InputOTP>
          </motion.div>

          {isVerifying && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Verifying...</span>
            </div>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Ask your teacher for the classroom PIN if you don't know it.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
