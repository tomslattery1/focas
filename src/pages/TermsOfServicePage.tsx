import { motion } from 'framer-motion';
import { FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section>
    <h3 className="text-lg font-semibold mb-3">{title}</h3>
    {children}
  </section>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-muted-foreground mb-3">{children}</p>
);

const UL = ({ items }: { items: string[] }) => (
  <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-4 mb-3">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

const TermsOfServicePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Terms of Service</h1>
            <p className="text-xs text-muted-foreground">Last updated: April 2026</p>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Terms of Service</h2>
          <P>Please read these terms carefully before using Fócas.</P>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <Section title="1. Acceptance">
            <P>By downloading or using Fócas, you agree to these Terms. If you do not agree, please do not use the app.</P>
          </Section>

          <Section title="2. What Fócas Is">
            <P>
              Fócas is a personal focus tool that helps students voluntarily limit distracting apps on their own device during study and school hours. It is a student-led, opt-in tool — not a school management or surveillance system. The student is always in control.
            </P>
          </Section>

          <Section title="3. Who Can Use Fócas">
            <P>
              Fócas is designed for secondary school students aged 12 and older. Users under 16 are encouraged to set up the app together with a parent or guardian. There is no formal age verification — parents and guardians are responsible for ensuring the app is appropriate for their child.
            </P>
          </Section>

          <Section title="4. Student Responsibilities">
            <P>As a student using Fócas, you agree to:</P>
            <UL items={[
              "Use the app honestly and in the spirit it is intended — to support your own focus",
              "Not share guardian unlock codes with other students to bypass restrictions",
              "Keep your schedule and settings accurate so the app works as intended",
            ]} />
          </Section>

          <Section title="5. Guardian Responsibilities">
            <P>As a parent or guardian linked to a student on Fócas, you agree to:</P>
            <UL items={[
              "Only use the guardian features to support your child, not to monitor or control them",
              "Generate unlock codes responsibly and only when genuinely needed",
              "Respect that the student controls their own app settings",
            ]} />
          </Section>

          <Section title="6. Screen Time and App Restrictions">
            <P>
              Fócas uses Apple's Screen Time API to limit app categories during focus sessions. This requires granting FamilyControls permission during setup. This permission can be revoked at any time through your iPhone's Settings app. Removing the app removes all restrictions immediately.
            </P>
          </Section>

          <Section title="7. No Guarantee of Effectiveness">
            <P>
              Fócas is a tool to support focus — it is not a guarantee of academic performance or behaviour. The app works best when used voluntarily and consistently. We make no claims about specific outcomes.
            </P>
          </Section>

          <Section title="8. Unlock Codes">
            <P>
              Guardian unlock codes are provided as a trust-based mechanism to allow early session exit when genuinely needed. They are not intended as a routine bypass of focus sessions.
            </P>
          </Section>

          <Section title="9. Data and Privacy">
            <P>
              Your use of Fócas is governed by our Privacy Policy. All data is stored locally on your device. We do not operate servers or collect personal information.
            </P>
          </Section>

          <Section title="10. No Warranty">
            <P>
              Fócas is provided as-is. While we work hard to keep it reliable, we cannot guarantee the app will be error-free or uninterrupted at all times.
            </P>
          </Section>

          <Section title="11. Limitation of Liability">
            <P>
              To the maximum extent permitted by Irish and EU law, Fócas and its developers are not liable for indirect, incidental, or consequential damages arising from use of the app.
            </P>
          </Section>

          <Section title="12. Governing Law">
            <P>
              These Terms are governed by the laws of Ireland. Any disputes shall be subject to the exclusive jurisdiction of the Irish courts.
            </P>
          </Section>

          <Section title="13. Changes">
            <P>
              We may update these Terms as the app evolves. Continued use after changes constitutes acceptance. Significant changes will be notified through the app.
            </P>
          </Section>

          <Section title="14. Contact">
            <P>For questions about these Terms: support@focas.app</P>
          </Section>
        </motion.div>
      </main>
    </div>
  );
};

export default TermsOfServicePage;
