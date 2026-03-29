import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, AppWindow, Search, Trash2, Plus, BookOpen, Gamepad2, MessageCircle, Calculator, Globe, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

type AppCategory = 'educational' | 'productivity' | 'communication' | 'creative' | 'reference' | 'games';

const categoryConfig: Record<AppCategory, { label: string; icon: React.ElementType; color: string }> = {
  educational: { label: 'Educational', icon: BookOpen, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
  productivity: { label: 'Productivity', icon: Calculator, color: 'bg-green-500/10 text-green-600 border-green-500/20' },
  communication: { label: 'Communication', icon: MessageCircle, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
  creative: { label: 'Creative', icon: Palette, color: 'bg-pink-500/10 text-pink-600 border-pink-500/20' },
  reference: { label: 'Reference', icon: Globe, color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  games: { label: 'Games', icon: Gamepad2, color: 'bg-red-500/10 text-red-600 border-red-500/20' },
};

interface AppSuggestion {
  id: string;
  name: string;
  reason: string;
  suggestedBy: string;
  suggestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  category?: AppCategory;
}

export const AdminAppApprovals = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [appToDelete, setAppToDelete] = useState<AppSuggestion | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newApp, setNewApp] = useState({
    name: '',
    reason: '',
    category: 'educational' as AppCategory,
  });
  
  const [apps, setApps] = useState<AppSuggestion[]>([
    {
      id: '1',
      name: 'Khan Academy Kids',
      reason: 'Maths and reading practice',
      suggestedBy: 'Tom Slattery',
      suggestedAt: new Date(2024, 0, 15),
      status: 'pending',
      category: 'educational',
    },
    {
      id: '2',
      name: 'Scratch Jr',
      reason: 'Coding fundamentals for younger students',
      suggestedBy: "Mary O'Brien",
      suggestedAt: new Date(2024, 0, 14),
      status: 'pending',
      category: 'educational',
    },
    {
      id: '3',
      name: 'Duolingo',
      reason: 'Language learning support',
      suggestedBy: 'Tom Slattery',
      suggestedAt: new Date(2024, 0, 10),
      status: 'approved',
      category: 'educational',
    },
    {
      id: '4',
      name: 'TikTok',
      reason: 'Student requested',
      suggestedBy: 'John Murphy',
      suggestedAt: new Date(2024, 0, 8),
      status: 'rejected',
      category: 'games',
    },
    {
      id: '5',
      name: 'Canva',
      reason: 'Design projects for art class',
      suggestedBy: 'Admin',
      suggestedAt: new Date(2024, 0, 5),
      status: 'approved',
      category: 'creative',
    },
    {
      id: '6',
      name: 'Google Docs',
      reason: 'Collaborative writing assignments',
      suggestedBy: 'Admin',
      suggestedAt: new Date(2024, 0, 3),
      status: 'approved',
      category: 'productivity',
    },
  ]);

  const handleApprove = (id: string) => {
    setApps(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'approved' as const } : app
    ));
    const app = apps.find(a => a.id === id);
    toast({
      title: 'App approved',
      description: `"${app?.name}" has been added to the Fócas approved list.`,
    });
  };

  const handleReject = (id: string) => {
    setApps(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'rejected' as const } : app
    ));
    const app = apps.find(a => a.id === id);
    toast({
      title: 'App rejected',
      description: `"${app?.name}" will not be added to the Fócas list.`,
    });
  };

  const handleRemove = () => {
    if (!appToDelete) return;
    setApps(prev => prev.filter(app => app.id !== appToDelete.id));
    toast({
      title: 'App removed',
      description: `"${appToDelete.name}" has been removed from the list.`,
    });
    setAppToDelete(null);
  };

  const handleAddApp = () => {
    if (!newApp.name.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an app name',
        variant: 'destructive',
      });
      return;
    }

    const app: AppSuggestion = {
      id: Date.now().toString(),
      name: newApp.name.trim(),
      reason: newApp.reason.trim() || 'Added by admin',
      suggestedBy: 'Admin',
      suggestedAt: new Date(),
      status: 'approved',
      category: newApp.category,
    };

    setApps(prev => [...prev, app]);
    setNewApp({ name: '', reason: '', category: 'educational' });
    setShowAddDialog(false);
    toast({
      title: 'App added',
      description: `"${app.name}" has been added to the approved list.`,
    });
  };

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.suggestedBy.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const pendingApps = filteredApps.filter(app => app.status === 'pending');
  const reviewedApps = filteredApps.filter(app => app.status !== 'pending');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending</Badge>;
    }
  };

  const getCategoryBadge = (category?: AppCategory) => {
    if (!category) return null;
    const config = categoryConfig[category];
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={`gap-1 ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
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
          <h2 className="text-xl font-semibold">Fócas App Approvals</h2>
          <p className="text-sm text-muted-foreground">
            Review and manage app suggestions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            {pendingApps.length} pending
          </Badge>
          <Button onClick={() => setShowAddDialog(true)} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add App
          </Button>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search apps or teachers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
          <TabsList className="w-full flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <TabsTrigger key={key} value={key} className="text-xs gap-1">
                <config.icon className="w-3 h-3" />
                {config.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Pending Approvals */}
      {pendingApps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-medium text-muted-foreground">Pending Review</h3>
          {pendingApps.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-xl bg-card border space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <AppWindow className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{app.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      Suggested by {app.suggestedBy}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getCategoryBadge(app.category)}
                  {getStatusBadge(app.status)}
                </div>
              </div>
              <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-lg">
                "{app.reason}"
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(app.id)}
                  className="flex-1 gap-2"
                  size="sm"
                >
                  <Check className="w-4 h-4" />
                  Approve
                </Button>
                <Button
                  onClick={() => handleReject(app.id)}
                  variant="outline"
                  className="flex-1 gap-2"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Reviewed Apps */}
      {reviewedApps.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-medium text-muted-foreground">Previously Reviewed</h3>
          {reviewedApps.map((app) => (
            <div
              key={app.id}
              className="p-4 rounded-xl bg-card border flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <AppWindow className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{app.name}</h4>
                    {getCategoryBadge(app.category)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    by {app.suggestedBy}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(app.status)}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => setAppToDelete(app)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {filteredApps.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <AppWindow className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No app suggestions found</p>
        </div>
      )}

      {/* Add App Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New App</DialogTitle>
            <DialogDescription>
              Manually add an app to the approved list.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="appName">App Name</Label>
              <Input
                id="appName"
                placeholder="Enter app name"
                value={newApp.name}
                onChange={(e) => setNewApp(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={newApp.category} 
                onValueChange={(v) => setNewApp(prev => ({ ...prev, category: v as AppCategory }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className="w-4 h-4" />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Reason (optional)</Label>
              <Input
                id="reason"
                placeholder="Why is this app approved?"
                value={newApp.reason}
                onChange={(e) => setNewApp(prev => ({ ...prev, reason: e.target.value }))}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddApp}>
              Add App
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!appToDelete} onOpenChange={(open) => !open && setAppToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove App</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{appToDelete?.name}" from the approval list? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleRemove}
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
