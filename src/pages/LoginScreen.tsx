import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, KeyRound, Monitor, Smartphone } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';
import { UserRole } from '@/types/app';

interface LoginScreenProps {
  onLogin: () => void;
  userRole?: UserRole;
}

const LoginScreen = ({ onLogin, userRole }: LoginScreenProps) => {
  const isStudent = userRole === 'student';
  const [loginMethod, setLoginMethod] = useState<'email' | 'studentId'>(isStudent ? 'studentId' : 'email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [studentId, setStudentId] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { adminViewMode, setAdminViewMode } = useApp();
  
  const isAdmin = userRole === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMethod === 'studentId') {
      if (!studentId || pin.length !== 4) {
        toast({
          title: 'Missing information',
          description: 'Please enter your student ID and 4-digit PIN.',
          variant: 'destructive',
        });
        return;
      }
    } else {
      if (!email || !password) {
        toast({
          title: 'Missing information',
          description: 'Please enter both email and password.',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsLoading(true);
    
    // Simulated login - replace with actual auth when backend is connected
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Welcome back!',
        description: loginMethod === 'studentId' 
          ? `Signed in with Student ID: ${studentId}`
          : 'You have been logged in successfully.',
      });
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in to continue to Fócas
          </p>
          {/* Admin View Mode Toggle */}
          {isAdmin && (
            <div className="flex items-center justify-center gap-3 mt-4 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">View mode:</span>
              <ToggleGroup 
                type="single" 
                value={adminViewMode} 
                onValueChange={(value) => value && setAdminViewMode(value as 'mobile' | 'desktop')}
                className="bg-background border rounded-lg"
              >
                <ToggleGroupItem 
                  value="mobile" 
                  aria-label="Mobile view" 
                  className="px-3 py-2 gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm">Mobile</span>
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="desktop" 
                  aria-label="Desktop view" 
                  className="px-3 py-2 gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                >
                  <Monitor className="w-4 h-4" />
                  <span className="text-sm">Desktop</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col max-w-sm mx-auto w-full">
          {/* Login method tabs for students */}
          {isStudent && (
            <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as 'email' | 'studentId')} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="studentId">Student ID</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          <div className="space-y-4 mb-6">
            {loginMethod === 'studentId' ? (
              /* Student ID and PIN fields */
              <>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter your student ID"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="pl-12 h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <KeyRound className="w-4 h-4" />
                    <span>Enter your 4-digit PIN</span>
                  </div>
                  <InputOTP
                    maxLength={4}
                    value={pin}
                    onChange={setPin}
                    className="justify-center"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </>
            ) : (
              <>
                {/* Email field */}
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="School email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 h-12 text-base"
                  />
                </div>

                {/* Password field */}
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 h-12 text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Forgot password - only show for email login */}
          {loginMethod === 'email' && (
            <button
              type="button"
              className="text-sm text-primary hover:underline mb-8 text-left"
            >
              Forgot password?
            </button>
          )}
          
          {loginMethod === 'studentId' && <div className="mb-8" />}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-base font-medium"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign in
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>

          {/* Sign up link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <button type="button" className="text-primary hover:underline font-medium">
              Contact your school
            </button>
          </p>
        </form>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Login is managed by your school administration
        </p>

        {/* Demo credentials for Apple review */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border/50 max-w-sm mx-auto w-full">
          <p className="text-xs font-medium text-muted-foreground text-center mb-1">Demo credentials</p>
          <p className="text-xs text-muted-foreground text-center">
            Student ID: <span className="font-mono font-medium text-foreground">STU001</span> · PIN: <span className="font-mono font-medium text-foreground">1234</span>
          </p>
          <p className="text-xs text-muted-foreground text-center mt-0.5">
            Email: <span className="font-mono font-medium text-foreground">demo@school.ie</span> · Pass: <span className="font-mono font-medium text-foreground">demo1234</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
