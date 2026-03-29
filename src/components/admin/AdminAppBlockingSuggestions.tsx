import { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Trash2, Users, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAppSuggestions } from '@/contexts/AppSuggestionContext';
import { AppBlockingSuggestionCreator } from '@/components/teacher/AppBlockingSuggestionCreator';
import { YEAR_GROUPS } from '@/types/app-suggestions';
import { formatDistanceToNow } from 'date-fns';

export const AdminAppBlockingSuggestions = () => {
  const { toast } = useToast();
  const { suggestions, deleteSuggestion, getStatsForSuggestion, studentResponses } = useAppSuggestions();
  const [activeTab, setActiveTab] = useState('create');
  const [suggestionToDelete, setSuggestionToDelete] = useState<string | null>(null);

  const handleDelete = () => {
    if (!suggestionToDelete) return;
    const suggestion = suggestions.find(s => s.id === suggestionToDelete);
    deleteSuggestion(suggestionToDelete);
    toast({
      title: 'Suggestion removed',
      description: `"${suggestion?.appName}" suggestion has been removed.`,
    });
    setSuggestionToDelete(null);
  };

  const getYearGroupNames = (ids: string[]) => {
    return ids
      .map(id => YEAR_GROUPS.find(y => y.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-xl font-semibold">App Limit Suggestions</h2>
          <p className="text-sm text-muted-foreground">
            Suggest apps for students to limit during school hours
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Smartphone className="w-3 h-3" />
          {suggestions.length} active
        </Badge>
      </motion.div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Suggestion</TabsTrigger>
          <TabsTrigger value="active">Active Suggestions</TabsTrigger>
          <TabsTrigger value="responses">Student Responses</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-4">
          <AppBlockingSuggestionCreator suggestedByRole="admin" />
        </TabsContent>

        <TabsContent value="active" className="mt-4 space-y-4">
          {suggestions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Smartphone className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No active suggestions</p>
              <p className="text-sm">Create a new suggestion to get started</p>
            </div>
          ) : (
            suggestions.map((suggestion) => {
              const stats = getStatsForSuggestion(suggestion.id);
              const acceptanceRate = stats.total > 0 
                ? Math.round((stats.accepted / (stats.accepted + stats.rejected)) * 100) || 0 
                : 0;

              return (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-card border space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                        {suggestion.appIcon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{suggestion.appName}</h4>
                        <p className="text-xs text-muted-foreground">
                          by {suggestion.suggestedBy} • {formatDistanceToNow(suggestion.createdAt, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setSuggestionToDelete(suggestion.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                    "{suggestion.reason}"
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {getYearGroupNames(suggestion.targetYearGroups)}
                    </span>
                  </div>

                  {/* Response stats */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Student responses</span>
                      <span className="font-medium">{stats.accepted + stats.rejected} / {stats.total}</span>
                    </div>
                    <Progress value={((stats.accepted + stats.rejected) / stats.total) * 100} className="h-2" />
                    <div className="flex gap-4 text-xs">
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-3 h-3" /> {stats.accepted} accepted
                      </span>
                      <span className="flex items-center gap-1 text-red-600">
                        <XCircle className="w-3 h-3" /> {stats.rejected} rejected
                      </span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" /> {stats.pending} pending
                      </span>
                    </div>
                  </div>

                  {acceptanceRate > 0 && (
                    <Badge 
                      variant="outline" 
                      className={acceptanceRate >= 70 
                        ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                        : acceptanceRate >= 40 
                          ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                          : 'bg-red-500/10 text-red-600 border-red-500/20'
                      }
                    >
                      {acceptanceRate}% acceptance rate
                    </Badge>
                  )}
                </motion.div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="responses" className="mt-4 space-y-4">
          {/* Info note */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50 border border-border/50">
            <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Student responses are anonymized in aggregate reports. Individual responses shown here are for demonstration purposes.
            </p>
          </div>

          {studentResponses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No student responses yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {studentResponses.map((response, index) => {
                const suggestion = suggestions.find(s => s.id === response.suggestionId);
                return (
                  <div
                    key={`${response.suggestionId}-${response.studentId}-${index}`}
                    className="flex items-center justify-between p-3 rounded-lg bg-card border"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                        {response.studentName.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-medium">{response.studentName}</span>
                        <p className="text-xs text-muted-foreground">
                          {suggestion?.appName || 'Unknown app'}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={response.status === 'accepted' 
                        ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                        : response.status === 'rejected'
                          ? 'bg-red-500/10 text-red-600 border-red-500/20'
                          : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                      }
                    >
                      {response.status === 'accepted' && '✓ Accepted'}
                      {response.status === 'rejected' && '✗ Rejected'}
                      {response.status === 'pending' && '◐ Pending'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!suggestionToDelete} onOpenChange={(open) => !open && setSuggestionToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Suggestion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this app limit suggestion? Students who haven't responded yet will no longer see it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
