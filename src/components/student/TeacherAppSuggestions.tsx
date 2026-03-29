import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AppWindow, 
  Check, 
  X, 
  User, 
  Info, 
  CheckCircle2, 
  ChevronRight,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppBlockingSuggestion } from '@/types/app-suggestions';

interface TeacherAppSuggestionsProps {
  unresolvedSuggestions: AppBlockingSuggestion[];
  acceptedSuggestions: (AppBlockingSuggestion | undefined)[];
  onAccept: (suggestionId: string) => void;
  onReject: (suggestionId: string) => void;
  onAcceptAll: () => void;
}

const TeacherAppSuggestions = ({ 
  unresolvedSuggestions,
  acceptedSuggestions,
  onAccept, 
  onReject, 
  onAcceptAll 
}: TeacherAppSuggestionsProps) => {
  const validAccepted = acceptedSuggestions.filter(Boolean) as AppBlockingSuggestion[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <User className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Teacher Suggestions</h2>
        <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
          Your teachers have suggested these apps to limit during Study Mode. 
          You choose what to accept.
        </p>
      </motion.div>

      {/* Pending Suggestions */}
      {unresolvedSuggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Pending</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onAcceptAll}
              className="text-primary"
            >
              Accept All ({unresolvedSuggestions.length})
            </Button>
          </div>

          <AnimatePresence mode="popLayout">
            {unresolvedSuggestions.map((suggestion, index) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
              >
                <SuggestionCard
                  suggestion={suggestion}
                  onAccept={() => onAccept(suggestion.id)}
                  onReject={() => onReject(suggestion.id)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Accepted Suggestions */}
      {validAccepted.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="text-lg font-semibold text-muted-foreground">
            Accepted ({validAccepted.length})
          </h3>

          {validAccepted.map((suggestion) => (
            <AcceptedCard key={suggestion.id} suggestion={suggestion} />
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {unresolvedSuggestions.length === 0 && validAccepted.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-16 h-16 rounded-full bg-status-green/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-status-green" />
          </div>
          <h3 className="font-semibold mb-2">No Suggestions</h3>
          <p className="text-sm text-muted-foreground">
            Your teachers haven't suggested any apps to limit yet.
          </p>
        </motion.div>
      )}

      {/* Native App Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="p-4 rounded-xl bg-muted/50 border"
      >
        <div className="flex items-start gap-3">
          <Smartphone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Native App Required</p>
            <p className="text-xs text-muted-foreground mt-1">
              App limits use Apple's Screen Time API and require the native iOS app. 
              Accepted suggestions will sync when you open the app.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Individual suggestion card
const SuggestionCard = ({ 
  suggestion, 
  onAccept, 
  onReject 
}: { 
  suggestion: AppBlockingSuggestion; 
  onAccept: () => void; 
  onReject: () => void;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-4 rounded-2xl bg-card border space-y-3">
      <div className="flex items-center gap-3">
        {/* App icon placeholder */}
        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
          {suggestion.appIcon || <AppWindow className="w-6 h-6 text-muted-foreground" />}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{suggestion.appName}</span>
            <Badge variant="secondary" className="text-xs capitalize">
              {suggestion.suggestedByRole}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            From {suggestion.suggestedBy}
          </p>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Expandable reason */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/50">
              <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReject}
          className="flex-1"
        >
          <X className="w-4 h-4 mr-1" />
          Dismiss
        </Button>
        <Button
          size="sm"
          onClick={onAccept}
          className="flex-1"
        >
          <Check className="w-4 h-4 mr-1" />
          Accept
        </Button>
      </div>
    </div>
  );
};

// Accepted suggestion card (compact)
const AcceptedCard = ({ suggestion }: { suggestion: AppBlockingSuggestion }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-status-green/5 border border-status-green/20">
    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
      {suggestion.appIcon || <AppWindow className="w-5 h-5 text-muted-foreground" />}
    </div>
    <div className="flex-1">
      <span className="font-medium text-sm">{suggestion.appName}</span>
      <p className="text-xs text-muted-foreground">Limited during Study Mode</p>
    </div>
    <CheckCircle2 className="w-5 h-5 text-status-green" />
  </div>
);

export default TeacherAppSuggestions;
