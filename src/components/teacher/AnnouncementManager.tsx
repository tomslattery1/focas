import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, AlertTriangle, Bell, Send, GraduationCap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Announcement, AnnouncementRecipient } from '@/types/app';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface AnnouncementManagerProps {
  announcements: Announcement[];
}

export const AnnouncementManager = ({ announcements: initialAnnouncements }: AnnouncementManagerProps) => {
  const { addAnnouncement } = useApp();
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newPriority, setNewPriority] = useState<'normal' | 'urgent'>('normal');
  const [newRecipients, setNewRecipients] = useState<AnnouncementRecipient>('students');

  const createAnnouncement = () => {
    if (!newTitle.trim() || !newMessage.trim()) return;

    const newAnnouncement: Announcement = {
      id: String(Date.now()),
      title: newTitle,
      message: newMessage,
      timestamp: new Date(),
      priority: newPriority,
      read: false,
      recipients: newRecipients,
    };

    // Add to local state
    setAnnouncements(prev => [newAnnouncement, ...prev]);
    
    // Add to global context so students/parents receive it
    addAnnouncement({
      title: newTitle,
      message: newMessage,
      priority: newPriority,
      recipients: newRecipients,
    });

    const recipientLabel = newRecipients === 'both' ? 'students and guardians' : newRecipients;
    toast({
      title: 'Announcement sent',
      description: `Your announcement has been sent to ${recipientLabel}.`,
    });

    setNewTitle('');
    setNewMessage('');
    setNewPriority('normal');
    setNewRecipients('students');
    setIsCreating(false);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const getRecipientBadge = (recipients: AnnouncementRecipient) => {
    switch (recipients) {
      case 'students':
        return <Badge variant="outline" className="gap-1 bg-green-500/10 text-green-600 border-green-500/20"><GraduationCap className="w-3 h-3" /> Students</Badge>;
      case 'guardians':
        return <Badge variant="outline" className="gap-1 bg-blue-500/10 text-blue-600 border-blue-500/20"><Users className="w-3 h-3" /> Guardians</Badge>;
      case 'both':
        return <Badge variant="outline" className="gap-1 bg-purple-500/10 text-purple-600 border-purple-500/20"><Users className="w-3 h-3" /> All</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">School Announcements</h3>
          <p className="text-sm text-muted-foreground">
            Send alerts and notices to students and guardians
          </p>
        </div>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New Announcement
          </Button>
        )}
      </div>

      {/* Create Form */}
      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl border bg-card space-y-4"
        >
          <Input
            placeholder="Announcement title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <Textarea
            placeholder="Message content..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={3}
          />
          
          {/* Recipients Selection */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Send to:</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={newRecipients === 'students' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewRecipients('students')}
                className="gap-1"
              >
                <GraduationCap className="w-4 h-4" />
                Students only
              </Button>
              <Button
                variant={newRecipients === 'guardians' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewRecipients('guardians')}
                className="gap-1"
              >
                <Users className="w-4 h-4" />
                Guardians only
              </Button>
              <Button
                variant={newRecipients === 'both' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewRecipients('both')}
                className="gap-1"
              >
                <Users className="w-4 h-4" />
                Both
              </Button>
            </div>
          </div>

          {/* Priority Selection */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Priority:</p>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={newPriority === 'normal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setNewPriority('normal')}
              >
                <Bell className="w-4 h-4 mr-1" />
                Normal
              </Button>
              <Button
                variant={newPriority === 'urgent' ? 'destructive' : 'outline'}
                size="sm"
                onClick={() => setNewPriority('urgent')}
              >
                <AlertTriangle className="w-4 h-4 mr-1" />
                Urgent
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-2 border-t">
            <Button variant="ghost" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button onClick={createAnnouncement}>
              <Send className="w-4 h-4 mr-1" />
              Send
            </Button>
          </div>
        </motion.div>
      )}

      {/* Announcements List */}
      <div className="space-y-3">
        {announcements.map((announcement, index) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-xl border ${
              announcement.priority === 'urgent'
                ? 'bg-status-red-light border-status-red/20'
                : 'bg-card'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {announcement.priority === 'urgent' ? (
                    <AlertTriangle className="w-4 h-4 text-status-red" />
                  ) : (
                    <Bell className="w-4 h-4 text-primary" />
                  )}
                  <h4 className="font-medium">{announcement.title}</h4>
                  {getRecipientBadge(announcement.recipients)}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {announcement.message}
                </p>
                <p className="text-xs text-muted-foreground">
                  Sent {format(announcement.timestamp, 'MMM d, h:mm a')}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteAnnouncement(announcement.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
