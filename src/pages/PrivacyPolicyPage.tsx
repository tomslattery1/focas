import { motion } from 'framer-motion';
import { Shield, ArrowLeft } from 'lucide-react';
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

const PrivacyPolicyPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">Privacy Policy</h1>
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
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your Privacy, Your Control</h2>
          <P>
            Fócas is built on a simple principle: you are in control. The app runs entirely on your device. We do not operate servers, collect personal data, or sell information to anyone.
          </P>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <Section title="1. What Fócas Collects">
            <P>Fócas stores the following data locally on your device only:</P>
            <UL items={[
              "Your focus session history (start time, duration, score)",
              "Your blocked app categories (e.g. Social Media, Games)",
              "Your gamification progress (streaks, badges, weekly goal)",
              "Your schedule (subjects and times you enter yourself)",
              "Your sharing preferences (which you control at any time)",
            ]} />
            <P>None of this data leaves your device unless you explicitly choose to share it.</P>
          </Section>

          <Section title="2. What Fócas Never Collects">
            <UL items={[
              "The specific apps installed on your phone",
              "Your messages, emails, calls, or browsing history",
              "Your photos, files, or screen content",
              "Your location or GPS data",
              "Your contacts or social connections",
              "Any data without your explicit knowledge and consent",
            ]} />
          </Section>

          <Section title="3. Sharing with Guardians">
            <P>If you choose to share with a parent or guardian, they may see:</P>
            <UL items={[
              "Whether you are currently in a Fócas session (on/off only)",
              "Which app categories you have chosen to block",
              "Your focus score and streak",
            ]} />
            <P>
              This sharing is entirely opt-in, controlled by you in Settings, and can be turned off at any time. Guardians cannot see specific apps on your device, cannot change your settings remotely, and cannot control your device in any way.
            </P>
          </Section>

          <Section title="4. Sharing with Teachers">
            <P>
              Teacher sharing is coming in a future version. When available, it will follow the same opt-in, student-controlled model described above.
            </P>
          </Section>

          <Section title="5. School Codes">
            <P>
              If you enter a school code to load a timetable template, this code is used only to pre-populate your schedule. No data is sent to your school and your school has no access to your app or device.
            </P>
          </Section>

          <Section title="6. Apple Screen Time API">
            <P>
              Fócas uses Apple's Screen Time API (FamilyControls, ManagedSettings, DeviceActivity frameworks) to limit distracting apps during focus sessions. This operates entirely through Apple's own privacy-protected system. Fócas never inspects which specific apps are on your device and never accesses app content.
            </P>
          </Section>

          <Section title="7. Children and Minors">
            <P>
              Fócas is designed for secondary school students aged 12 and older. We do not knowingly collect personal data from any user. All data stays on the student's device. Parents and guardians are encouraged to set up the app together with their child.
            </P>
          </Section>

          <Section title="8. GDPR">
            <P>
              Fócas is developed in Ireland and is designed to comply with the General Data Protection Regulation (GDPR). As all data is stored locally on your device and no personal data is transmitted to our servers, the data minimisation and storage limitation principles are met by design.
            </P>
          </Section>

          <Section title="9. Your Rights">
            <P>
              You can delete all Fócas data at any time by tapping "Restart" in Settings. This clears all locally stored data from your device immediately and permanently.
            </P>
          </Section>

          <Section title="10. Changes to This Policy">
            <P>
              We will update this policy as the app evolves. Significant changes will be communicated through the app. Continued use after changes constitutes acceptance.
            </P>
          </Section>

          <Section title="11. Contact">
            <P>For privacy questions: privacy@focas.app</P>
          </Section>
        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicyPage;
