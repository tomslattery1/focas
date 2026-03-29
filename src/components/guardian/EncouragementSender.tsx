import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Send, Sparkles, Star, ThumbsUp, Trophy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface EncouragementSenderProps {
  childName: string;
  onSend: (message: string) => void;
}

const encouragementMessages = [
  { id: '1', message: "Great job staying focused! 🌟", icon: Star },
  { id: '2', message: "Keep up the amazing work! 💪", icon: Trophy },
  { id: '3', message: "So proud of you! ❤️", icon: Heart },
  { id: '4', message: "You're doing brilliantly! ✨", icon: Sparkles },
  { id: '5', message: "Way to go! 👍", icon: ThumbsUp },
  { id: '6', message: "Stay strong, you've got this! 🎯", icon: Trophy },
];

export const EncouragementSender = ({ childName, onSend }: EncouragementSenderProps) => {
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [sentMessage, setSentMessage] = useState<string | null>(null);

  const handleSend = () => {
    if (selectedMessage) {
      onSend(selectedMessage);
      setSentMessage(selectedMessage);
      setSelectedMessage(null);
      toast({
        title: "Encouragement sent!",
        description: `Your message was sent to ${childName}.`,
      });
      
      // Reset sent state after 3 seconds
      setTimeout(() => setSentMessage(null), 3000);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Heart className="w-4 h-4 text-pink-500" />
          Send Encouragement to {childName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2">
          {encouragementMessages.map((item) => {
            const Icon = item.icon;
            const isSelected = selectedMessage === item.message;
            const wasSent = sentMessage === item.message;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setSelectedMessage(isSelected ? null : item.message)}
                className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                  wasSent 
                    ? 'bg-emerald-500/10 border-2 border-emerald-500' 
                    : isSelected 
                      ? 'bg-primary/10 border-2 border-primary' 
                      : 'bg-muted/50 border-2 border-transparent hover:bg-muted'
                }`}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  wasSent ? 'bg-emerald-500/20' : isSelected ? 'bg-primary/20' : 'bg-background'
                }`}>
                  {wasSent ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  )}
                </div>
                <span className={`text-sm ${wasSent ? 'text-emerald-600' : isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {item.message}
                </span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Button 
                onClick={handleSend}
                className="w-full mt-2"
                size="sm"
              >
                <Send className="w-4 h-4 mr-2" />
                Send to {childName}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
