import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Mail, Phone, ArrowRight, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GuardianInviteProps {
  onComplete: (guardian: { method: 'email' | 'phone'; value: string } | null) => void;
}

const GuardianInvite = ({ onComplete }: GuardianInviteProps) => {
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const validateAndContinue = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setError(method === 'email' ? 'Please enter an email address' : 'Please enter a phone number');
      return;
    }
    if (method === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address');
      return;
    }
    if (method === 'phone' && !/^[\d\s+\-()]{7,}$/.test(trimmed)) {
      setError('Please enter a valid phone number');
      return;
    }
    onComplete({ method, value: trimmed });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col"
      >
        {/* Header */}
        <div className="text-center mb-8 mt-8">
          <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Heart className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-3 leading-tight">
            Who supports your focus&nbsp;journey?
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
            Invite a parent or guardian to cheer you on. They'll be able to see your progress and send encouragement.
          </p>
        </div>

        {/* Form */}
        <div className="max-w-sm mx-auto w-full flex-1 space-y-5">
          <Tabs
            value={method}
            onValueChange={(v) => {
              setMethod(v as 'email' | 'phone');
              setValue('');
              setError('');
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email" className="gap-2">
                <Mail className="w-4 h-4" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone" className="gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <div className="relative">
              {method === 'email' ? (
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              ) : (
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              )}
              <Input
                type={method === 'email' ? 'email' : 'tel'}
                placeholder={
                  method === 'email'
                    ? 'parent@example.com'
                    : '+353 87 123 4567'
                }
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError('');
                }}
                className="pl-12 h-12 text-base"
              />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-destructive"
              >
                {error}
              </motion.p>
            )}
          </div>

          {/* Reassurance */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-start gap-3">
              <UserPlus className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                We'll send them an invite to join Fócas. They'll only see your focus status — never your apps, messages, or personal data.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 max-w-sm mx-auto w-full mt-6 pb-4">
          <Button
            onClick={validateAndContinue}
            className="w-full h-12 text-base font-medium"
          >
            <span className="flex items-center gap-2">
              Send Invite
              <ArrowRight className="w-4 h-4" />
            </span>
          </Button>
          <button
            onClick={() => onComplete(null)}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
          >
            I'll do this later
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default GuardianInvite;
