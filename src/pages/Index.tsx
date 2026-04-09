import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import SplashScreen from './SplashScreen';
import OnboardingScreen from './OnboardingScreen';
import MvpStatusPage from '@/components/mvp/MvpStatusPage';
import DataSharingConsent, { ConsentChoices } from '@/components/student/DataSharingConsent';
import ScreenTimePermission from '@/components/student/ScreenTimePermission';
import GuardianInvite from '@/components/student/GuardianInvite';
import { toast } from 'sonner';

/**
 * Index — Student onboarding flow
 * Splash → Onboarding slides → FamilyControls → Guardian invite → Sharing consent → Home
 */
const Index = () => {
  const navigate = useNavigate();
  const {
    onboardingStep,
    setOnboardingStep,
    setUserRole,
    setAuthenticated,
    updateStudentConsent,
    setHasOptedInToShare,
    isAuthenticated,
    userRole,
  } = useApp();

  const handleSplashComplete = () => {
    setUserRole('student');
    setOnboardingStep('onboarding');
  };

  const handleOnboardingComplete = () => {
    setOnboardingStep('screentime');
  };

  const handleScreenTimeComplete = () => {
    setOnboardingStep('guardian-invite');
  };

  const handleGuardianInvite = (guardian: { method: 'email' | 'phone'; value: string } | null) => {
    if (guardian) {
      toast.success('Invite sent!', {
        description: `We'll invite your guardian via ${guardian.method}.`,
      });
    }
    setOnboardingStep('data-consent');
  };

  const handleDataConsent = (consents: ConsentChoices) => {
    updateStudentConsent({
      shareStatusWithTeachers: consents.shareStatusWithTeachers,
      shareStatusWithGuardians: consents.shareStatusWithGuardians,
      allowEncouragementMessages: consents.allowEncouragementMessages,
      acceptTermsAndPrivacy: consents.acceptTermsAndPrivacy,
      consentTimestamp: new Date().toISOString(),
    });
    setHasOptedInToShare(consents.shareStatusWithGuardians);
    setAuthenticated(true);
    setOnboardingStep('complete');
  };

  const handleConsentDecline = () => {
    setOnboardingStep('onboarding');
  };

  // If authenticated, show the appropriate dashboard
  if (isAuthenticated && onboardingStep === 'complete') {
    if (userRole === 'parent') {
      navigate('/guardian', { replace: true });
      return null;
    }
    return <MvpStatusPage />;
  }

  // Student onboarding flow
  switch (onboardingStep) {
    case 'splash':
      return <SplashScreen onComplete={handleSplashComplete} />;

    case 'onboarding':
      return <OnboardingScreen onComplete={handleOnboardingComplete} />;

    case 'screentime':
      return <ScreenTimePermission onComplete={handleScreenTimeComplete} />;

    case 'guardian-invite':
      return <GuardianInvite onComplete={handleGuardianInvite} />;

    case 'data-consent':
      return (
        <DataSharingConsent
          ageGroup="13to17"
          onConsent={handleDataConsent}
          onDecline={handleConsentDecline}
        />
      );

    case 'login':
    // Login removed — go straight to home after consent

    case 'complete':
    default:
      return <MvpStatusPage />;
  }
};

export default Index;
