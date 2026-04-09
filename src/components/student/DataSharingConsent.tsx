import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface DataSharingConsentProps {
  ageGroup: 'under13' | '13to17' | '18plus';
  onConsent: (consents: ConsentChoices) => void;
  onDecline: () => void;
}

export interface ConsentChoices {
  shareStatusWithTeachers: boolean;
  shareStatusWithGuardians: boolean;
  allowEncouragementMessages: boolean;
  acceptTermsAndPrivacy: boolean;
}

const DataSharingConsent = ({ onConsent, onDecline }: DataSharingConsentProps) => {
  const [shareWithGuardian, setShareWithGuardian] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!acceptedTerms) {
      setError('You must accept the Terms & Privacy Policy to continue.');
      return;
    }
    onConsent({
      shareStatusWithTeachers: false,
      shareStatusWithGuardians: shareWithGuardian,
      allowEncouragementMessages: shareWithGuardian,
      acceptTermsAndPrivacy: true,
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-2">
            You're in control
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Choose who gets to see when you're in focus mode. Only on/off — nothing else is ever shared.
          </p>
        </div>

        <div className="max-w-sm mx-auto w-full space-y-4 flex-1">
          {/* Guardian sharing — off by default */}
          <div className="p-5 rounded-2xl border bg-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">Let your guardian cheer you on</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                They'll only see if you're in focus mode — never your apps or data
              </p>
            </div>
            <Switch checked={shareWithGuardian} onCheckedChange={setShareWithGuardian} />
          </div>

          {/* Teacher sharing — coming soon */}
          <div className="p-5 rounded-2xl border bg-card/50 flex items-center gap-4 opacity-60">
            <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-foreground text-sm">Teacher sharing</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Coming in a future version — stay tuned!
              </p>
            </div>
          </div>

          {/* Privacy note */}
          <div className="p-4 rounded-xl bg-[hsl(var(--status-green))]/10 border border-[hsl(var(--status-green))]/20">
            <p className="text-xs text-[hsl(var(--status-green))] font-medium">
              ✓ We never see your messages, photos, or which apps you use
            </p>
          </div>

          {/* Terms checkbox */}
          <div className="p-4 rounded-xl border bg-card border-primary/30">
            <div className="flex items-start gap-3">
              <Checkbox
                id="accept-terms"
                checked={acceptedTerms}
                onCheckedChange={(v) => {
                  setAcceptedTerms(v === true);
                  setError('');
                }}
                className="mt-0.5"
              />
              <Label htmlFor="accept-terms" className="cursor-pointer flex-1">
                <span className="font-medium text-sm">
                  Accept Terms & Privacy Policy{' '}
                  <span className="text-destructive text-xs">(Required)</span>
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  I have read and agree to the{' '}
                  <a href="/terms" className="text-primary underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-primary underline">Privacy Policy</a>
                </p>
              </Label>
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive text-center">
              {error}
            </motion.p>
          )}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4 mb-4">
          You can change these anytime in Settings
        </p>

        <div className="space-y-3 max-w-sm mx-auto w-full">
          <Button onClick={handleContinue} className="w-full h-12 text-base font-medium" disabled={!acceptedTerms}>
            Continue
          </Button>
          <Button variant="ghost" onClick={onDecline} className="w-full text-muted-foreground">
            Go back
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default DataSharingConsent;
