import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Loader2, Key } from 'lucide-react';

interface GuardianUnlockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

function validateGuardianCode(code: string): boolean {
  try {
    const codes = JSON.parse(localStorage.getItem('focas_guardian_codes') || '[]');
    const now = new Date();
    return codes.some(
      (c: { code: string; expiresAt: string }) =>
        c.code === code && new Date(c.expiresAt) > now
    );
  } catch {
    return false;
  }
}

export const GuardianUnlockDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: GuardianUnlockDialogProps) => {
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(false);

  const handlePinComplete = async (value: string) => {
    setPin(value);
    setIsVerifying(true);
    setError(false);

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (validateGuardianCode(value)) {
      toast.success('Code accepted!', {
        description: 'Your guardian has ended the session early.',
      });
      onSuccess();
      onOpenChange(false);
      setPin('');
    } else {
      setError(true);
      toast.error('Invalid code', {
        description: 'Ask your guardian to generate a new code.',
      });
      setPin('');
    }

    setIsVerifying(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[340px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            Guardian Unlock
          </DialogTitle>
          <DialogDescription>
            Enter the 4-digit code from your guardian to end this session early.
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
            Your guardian can generate a code from the Unlock tab in their Fócas app.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
