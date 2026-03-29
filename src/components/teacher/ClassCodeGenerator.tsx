import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, Check, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const TEACHER_CLASSES = [
  { id: '1', name: 'Mathematics', yearGroup: '6A' },
  { id: '2', name: 'English', yearGroup: '6A' },
  { id: '3', name: 'Science', yearGroup: '5B' },
  { id: '4', name: 'History', yearGroup: '4C' },
];

interface GeneratedCode {
  code: string;
  className: string;
  yearGroup: string;
  expiresAt: Date;
  createdAt: Date;
}

export const ClassCodeGenerator = () => {
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const generateCode = () => {
    if (!selectedClass) {
      toast({
        title: "Select a class",
        description: "Please select a class to generate a code for.",
        variant: "destructive",
      });
      return;
    }

    const classInfo = TEACHER_CLASSES.find(c => c.id === selectedClass);
    if (!classInfo) return;

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 minutes

    const newCode: GeneratedCode = {
      code,
      className: classInfo.name,
      yearGroup: classInfo.yearGroup,
      expiresAt,
      createdAt: now,
    };

    setGeneratedCodes(prev => [newCode, ...prev.slice(0, 4)]);
    
    toast({
      title: "Code generated",
      description: `Code ${code} valid for 30 minutes`,
    });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard",
    });
  };

  const getTimeRemaining = (expiresAt: Date) => {
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    if (diff <= 0) return 'Expired';
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const isExpired = (expiresAt: Date) => {
    return new Date() > expiresAt;
  };

  // Update remaining time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setGeneratedCodes(prev => [...prev]);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Class Code Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Select value={selectedClass} onValueChange={setSelectedClass}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select class" />
            </SelectTrigger>
            <SelectContent>
              {TEACHER_CLASSES.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} ({cls.yearGroup})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={generateCode} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Generate
          </Button>
        </div>

        {generatedCodes.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Active Codes</p>
            {generatedCodes.map((codeData, index) => (
              <motion.div
                key={`${codeData.code}-${codeData.createdAt.getTime()}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  isExpired(codeData.expiresAt) 
                    ? 'bg-muted/50 opacity-50' 
                    : 'bg-primary/5 border-primary/20'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-2xl font-bold tracking-widest">
                      {codeData.code}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => copyCode(codeData.code)}
                      disabled={isExpired(codeData.expiresAt)}
                    >
                      {copiedCode === codeData.code ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {codeData.className} ({codeData.yearGroup})
                  </p>
                </div>
                <Badge variant={isExpired(codeData.expiresAt) ? "secondary" : "default"}>
                  {getTimeRemaining(codeData.expiresAt)}
                </Badge>
              </motion.div>
            ))}
          </div>
        )}

        {generatedCodes.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Generate a code for students to deactivate School Mode
          </p>
        )}
      </CardContent>
    </Card>
  );
};
