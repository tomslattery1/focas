import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

/**
 * Terms of Service Page - Apple App Store Compliance
 * 
 * Required for Apple submission to define:
 * - Terms of use
 * - User responsibilities
 * - School supervision context
 */
const TermsOfServicePage = () => {
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
            <h1 className="text-lg font-semibold">Terms of Service</h1>
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
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Terms of Service</h2>
          <p className="text-muted-foreground">
            Please read these terms carefully before using Fócas.
          </p>
        </motion.div>

        {/* Terms Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-sm dark:prose-invert max-w-none space-y-6"
        >
          <section>
            <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
            <p className="text-sm text-muted-foreground">
              By downloading, installing, or using Fócas, you agree to be bound by these 
              Terms of Service. If you do not agree to these terms, do not use the app.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">2. Educational Purpose</h3>
            <p className="text-sm text-muted-foreground">
              Fócas is designed exclusively for educational use in school settings. The app 
              helps students manage focus during study time and enables schools to support 
              student wellbeing. The app is intended to be used under school supervision and 
              with appropriate parental awareness.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">3. Age Requirements</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Fócas is intended for students aged 13 and older. If you are under 13:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
              <li>You must have verifiable parental consent to use this app</li>
              <li>Your parent or guardian must review and approve your use</li>
              <li>Your school must have appropriate policies in place</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">4. School Supervision</h3>
            <p className="text-sm text-muted-foreground">
              This app operates under the supervision of your school. Your school is responsible 
              for ensuring appropriate use policies are in place and that students understand 
              how the app is used. Schools must obtain necessary consents before enrolling students.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">5. User Responsibilities</h3>
            <p className="text-sm text-muted-foreground mb-3">
              As a user, you agree to:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4">
              <li>Provide accurate information when creating your account</li>
              <li>Use the app in accordance with your school's policies</li>
              <li>Not attempt to circumvent or disable the app's features</li>
              <li>Respect the privacy of other users</li>
              <li>Report any technical issues or concerns to your school</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">6. Emergency Access</h3>
            <p className="text-sm text-muted-foreground">
              Fócas includes an emergency unlock feature. This feature is designed for genuine 
              emergencies only. Misuse of the emergency feature may result in consequences 
              as determined by your school's policies.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">7. Data and Privacy</h3>
            <p className="text-sm text-muted-foreground">
              Your use of Fócas is also governed by our Privacy Policy. We are committed to 
              protecting your privacy and only collecting the minimum data necessary to 
              provide our service.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">8. No Warranty</h3>
            <p className="text-sm text-muted-foreground">
              Fócas is provided "as is" without warranty of any kind. While we strive to 
              maintain reliable service, we cannot guarantee uninterrupted access or that 
              the app will be error-free.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">9. Limitation of Liability</h3>
            <p className="text-sm text-muted-foreground">
              To the maximum extent permitted by law, Fócas and its developers shall not be 
              liable for any indirect, incidental, or consequential damages arising from 
              your use of the app.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">10. Changes to Terms</h3>
            <p className="text-sm text-muted-foreground">
              We may update these terms from time to time. Continued use of the app after 
              changes constitutes acceptance of the new terms. We will notify users of 
              significant changes through the app.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">11. Contact</h3>
            <p className="text-sm text-muted-foreground">
              For questions about these terms, contact your school administrator or email 
              support@focas.app
            </p>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default TermsOfServicePage;
