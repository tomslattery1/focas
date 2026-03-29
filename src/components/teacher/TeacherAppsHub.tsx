import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppWindow, Smartphone, Plus, Send, X, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAppSuggestions } from '@/contexts/AppSuggestionContext';
import { useRecommendations } from '@/contexts/RecommendationContext';
import { AppCategory, APP_CATEGORY_ICONS, APP_CATEGORY_LABELS } from '@/types/recommendations';

const YEAR_GROUPS = [
  { id: '1st_year', name: '1st Year', students: 28 },
  { id: '2nd_year', name: '2nd Year', students: 26 },
  { id: '3rd_year', name: '3rd Year', students: 30 },
  { id: 'ty', name: 'Transition Year', students: 24 },
  { id: '5th_year', name: '5th Year', students: 27 },
  { id: '6th_year', name: '6th Year', students: 25 },
];

const AVAILABLE_CATEGORIES: AppCategory[] = [
  'social_media',
  'games',
  'entertainment',
  'messaging',
];

const COMMON_DISTRACTING_APPS = [
  { name: 'TikTok', icon: '🎵' },
  { name: 'Instagram', icon: '📷' },
  { name: 'Snapchat', icon: '👻' },
  { name: 'YouTube', icon: '▶️' },
  { name: 'Discord', icon: '💬' },
  { name: 'Roblox', icon: '🎮' },
  { name: 'Fortnite', icon: '🎯' },
  { name: 'BeReal', icon: '📸' },
];

interface TeacherAppsHubProps {
  className?: string;
}

export const TeacherAppsHub = ({ className }: TeacherAppsHubProps) => {
  const { toast } = useToast();
  const { createSuggestion, suggestions, getStatsForSuggestion } = useAppSuggestions();
  const { createRecommendation, studentResponses } = useRecommendations();
  
  // Focus Recommendation State
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<AppCategory[]>(['social_media', 'games']);
  const [customMessage, setCustomMessage] = useState('');
  
  // App Blocking State
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [customAppName, setCustomAppName] = useState('');
  const [selectedYearGroups, setSelectedYearGroups] = useState<string[]>([]);
  const [appReason, setAppReason] = useState('');
  
  // Fócas Suggestion State
  const [newAppName, setNewAppName] = useState('');
  const [newAppReason, setNewAppReason] = useState('');
  const [suggestedApps, setSuggestedApps] = useState<Array<{name: string; reason: string; status: 'pending' | 'approved' | 'rejected'}>>([
    { name: 'Duolingo', reason: 'Language learning for Irish classes', status: 'approved' },
    { name: 'GeoGebra', reason: 'Interactive maths tool', status: 'pending' },
  ]);
  
  const [isSending, setIsSending] = useState(false);

  const selectedYearData = YEAR_GROUPS.find(c => c.id === selectedClass);

  // Focus Recommendation Handlers
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
    await new Promise(resolve => setTimeout(resolve, 800));
    
    createRecommendation(selectedCategories, selectedYearData?.name || 'Class', customMessage || undefined);
    
    toast({
      title: 'Recommendation sent',
      description: 'Students will receive a notification to review and apply focus settings.',
    });
    
    setIsSending(false);
    setCustomMessage('');
  };

  // App Blocking Handlers
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

  const handleSendAppSuggestions = async () => {
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
    await new Promise(resolve => setTimeout(resolve, 800));
    
    for (const appName of selectedApps) {
      const appInfo = COMMON_DISTRACTING_APPS.find(a => a.name === appName);
      createSuggestion({
        appName,
        appIcon: appInfo?.icon || '📱',
        reason: appReason || 'Suggested for focus during school hours',
        suggestedBy: 'Teacher',
        suggestedByRole: 'teacher',
        targetYearGroups: selectedYearGroups,
      });
    }
    
    const yearNames = selectedYearGroups
      .map(id => YEAR_GROUPS.find(y => y.id === id)?.name)
      .filter(Boolean)
      .join(', ');
    
    toast({
      title: 'Suggestions sent',
      description: `${selectedApps.length} app suggestion(s) sent to ${yearNames}`,
    });
    
    setIsSending(false);
    setSelectedApps([]);
    setSelectedYearGroups([]);
    setAppReason('');
  };

  // Fócas Approved App Suggestion Handlers
  const handleSubmitFocasApp = () => {
    if (!newAppName.trim()) {
      toast({
        title: 'App name required',
        description: 'Please enter the name of the app you want to suggest.',
        variant: 'destructive',
      });
      return;
    }

    setSuggestedApps(prev => [...prev, {
      name: newAppName.trim(),
      reason: newAppReason.trim() || 'Educational app suggestion',
      status: 'pending'
    }]);

    toast({
      title: 'Suggestion submitted',
      description: `${newAppName} has been sent for admin review.`,
    });

    setNewAppName('');
    setNewAppReason('');
  };

  const handleRemoveFocasSuggestion = (index: number) => {
    setSuggestedApps(prev => prev.filter((_, i) => i !== index));
    toast({
      title: 'Suggestion removed',
      description: 'Your app suggestion has been withdrawn.',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-600 border-red-500/20';
      default: return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    }
  };

  const recentResponses = studentResponses.slice(0, 5);
  const recentSuggestions = suggestions.slice(0, 3);

  return (
    <div className={className}>
      <Tabs defaultValue="focus" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="focus" className="flex items-center gap-2">
            <Smartphone className="w-4 h-4" />
            <span>Focus Mode</span>
          </TabsTrigger>
          <TabsTrigger value="blocking" className="flex items-center gap-2">
            <AppWindow className="w-4 h-4" />
            <span>App Limits</span>
          </TabsTrigger>
          <TabsTrigger value="suggest" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span>Suggest Apps</span>
          </TabsTrigger>
        </TabsList>

        {/* Focus Mode Tab */}
        <TabsContent value="focus">
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
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Select categories to limit</Label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_CATEGORIES.map(category => {
                    const isSelected = selectedCategories.includes(category);
                    const icon = APP_CATEGORY_ICONS[category];
                    return (
                      <motion.div
                        key={category}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleCategory(category)}
                        className={`p-3 rounded-xl border cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-primary/10 border-primary text-primary' 
                            : 'bg-muted/30 border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox checked={isSelected} className="pointer-events-none" />
                          <span>{icon}</span>
                          <span className="text-sm font-medium">{APP_CATEGORY_LABELS[category]}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Custom message (optional)</Label>
                <Textarea
                  placeholder="Add a message for students..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="resize-none"
                  rows={2}
                />
              </div>

              <Button 
                onClick={handleSendRecommendation} 
                className="w-full gap-2"
                disabled={isSending || !selectedClass || selectedCategories.length === 0}
              >
                {isSending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Recommendation
                  </>
                )}
              </Button>

              {recentResponses.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Recent responses</p>
                  <div className="space-y-2">
                    {recentResponses.map((response, index) => (
                      <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
                        <span>{response.studentName}</span>
                        <Badge variant="outline" className={
                          response.status === 'applied' ? 'text-green-600' :
                          response.status === 'partial' ? 'text-yellow-600' : 'text-muted-foreground'
                        }>
                          {response.status === 'applied' ? 'Applied' : 
                           response.status === 'partial' ? 'Partial' : 'Skipped'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* App Limits Tab */}
        <TabsContent value="blocking">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <AppWindow className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">App Limit Suggestions</CardTitle>
                  <CardDescription>
                    Suggest specific apps for students to limit during focus time
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Select year groups</Label>
                  <Button variant="ghost" size="sm" onClick={selectAllYearGroups} className="h-7 text-xs">
                    Select All
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {YEAR_GROUPS.map(year => {
                    const isSelected = selectedYearGroups.includes(year.id);
                    return (
                      <div
                        key={year.id}
                        onClick={() => toggleYearGroup(year.id)}
                        className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-primary/10 border-primary' 
                            : 'bg-muted/30 border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox checked={isSelected} className="pointer-events-none" />
                          <span className="text-sm">{year.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Select apps to suggest limiting</Label>
                <div className="grid grid-cols-2 gap-2">
                  {COMMON_DISTRACTING_APPS.map(app => {
                    const isSelected = selectedApps.includes(app.name);
                    return (
                      <div
                        key={app.name}
                        onClick={() => toggleApp(app.name)}
                        className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-orange-500/10 border-orange-500' 
                            : 'bg-muted/30 border-border hover:border-orange-500/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{app.icon}</span>
                          <span className="text-sm">{app.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add custom app..."
                    value={customAppName}
                    onChange={(e) => setCustomAppName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustomApp()}
                  />
                  <Button variant="outline" onClick={addCustomApp} disabled={!customAppName.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {selectedApps.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedApps.map(app => (
                      <Badge key={app} variant="secondary" className="gap-1">
                        {app}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => toggleApp(app)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Reason (optional)</Label>
                <Textarea
                  placeholder="Why should students limit these apps?"
                  value={appReason}
                  onChange={(e) => setAppReason(e.target.value)}
                  className="resize-none"
                  rows={2}
                />
              </div>

              <Button 
                onClick={handleSendAppSuggestions} 
                className="w-full gap-2"
                disabled={isSending || selectedApps.length === 0 || selectedYearGroups.length === 0}
              >
                {isSending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Suggestions
                  </>
                )}
              </Button>

              {recentSuggestions.length > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Recent suggestions</p>
                  <div className="space-y-2">
                    {recentSuggestions.map((suggestion) => {
                      const stats = getStatsForSuggestion(suggestion.id);
                      return (
                        <div key={suggestion.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-2">
                            <span>{suggestion.appIcon}</span>
                            <span>{suggestion.appName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              {stats.accepted}
                            </span>
                            <span className="flex items-center gap-1">
                              <XCircle className="w-3 h-3 text-red-500" />
                              {stats.rejected}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-yellow-500" />
                              {stats.pending}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suggest Apps Tab */}
        <TabsContent value="suggest">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <CardTitle className="text-lg">Fócas App Suggestions</CardTitle>
                  <CardDescription>
                    Suggest educational apps to be added to the Fócas approved list
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Suggest educational apps to be added to the Fócas approved list. Submissions are reviewed by your school admin.
              </p>

              <div className="space-y-3 p-4 rounded-xl bg-muted/50">
                <div className="relative">
                  <Plus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="App name (e.g., Scratch Jr)"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Input
                  placeholder="Reason for suggestion (optional)"
                  value={newAppReason}
                  onChange={(e) => setNewAppReason(e.target.value)}
                />
                <Button onClick={handleSubmitFocasApp} className="w-full gap-2">
                  <Send className="w-4 h-4" />
                  Submit Suggestion
                </Button>
              </div>

              {suggestedApps.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Your suggestions</p>
                  {suggestedApps.map((app, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{app.name}</span>
                          <Badge variant="outline" className={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{app.reason}</p>
                      </div>
                      {app.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => handleRemoveFocasSuggestion(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
