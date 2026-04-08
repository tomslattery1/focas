import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, Eye, Bell, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ParentOnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    icon: Users,
    title: 'Stay connected to your child\'s focus',
    description: 'Fócas Family helps you support your child\'s learning by being there for them as they build better focus habits.',
    color: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 2,
    icon: Eye,
    title: 'Cheer them on',
    description: 'See when your child is in focus mode and celebrate their progress. Green means they\'re in the zone!',
    color: 'bg-status-green/10',
    iconColor: 'text-status-green',
  },
  {
    id: 3,
    icon: Heart,
    title: 'Send encouragement',
    description: 'Choose from warm messages to send your child during their focus sessions — a little support goes a long way.',
    color: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 4,
    icon: Bell,
    title: 'Get notified',
    description: 'Receive updates when your child shares a focus milestone with you, so you can celebrate together.',
    color: 'bg-status-amber/10',
    iconColor: 'text-status-amber',
  },
];

const ParentOnboardingScreen = ({ onComplete }: ParentOnboardingScreenProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [onboardingPhase, setOnboardingPhase] = useState<OnboardingPhase>('slides');

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Check if notifications already granted
      const notificationsGranted = localStorage.getItem('guardianNotificationPermissionGranted') === 'true';
      if (notificationsGranted) {
        onComplete();
      } else {
        setOnboardingPhase('notifications');
      }
    }
  };

  const handleSkip = () => {
    const notificationsGranted = localStorage.getItem('guardianNotificationPermissionGranted') === 'true';
    if (notificationsGranted) {
      onComplete();
    } else {
      setOnboardingPhase('notifications');
    }
  };

  const handleNotificationComplete = () => {
    onComplete();
  };

  // Show notification permission screen
  if (onboardingPhase === 'notifications') {
    return <GuardianNotificationPermission onComplete={handleNotificationComplete} />;
  }

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      {/* Skip button */}
      <div className="flex justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSkip}
          className="text-muted-foreground"
        >
          Skip
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="text-center px-4"
          >
            {/* Icon */}
            <div className={`w-24 h-24 rounded-3xl ${slide.color} flex items-center justify-center mx-auto mb-8`}>
              <slide.icon className={`w-12 h-12 ${slide.iconColor}`} />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-semibold text-foreground mb-4 leading-tight">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground text-base leading-relaxed max-w-xs mx-auto">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="pb-8">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-primary'
                  : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {/* Next button */}
        <Button
          onClick={handleNext}
          className="w-full h-12 text-base font-medium"
        >
          {currentSlide === slides.length - 1 ? (
            'Get Started'
          ) : (
            <>
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ParentOnboardingScreen;
