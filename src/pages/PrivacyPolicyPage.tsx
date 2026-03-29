import { motion } from 'framer-motion';
import { Shield, ArrowLeft, Lock, Eye, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

/**
 * Privacy Policy Page - Apple App Store Compliance
 * 
 * Required for Apple submission to demonstrate:
 * - What data is collected
 * - How data is used
 * - User rights and controls
 * - Age-appropriate content
 */
const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Privacy Policy</h1>
            <p className="text-xs text-muted-foreground">Last updated: January 2025</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Privacy Matters</h2>
          <p className="text-muted-foreground">
            Fócas is designed with privacy at its core. We collect minimal data 
            and give you control over what you share.
          </p>
        </motion.div>

        {/* Key Points */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4"
        >
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">What We Collect</h3>
                <p className="text-sm text-muted-foreground">
                  Only focus mode status (on/off) and basic account info. 
                  We never access your apps, messages, photos, or browsing history.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">How We Use It</h3>
                <p className="text-sm text-muted-foreground">
                  Focus status helps your school support students during study time. 
                  Teachers see aggregate statistics, not individual activity.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Who Sees Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  Only your school administrators if you opt in. You control whether 
                  teachers or parents can see your focus status.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-status-red/10 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-status-red" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Your Rights</h3>
                <p className="text-sm text-muted-foreground">
                  You can delete your account and all data at any time in Settings. 
                  We comply with GDPR and COPPA regulations.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Policy */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="prose prose-sm dark:prose-invert max-w-none"
        >
          <h3 className="text-lg font-semibold mt-8 mb-4">Full Privacy Policy</h3>
          
          <h4 className="font-medium mt-6 mb-2">1. Information We Collect</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Fócas collects only the minimum information necessary to provide our focus management service:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc pl-4">
            <li>Account information (name, school email)</li>
            <li>Focus mode status (active/inactive timestamps)</li>
            <li>Device identifiers for authentication</li>
            <li>Preferences and settings you configure</li>
          </ul>

          <h4 className="font-medium mt-6 mb-2">2. Information We Never Collect</h4>
          <p className="text-sm text-muted-foreground mb-4">
            To protect your privacy, we explicitly do not collect:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc pl-4">
            <li>Contents of your messages, emails, or calls</li>
            <li>Photos, videos, or files on your device</li>
            <li>Browsing history or search queries</li>
            <li>App usage details or screen content</li>
            <li>Location data or GPS coordinates</li>
            <li>Contacts or social connections</li>
          </ul>

          <h4 className="font-medium mt-6 mb-2">3. Age Requirements</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Fócas is designed for students aged 13 and older. Users under 13 require 
            verified parental consent before using the app. We comply with the Children's 
            Online Privacy Protection Act (COPPA) and similar regulations.
          </p>

          <h4 className="font-medium mt-6 mb-2">4. Data Sharing</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Your focus status may be shared with:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc pl-4">
            <li>Your school's designated administrators (required)</li>
            <li>Your teachers (only if you opt in)</li>
            <li>Your parents/guardians (only if you opt in)</li>
          </ul>
          <p className="text-sm text-muted-foreground mb-4">
            We never sell your data to third parties or use it for advertising.
          </p>

          <h4 className="font-medium mt-6 mb-2">5. Data Security</h4>
          <p className="text-sm text-muted-foreground mb-4">
            All data is encrypted in transit and at rest. We use industry-standard 
            security practices and regularly audit our systems. Data is stored on 
            secure servers within the European Union.
          </p>

          <h4 className="font-medium mt-6 mb-2">6. Your Rights</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Under GDPR and applicable privacy laws, you have the right to:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 mb-4 list-disc pl-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and all associated data</li>
            <li>Export your data in a portable format</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h4 className="font-medium mt-6 mb-2">7. Contact Us</h4>
          <p className="text-sm text-muted-foreground mb-4">
            For privacy inquiries or to exercise your rights, contact your school 
            administrator or email privacy@focas.app
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
