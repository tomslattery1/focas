import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Hash, AlertTriangle, Clock, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

type DeactivationMethod = 'nfc' | 'code' | 'emergency';

interface DeactivationEntry {
  id: string;
  studentName: string;
  studentId: string;
  method: DeactivationMethod;
  timestamp: Date;
  details?: string;
}

// Mock deactivation log data
const MOCK_DEACTIVATIONS: DeactivationEntry[] = [
  {
    id: '1',
    studentName: 'Emma O\'Brien',
    studentId: 'S001',
    method: 'nfc',
    timestamp: new Date(Date.now() - 15 * 60000),
    details: 'Room 12 Tag',
  },
  {
    id: '2',
    studentName: 'Liam Murphy',
    studentId: 'S002',
    method: 'code',
    timestamp: new Date(Date.now() - 45 * 60000),
    details: 'Code: 4521',
  },
  {
    id: '3',
    studentName: 'Sophie Ryan',
    studentId: 'S003',
    method: 'emergency',
    timestamp: new Date(Date.now() - 2 * 3600000),
    details: 'Parent: Mary Ryan',
  },
  {
    id: '4',
    studentName: 'Jack Kelly',
    studentId: 'S004',
    method: 'nfc',
    timestamp: new Date(Date.now() - 3 * 3600000),
    details: 'Main Hall Tag',
  },
  {
    id: '5',
    studentName: 'Aoife Walsh',
    studentId: 'S005',
    method: 'code',
    timestamp: new Date(Date.now() - 4 * 3600000),
    details: 'Code: 7890',
  },
  {
    id: '6',
    studentName: 'Cian Byrne',
    studentId: 'S006',
    method: 'emergency',
    timestamp: new Date(Date.now() - 25 * 3600000),
    details: 'Parent: Tom Byrne',
  },
  {
    id: '7',
    studentName: 'Niamh Doyle',
    studentId: 'S007',
    method: 'nfc',
    timestamp: new Date(Date.now() - 50 * 3600000),
    details: 'Library Tag',
  },
];

const getMethodIcon = (method: DeactivationMethod) => {
  switch (method) {
    case 'nfc':
      return <Smartphone className="w-4 h-4" />;
    case 'code':
      return <Hash className="w-4 h-4" />;
    case 'emergency':
      return <AlertTriangle className="w-4 h-4" />;
  }
};

const getMethodLabel = (method: DeactivationMethod) => {
  switch (method) {
    case 'nfc':
      return 'NFC Tap';
    case 'code':
      return 'Class Code';
    case 'emergency':
      return 'Emergency';
  }
};

const getMethodVariant = (method: DeactivationMethod): "default" | "secondary" | "destructive" => {
  switch (method) {
    case 'nfc':
      return 'default';
    case 'code':
      return 'secondary';
    case 'emergency':
      return 'destructive';
  }
};

const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString();
};

type MethodFilter = 'all' | DeactivationMethod;
type DateFilter = 'all' | 'today' | 'week' | 'month';

interface DeactivationLogProps {
  limit?: number;
  showTitle?: boolean;
  showFilters?: boolean;
}

export const DeactivationLog = ({ limit, showTitle = true, showFilters = false }: DeactivationLogProps) => {
  const [methodFilter, setMethodFilter] = useState<MethodFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = useMemo(() => {
    let entries = [...MOCK_DEACTIVATIONS];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      entries = entries.filter(e => 
        e.studentName.toLowerCase().includes(query) ||
        e.studentId.toLowerCase().includes(query)
      );
    }

    // Filter by method
    if (methodFilter !== 'all') {
      entries = entries.filter(e => e.method === methodFilter);
    }

    // Filter by date
    const now = new Date();
    if (dateFilter === 'today') {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      entries = entries.filter(e => e.timestamp >= startOfDay);
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 3600000);
      entries = entries.filter(e => e.timestamp >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 3600000);
      entries = entries.filter(e => e.timestamp >= monthAgo);
    }

    // Apply limit
    if (limit) {
      entries = entries.slice(0, limit);
    }

    return entries;
  }, [methodFilter, dateFilter, searchQuery, limit]);

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Deactivation Log
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className={showTitle ? "" : "pt-6"}>
        {/* Filters */}
        {showFilters && (
          <div className="space-y-3 mb-4 pb-4 border-b">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9"
              />
            </div>
            
            {/* Filter dropdowns */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filters:</span>
              </div>
            <Select value={methodFilter} onValueChange={(v) => setMethodFilter(v as MethodFilter)}>
              <SelectTrigger className="w-[140px] h-8 text-sm">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="nfc">NFC Tap</SelectItem>
                <SelectItem value="code">Class Code</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={(v) => setDateFilter(v as DateFilter)}>
              <SelectTrigger className="w-[130px] h-8 text-sm">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            </div>
          </div>
        )}

        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {filteredEntries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No entries match your filters</p>
              </div>
            ) : (
              filteredEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      entry.method === 'emergency' 
                        ? 'bg-destructive/10' 
                        : entry.method === 'nfc'
                          ? 'bg-primary/10'
                          : 'bg-secondary'
                    }`}>
                      {getMethodIcon(entry.method)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{entry.studentName}</p>
                      <p className="text-xs text-muted-foreground">{entry.details}</p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge variant={getMethodVariant(entry.method)} className="text-xs">
                      {getMethodLabel(entry.method)}
                    </Badge>
                    <p className="text-xs text-muted-foreground">{formatTime(entry.timestamp)}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
