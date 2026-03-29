import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, ShieldX, Search } from 'lucide-react';
import { Student, ComplianceStatus } from '@/types/app';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface StudentStatusTableProps {
  students: Student[];
}

const statusConfig: Record<ComplianceStatus, { icon: typeof ShieldCheck; label: string; className: string }> = {
  green: {
    icon: ShieldCheck,
    label: 'Compliant',
    className: 'text-status-green bg-status-green-light',
  },
  amber: {
    icon: ShieldAlert,
    label: 'Partial',
    className: 'text-status-amber bg-status-amber-light',
  },
  red: {
    icon: ShieldX,
    label: 'Not Compliant',
    className: 'text-status-red bg-status-red-light',
  },
};

export const StudentStatusTable = ({ students }: StudentStatusTableProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusCounts = {
    green: students.filter(s => s.status === 'green').length,
    amber: students.filter(s => s.status === 'amber').length,
    red: students.filter(s => s.status === 'red').length,
  };

  return (
    <div className="space-y-4">
      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-3">
        {(['green', 'amber', 'red'] as const).map((status) => {
          const config = statusConfig[status];
          const Icon = config.icon;
          return (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl ${config.className} flex items-center gap-3`}
            >
              <Icon className="w-5 h-5" />
              <div>
                <p className="text-2xl font-bold">{statusCounts[status]}</p>
                <p className="text-xs opacity-80">{config.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Student Table */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student, index) => {
              const config = statusConfig[student.status];
              const Icon = config.icon;
              return (
                <motion.tr
                  key={student.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="text-muted-foreground">{student.grade}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
                      <Icon className="w-3 h-3" />
                      {config.label}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {formatLastActive(student.lastActive)}
                  </TableCell>
                </motion.tr>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

function formatLastActive(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString();
}
