import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Smartphone, AlertCircle, Plus, X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAppSuggestions } from '@/contexts/AppSuggestionContext';
import { COMMON_DISTRACTING_APPS, YEAR_GROUPS } from '@/types/app-suggestions';

interface AppBlockingSuggestionCreatorProps {
  className?: string;
  suggestedByRole?: 'teacher' | 'admin';
}

export const AppBlockingSuggestionCreator = ({ 
  className,
  suggestedByRole = 'teacher'
}: AppBlockingSuggestionCreatorProps) => {
  const { toast } = useToast();
  const { createSuggestion, suggestions, getStatsForSuggestion } = useAppSuggestions();
  
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [customAppName, setCustomAppName] = useState('');
  const [selectedYearGroups, setSelectedYearGroups] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [isSending, setIsSending] = useState(false);

  const toggleApp = (appName: string) => {
    setSelectedApps(prev => 
      prev.includes(appName)
        ? prev.filter(a => a !== appName)
        : [...prev, appName]
    );
  };

  const toggleYearGroup = (yearId: string) => {
    setSelectedYearGroups(prev => 
      prev.includes(yearId)
        ? prev.filter(y => y !== yearId)
        : [...prev, yearId]
    );
  };

  const addCustomApp = () => {
    if (customAppName.trim() && !selectedApps.includes(customAppName.trim())) {
      setSelectedApps(prev => [...prev, customAppName.trim()]);
      setCustomAppName('');
    }
  };

  const selectAllYearGroups = () => {
    setSelectedYearGroups(YEAR_GROUPS.map(y => y.id));
  };

  const handleSendSuggestions = async () => {
    if (selectedApps.length === 0) {
      toast({
        title: 'Select at least one app',
        description: 'Choose which apps to suggest limiting.',
        variant: 'destructive',
      });
      return;
    }
    if (selectedYearGroups.length === 0) {
      toast({
        title: 'Select at least one year group',
        description: 'Choose which year groups to send the suggestion to.',
        variant: 'destructive',
      });
      return;
    }

    setIsSending(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Create a suggestion for each app
    for (const appName of selectedApps) {
      const appInfo = COMMON_DISTRACTING_APPS.find(a => a.name === appName);
      createSuggestion({
        appName,
        appIcon: appInfo?.icon || '📱',
        reason: reason || 'Suggested for focus during school hours',
        suggestedBy: suggestedByRole === 'admin' ? 'School Admin' : 'Teacher',
        suggestedByRole,
        targetYearGroups: selectedYearGroups,
      });
    }
    
    const yearGroupNames = selectedYearGroups
      .map(id => YEAR_GROUPS.find(y => y.id === id)?.name)
      .filter(Boolean)
      .join(', ');
    
    toast({
      title: 'Suggestions sent',
      description: `Students in ${yearGroupNames} will receive a notification to review.`,
    });
    
    setIsSending(false);
    setSelectedApps([]);
    setSelectedYearGroups([]);
    setReason('');
  };

  // Recent suggestions for display
  const recentSuggestions = suggestions.slice(0, 3);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">App Limit Suggestions</CardTitle>
              <CardDescription>
                Suggest apps for students to limit during focus time
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Year group selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Target year groups</Label>
              <Button variant="ghost" size="sm" onClick={selectAllYearGroups} className="text-xs h-7">
                Select All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {YEAR_GROUPS.map(year => (
                <motion.div
                  key={year.id}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm
                    ${selectedYearGroups.includes(year.id) 
                      ? 'bg-primary/10 border-primary/30 text-primary' 
                      : 'bg-background border-border hover:border-primary/20'
                    }
                  `}
                  onClick={() => toggleYearGroup(year.id)}
                >
                  <Checkbox 
                    checked={selectedYearGroups.includes(year.id)}
                    onCheckedChange={() => toggleYearGroup(year.id)}
                    className="w-4 h-4"
                  />
                  {year.name}
                </motion.div>
              ))}
            </div>
          </div>

          {/* App selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Apps to suggest limiting</Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {COMMON_DISTRACTING_APPS.map(app => (
                <motion.div
                  key={app.name}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    flex flex-col items-center gap-1 p-3 rounded-xl border cursor-pointer transition-all text-center
                    ${selectedApps.includes(app.name) 
                      ? 'bg-primary/10 border-primary/30' 
                      : 'bg-background border-border hover:border-primary/20'
                    }
                  `}
                  onClick={() => toggleApp(app.name)}
                >
                  <span className="text-2xl">{app.icon}</span>
                  <span className="text-xs font-medium truncate w-full">{app.name}</span>
                </motion.div>
              ))}
            </div>
            
            {/* Custom app input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom app..."
                value={customAppName}
                onChange={(e) => setCustomAppName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomApp()}
                className="flex-1"
              />
              <Button variant="outline" size="icon" onClick={addCustomApp}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Selected apps */}
            {selectedApps.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedApps.map(app => (
                  <Badge key={app} variant="secondary" className="gap-1 pr-1">
                    {app}
                    <button
                      onClick={() => toggleApp(app)}
                      className="ml-1 rounded-full hover:bg-muted p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason (optional)
            </Label>
            <Textarea
              id="reason"
              placeholder="e.g., 'These apps have been causing distractions during class time.'"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none"
              rows={2}
            />
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50 border border-border/50">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Students can choose to accept or skip these suggestions. They remain in control of their device settings at all times.
            </p>
          </div>

          {/* Send button */}
          <Button 
            onClick={handleSendSuggestions}
            disabled={isSending || selectedApps.length === 0 || selectedYearGroups.length === 0}
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
                Send Suggestions
              </>
            )}
          </Button>

          {/* Recent suggestions */}
          {recentSuggestions.length > 0 && (
            <div className="pt-4 border-t">
              <Label className="text-sm font-medium mb-3 block">Recent Suggestions</Label>
              <div className="space-y-2">
                {recentSuggestions.map(suggestion => {
                  const stats = getStatsForSuggestion(suggestion.id);
                  return (
                    <div 
                      key={suggestion.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{suggestion.appIcon}</span>
                        <div>
                          <span className="text-sm font-medium">{suggestion.appName}</span>
                          <p className="text-xs text-muted-foreground">
                            {suggestion.targetYearGroups.length} year groups
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                          {stats.accepted} accepted
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-muted">
                          {stats.pending} pending
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
