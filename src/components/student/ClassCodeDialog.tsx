import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { CheckCircle, XCircle, KeyRound, ShieldCheck } from 'lucide-react';

interface ClassCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  codeType?: 'teacher' | 'guardian';
}

// Mock valid class codes - in production these would come from the backend
const VALID_TEACHER_CODES = ['1234', '5678', '0000'];

// Get valid guardian codes from localStorage
const getValidGuardianCodes = (): string[] => {
  // Guardian codes are stored when generated
  const saved = localStorage.getItem('focas_guardian_codes');
  if (saved) {
    try {
      const codes = JSON.parse(saved);
      // Filter out expired codes
      const now = new Date();
      return codes
        .filter((c: { code: string; expiresAt: string }) => new Date(c.expiresAt) > now)
        .map((c: { code: string }) => c.code);
    } catch {
      return [];
    }
  }
  return [];
};

export const ClassCodeDialog = ({ open, onOpenChange, onSuccess, codeType = 'teacher' }: ClassCodeDialogProps) => {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCodeComplete = async (value: string) => {
    setCode(value);
    setError(null);
    
    if (value.length === 4) {
      setIsVerifying(true);
      
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const validCodes = codeType === 'teacher' 
        ? VALID_TEACHER_CODES 
        : [...getValidGuardianCodes(), '0000']; // 0000 for testing
      
      if (validCodes.includes(value)) {
        onSuccess();
        onOpenChange(false);
        setCode('');
      } else {
        const source = codeType === 'teacher' ? 'teacher' : 'guardian';
        setError(`Invalid code. Please ask your ${source} for the correct code.`);
        setCode('');
      }
      
      setIsVerifying(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setCode('');
      setError(null);
    }
    onOpenChange(newOpen);
  };

  const isTeacher = codeType === 'teacher';
  const Icon = isTeacher ? KeyRound : ShieldCheck;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[340px]">
        <DialogHeader className="text-center">
          <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
            isTeacher ? 'bg-destructive/10' : 'bg-primary/10'
          }`}>
            <Icon className={`w-6 h-6 ${isTeacher ? 'text-destructive/70' : 'text-primary/70'}`} />
          </div>
          <DialogTitle className="text-xl">
            Enter {isTeacher ? 'Teacher' : 'Guardian'} Code
          </DialogTitle>
          <DialogDescription>
            Ask your {isTeacher ? 'teacher' : 'guardian'} for the 4-digit code to deactivate Study Mode
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          <InputOTP
            maxLength={4}
            value={code}
            onChange={handleCodeComplete}
            disabled={isVerifying}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>

          {isVerifying && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
              />
              <span className="text-sm">Verifying...</span>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-status-red text-sm text-center"
            >
              <XCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </div>

        <Button variant="ghost" onClick={() => handleOpenChange(false)}>
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
};
