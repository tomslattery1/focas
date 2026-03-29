import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Smartphone, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRecommendations } from '@/contexts/RecommendationContext';
import { AppCategory, APP_CATEGORY_LABELS, APP_CATEGORY_ICONS } from '@/types/recommendations';

// Year groups for Irish secondary schools
const YEAR_GROUPS = [
  { id: '1', name: '1st Year', students: 120 },
  { id: '2', name: '2nd Year', students: 115 },
  { id: '3', name: '3rd Year', students: 118 },
  { id: '4', name: '4th Year', students: 95 },
  { id: '5', name: '5th Year', students: 108 },
  { id: '6', name: '6th Year', students: 102 },
];

const AVAILABLE_CATEGORIES: AppCategory[] = [
  'social_media',
  'games',
  'entertainment',
  'messaging',
  'shopping',
];

interface FocusRecommendationCreatorProps {
  className?: string;
}

export const FocusRecommendationCreator = ({ 
  className,
}: FocusRecommendationCreatorProps) => {
  const { toast } = useToast();
  const { createRecommendation, studentResponses } = useRecommendations();
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<AppCategory[]>(['social_media', 'games']);
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const selectedYearData = YEAR_GROUPS.find(c => c.id === selectedClass);

  const toggleCategory = (category: AppCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSendRecommendation = async () => {
    if (!selectedClass) {
      toast({
        title: 'Select a class',
        description: 'Choose which class to send the recommendation to.',
        variant: 'destructive',
      });
      return;
    }
    if (selectedCategories.length === 0) {
      toast({
        title: 'Select at least one category',
        description: 'Choose which app categories to recommend blocking.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    createRecommendation(selectedCategories, selectedYearData?.name || 'Class', customMessage || undefined);
    
    toast({
      title: 'Recommendation sent',
      description: 'Students will receive a notification to review and apply focus settings.',
    });
    
    setIsSending(false);
    setCustomMessage('');
  };

  // Get recent responses for display
  const recentResponses = studentResponses.slice(0, 5);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Focus Recommendation</CardTitle>
              <CardDescription>
                Recommend app categories to block during class
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Year group selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Select year group</Label>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a year group..." />
              </SelectTrigger>
              <SelectContent>
                {YEAR_GROUPS.map(year => (
                  <SelectItem key={year.id} value={year.id}>
                    <div className="flex items-center justify-between gap-4">
                      <span>{year.name}</span>
                      <span className="text-xs text-muted-foreground">{year.students} students</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedYearData && (
              <p className="text-xs text-muted-foreground">
                {selectedYearData.students} students in this year group
              </p>
            )}
          </div>

          {/* Category selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Categories to block</Label>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_CATEGORIES.map(category => (
                <motion.div
                  key={category}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                    ${selectedCategories.includes(category) 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-background border-border hover:border-primary/20'
                    }
                  `}
                  onClick={() => toggleCategory(category)}
                >
                  <Checkbox 
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => toggleCategory(category)}
                  />
                  <span className="text-lg">{APP_CATEGORY_ICONS[category]}</span>
                  <span className="text-sm font-medium">{APP_CATEGORY_LABELS[category]}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Optional message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message to students (optional)
            </Label>
            <Textarea
              id="message"
              placeholder="e.g., 'We'll be doing a test today, please stay focused.'"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50 border border-border/50">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Students choose which specific apps to block. You'll only see whether they applied, partially applied, or skipped the recommendation.
            </p>
          </div>

          {/* Send button */}
          <Button 
            onClick={handleSendRecommendation}
            disabled={isSending || selectedCategories.length === 0}
            className="w-full gap-2"
          >
            {isSending ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Send className="w-4 h-4" />
                </motion.div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send to Class
              </>
            )}
          </Button>

          {/* Recent responses */}
          {recentResponses.length > 0 && (
            <div className="pt-4 border-t">
              <Label className="text-sm font-medium mb-3 block">Recent Responses</Label>
              <div className="space-y-2">
                {recentResponses.map(response => (
                  <div 
                    key={`${response.recommendationId}-${response.studentId}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
                  >
                    <span className="text-sm font-medium">{response.studentName}</span>
                    <span className={`
                      text-xs px-2 py-1 rounded-full font-medium
                      ${response.status === 'applied' ? 'bg-status-green/10 text-status-green' : ''}
                      ${response.status === 'partial' ? 'bg-status-amber/10 text-status-amber' : ''}
                      ${response.status === 'skipped' ? 'bg-status-red/10 text-status-red' : ''}
                    `}>
                      {response.status === 'applied' && '✓ Applied'}
                      {response.status === 'partial' && '◐ Partial'}
                      {response.status === 'skipped' && '✗ Skipped'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
