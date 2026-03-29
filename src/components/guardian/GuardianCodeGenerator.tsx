import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Copy, Check, Clock, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

interface GeneratedCode {
  code: string;
  childName: string;
  expiresAt: Date;
  createdAt: Date;
}

interface GuardianCodeGeneratorProps {
  childName: string;
}

export const GuardianCodeGenerator = ({ childName }: GuardianCodeGeneratorProps) => {
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [, setTick] = useState(0);

  const generateCode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 minutes for home use

    const newCode: GeneratedCode = {
      code,
      childName,
      expiresAt,
      createdAt: now,
    };

    setGeneratedCode(newCode);
    
    // Save to localStorage for validation
    const existingCodes = JSON.parse(localStorage.getItem('focas_guardian_codes') || '[]');
    const updatedCodes = [
      { code, expiresAt: expiresAt.toISOString(), childName },
      ...existingCodes.filter((c: { expiresAt: string }) => new Date(c.expiresAt) > now)
    ];
    localStorage.setItem('focas_guardian_codes', JSON.stringify(updatedCodes));
    
    toast({
      title: "Code generated",
      description: `Tell ${childName} to enter code ${code}`,
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
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-semibold text-primary">{childName[0]}</span>
            </div>
            <div>
              <p className="font-medium">{childName}</p>
              <p className="text-xs text-muted-foreground">Generate unlock code</p>
            </div>
          </div>
          <Button onClick={generateCode} size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Generate
          </Button>
        </div>

        {generatedCode && !isExpired(generatedCode.expiresAt) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 rounded-xl bg-primary/5 border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Current Code</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-3xl font-bold tracking-[0.3em]">
                    {generatedCode.code}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyCode(generatedCode.code)}
                  >
                    {copiedCode === generatedCode.code ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Badge variant="default" className="gap-1">
                <Clock className="w-3 h-3" />
                {getTimeRemaining(generatedCode.expiresAt)}
              </Badge>
            </div>
          </motion.div>
        )}

        {generatedCode && isExpired(generatedCode.expiresAt) && (
          <div className="p-4 rounded-xl bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground">Code expired. Generate a new one.</p>
          </div>
        )}

        {!generatedCode && (
          <div className="p-4 rounded-xl bg-muted/30 text-center">
            <p className="text-sm text-muted-foreground">
              Tap Generate to create an unlock code for {childName}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
