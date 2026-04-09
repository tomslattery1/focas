import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileLayout } from '@/components/layout/MobileLayout';
import { ChevronLeft, Minus, Plus, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const STORAGE_KEY = 'focas_blocked_categories';
const DEFAULT_CATEGORIES = ['Social Media', 'Games'];
const ALL_CATEGORIES = ['Social Media', 'Games', 'Entertainment', 'Shopping', 'News', 'Streaming'];

export function getBlockedCategories(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

const BlockedCategoriesPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>(getBlockedCategories);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const removeCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
  };

  const addCategory = (cat: string) => {
    if (!categories.includes(cat)) {
      setCategories((prev) => [...prev, cat]);
    }
    setDialogOpen(false);
  };

  const availableToAdd = ALL_CATEGORIES.filter((c) => !categories.includes(c));

  return (
    <MobileLayout>
      <div className="px-5 pt-14 pb-6">
        <button
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Settings</span>
        </button>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-xl font-bold text-foreground">Apps to Block During Fócas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            These categories will be limited when you start a focus session.
          </p>
        </motion.div>

        {/* Category list */}
        <div className="space-y-2 mb-6">
          <AnimatePresence>
            {categories.map((cat) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10, height: 0 }}
                className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/50"
              >
                <span className="font-medium text-sm text-foreground">{cat}</span>
                <button
                  onClick={() => removeCategory(cat)}
                  className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center hover:bg-destructive/20 transition-colors"
                >
                  <Minus className="w-4 h-4 text-destructive" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No categories selected. Add some below.
            </p>
          )}
        </div>

        {/* Add button */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" disabled={availableToAdd.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[340px] rounded-2xl">
            <DialogHeader>
              <DialogTitle>Select a Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-2">
              {availableToAdd.map((cat) => (
                <button
                  key={cat}
                  onClick={() => addCategory(cat)}
                  className="w-full text-left p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-sm font-medium text-foreground"
                >
                  {cat}
                </button>
              ))}
              {availableToAdd.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  All categories already added.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Info note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 p-4 rounded-xl bg-muted/50 border border-border/50"
        >
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              On your iPhone, you'll also be able to select specific apps using Apple's app picker.
            </p>
          </div>
        </motion.div>
      </div>
    </MobileLayout>
  );
};

export default BlockedCategoriesPage;
