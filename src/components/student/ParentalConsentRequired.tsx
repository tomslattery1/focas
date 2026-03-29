import { motion } from 'framer-motion';
import { Users, ArrowLeft, Mail, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ParentalConsentRequiredProps {
  onBack: () => void;
}

const ParentalConsentRequired = ({ onBack }: ParentalConsentRequiredProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 flex flex-col"
      >
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="self-start -ml-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-status-amber/10 flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-status-amber" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-3">
            Parental Consent Required
          </h1>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto">
            Students under 13 need their parent or guardian to set up this app with them.
          </p>
        </div>

        {/* Options */}
        <div className="flex-1 max-w-sm mx-auto w-full space-y-4">
          <div className="p-5 rounded-xl border bg-card">
            <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Set Up Together
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Ask your parent or guardian to help you set up the app. They can select the "Guardian" role to learn more first.
            </p>
            <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
              <li>Show this screen to your parent/guardian</li>
              <li>Have them go back and select "Guardian" role</li>
              <li>Once they approve, return here together</li>
            </ol>
          </div>

          <div className="p-5 rounded-xl border bg-card">
            <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              School Enrollment
            </h3>
            <p className="text-sm text-muted-foreground">
              If your school enrolled you in Fócas, your parent/guardian should have received consent information. Check with your teacher or school office.
            </p>
          </div>

          <div className="p-5 rounded-xl border bg-card">
            <h3 className="font-medium text-foreground mb-2 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-primary" />
              Already Have Consent?
            </h3>
            <p className="text-sm text-muted-foreground">
              If your parent/guardian has already provided consent through your school, you can continue setup with their help.
            </p>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8">
          <p className="text-xs text-muted-foreground text-center max-w-xs mx-auto">
            We take children's privacy seriously. This requirement ensures compliance with COPPA (Children's Online Privacy Protection Act).
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ParentalConsentRequired;
