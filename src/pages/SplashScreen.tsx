import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const { schoolSettings } = useApp();
  const [showPoweredBy, setShowPoweredBy] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowPoweredBy(true), 800);
    const timer2 = setTimeout(() => onComplete(), 2500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center"
      >
        {/* School Logo */}
        <div className="w-32 h-32 rounded-3xl overflow-hidden flex items-center justify-center mb-6">
          <img 
            src={schoolSettings.schoolLogo} 
            alt={`${schoolSettings.schoolName} logo`}
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* School Name */}
        <h1 className="text-2xl font-semibold text-foreground tracking-tight text-center">
          {schoolSettings.schoolName}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: showPoweredBy ? 1 : 0, y: showPoweredBy ? 0 : 10 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-16 flex flex-col items-center"
      >
        <span className="text-lg font-medium text-muted-foreground italic tracking-wide">Find your fócas.</span>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
