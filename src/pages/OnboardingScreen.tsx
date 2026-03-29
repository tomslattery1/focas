import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Focus, Shield, BarChart3, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    id: 1,
    icon: Focus,
    title: 'Stay focused at school',
    description:
      'Fócas blocks distracting apps during your study sessions so you can concentrate on what matters.',
    color: 'bg-primary/10',
    iconColor: 'text-primary',
  },
  {
    id: 2,
    icon: Shield,
    title: 'Built on trust, not surveillance',
    description:
      'You start and stop sessions yourself. We never inspect your phone or access your personal data.',
    color: 'bg-[hsl(var(--status-green))]/10',
    iconColor: 'text-[hsl(var(--status-green))]',
  },
  {
    id: 3,
    icon: BarChart3,
    title: 'See your progress',
    description:
      'View your focus time today and this week. Watch your streaks grow as you build better habits.',
    color: 'bg-primary/10',
    iconColor: 'text-primary',
  },
];

const OnboardingScreen = ({ onComplete }: OnboardingScreenProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentSlide];

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      {/* Skip */}
      {currentSlide < slides.length - 1 ? (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentSlide(slides.length - 1)}
            className="text-muted-foreground"
          >
            Skip
          </Button>
        </div>
      ) : (
        <div className="h-9" />
      )}

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
            <div
              className={`w-24 h-24 rounded-3xl ${slide.color} flex items-center justify-center mx-auto mb-8`}
            >
              <slide.icon className={`w-12 h-12 ${slide.iconColor}`} />
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-4 leading-tight">
              {slide.title}
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed max-w-xs mx-auto">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="pb-8">
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-8 bg-primary' : 'bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <Button onClick={handleNext} className="w-full h-12 text-base font-medium">
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

export default OnboardingScreen;
