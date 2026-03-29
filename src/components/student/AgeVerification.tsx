import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AgeVerificationProps {
  onVerified: (ageGroup: 'under13' | '13to17' | '18plus', birthYear: number) => void;
  onNeedsParentalConsent: () => void;
}

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => currentYear - 10 - i);

const AgeVerification = ({ onVerified, onNeedsParentalConsent }: AgeVerificationProps) => {
  const [birthYear, setBirthYear] = useState<string>('');
  const [hasParentalConsent, setHasParentalConsent] = useState<string>('');
  const [showParentalQuestion, setShowParentalQuestion] = useState(false);
  const [error, setError] = useState<string>('');

  const calculateAge = (year: number) => currentYear - year;

  const handleBirthYearChange = (year: string) => {
    setBirthYear(year);
    setError('');
    const age = calculateAge(parseInt(year));
    
    if (age < 13) {
      setShowParentalQuestion(true);
    } else {
      setShowParentalQuestion(false);
      setHasParentalConsent('');
    }
  };

  const handleContinue = () => {
    if (!birthYear) {
      setError('Please select your birth year');
      return;
    }

    const age = calculateAge(parseInt(birthYear));
    const yearNum = parseInt(birthYear);

    if (age < 13) {
      if (hasParentalConsent === 'yes') {
        onVerified('under13', yearNum);
      } else if (hasParentalConsent === 'no') {
        onNeedsParentalConsent();
      } else {
        setError('Please indicate if you have parental consent');
      }
    } else if (age >= 13 && age < 18) {
      onVerified('13to17', yearNum);
    } else {
      onVerified('18plus', yearNum);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-3">
            Age Verification
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            We need to verify your age to provide you with the appropriate experience and ensure compliance with privacy regulations.
          </p>
        </div>

        {/* Form */}
        <div className="flex-1 max-w-sm mx-auto w-full space-y-6">
          {/* Birth Year Selection */}
          <div className="space-y-2">
            <Label htmlFor="birth-year" className="text-base font-medium">
              What year were you born?
            </Label>
            <Select value={birthYear} onValueChange={handleBirthYearChange}>
              <SelectTrigger id="birth-year" className="w-full h-12">
                <SelectValue placeholder="Select your birth year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Parental Consent Question - Only for under 13 */}
          {showParentalQuestion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <div className="p-4 rounded-xl bg-status-amber/10 border border-status-amber/30">
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-status-amber mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Parental Consent Required
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Students under 13 require parental consent to use this app (COPPA compliance).
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base font-medium">
                  Do you have your parent/guardian's permission to use this app?
                </Label>
                <RadioGroup
                  value={hasParentalConsent}
                  onValueChange={setHasParentalConsent}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer">
                    <RadioGroupItem value="yes" id="consent-yes" />
                    <Label htmlFor="consent-yes" className="cursor-pointer flex-1">
                      Yes, my parent/guardian has given permission
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer">
                    <RadioGroupItem value="no" id="consent-no" />
                    <Label htmlFor="consent-no" className="cursor-pointer flex-1">
                      No, I need to ask them first
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </motion.div>
          )}

          {/* Age Information */}
          {birthYear && !showParentalQuestion && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-xl bg-status-green/10 border border-status-green/30"
            >
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-status-green mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Age Verified
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You're eligible to use this app. Continue to set up your account.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded-lg bg-destructive/10 border border-destructive/30"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 mb-4">
          <p className="text-xs text-muted-foreground text-center max-w-xs mx-auto">
            Your birth year is only used to verify age eligibility and is not stored or shared. 
            We comply with COPPA and other privacy regulations.
          </p>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          className="w-full h-12 text-base font-medium"
          disabled={!birthYear}
        >
          Continue
        </Button>
      </motion.div>
    </div>
  );
};

export default AgeVerification;
