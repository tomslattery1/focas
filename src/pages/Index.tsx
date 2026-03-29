import { useApp } from '@/contexts/AppContext';
import SplashScreen from './SplashScreen';
import OnboardingScreen from './OnboardingScreen';
import LoginScreen from './LoginScreen';
import MvpStatusPage from '@/components/mvp/MvpStatusPage';
import DataSharingConsent, { ConsentChoices } from '@/components/student/DataSharingConsent';
import ScreenTimePermission from '@/components/student/ScreenTimePermission';

/**
 * MVP Index — Student-only flow
 * Splash → Onboarding slides → FamilyControls → Sharing consent → Login → Home
 */
const Index = () => {
  const {
    onboardingStep,
    setOnboardingStep,
    setUserRole,
    setAuthenticated,
    updateStudentConsent,
    setHasOptedInToShare,
  } = useApp();

  const handleSplashComplete = () => {
    setUserRole('student');
    setOnboardingStep('onboarding');
  };

  const handleOnboardingComplete = () => {
    setOnboardingStep('screentime');
  };

  const handleScreenTimeComplete = () => {
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
    setHasOptedInToShare(consents.shareStatusWithGuardians || consents.shareStatusWithTeachers);
    setOnboardingStep('login');
  };

  const handleConsentDecline = () => {
    setOnboardingStep('onboarding');
  };

  const handleLoginComplete = () => {
    setAuthenticated(true);
    setOnboardingStep('complete');
  };

  switch (onboardingStep) {
    case 'splash':
      return <SplashScreen onComplete={handleSplashComplete} />;

    case 'onboarding':
      return <OnboardingScreen onComplete={handleOnboardingComplete} />;

    case 'screentime':
      return <ScreenTimePermission onComplete={handleScreenTimeComplete} />;

    case 'data-consent':
      return (
        <DataSharingConsent
          ageGroup="13to17"
          onConsent={handleDataConsent}
          onDecline={handleConsentDecline}
        />
      );

    case 'login':
      return <LoginScreen onLogin={handleLoginComplete} userRole="student" />;

    case 'complete':
    default:
      return <MvpStatusPage />;
  }
};

export default Index;
