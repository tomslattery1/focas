import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import SplashScreen from './SplashScreen';
import OnboardingScreen from './OnboardingScreen';
import LoginScreen from './LoginScreen';
import MvpStatusPage from '@/components/mvp/MvpStatusPage';
import DataSharingConsent, { ConsentChoices } from '@/components/student/DataSharingConsent';
import ScreenTimePermission from '@/components/student/ScreenTimePermission';
import GuardianInvite from '@/components/student/GuardianInvite';
import GuardianDashboard from './GuardianDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';
import DemoRoleSelector from '@/components/demo/DemoRoleSelector';
import { toast } from 'sonner';
import { UserRole } from '@/types/app';

/**
 * MVP Index — Multi-role demo with student as default
 * Splash → Onboarding slides → FamilyControls → Guardian invite → Sharing consent → Login → Home
 * Demo mode: select role to jump into any dashboard
 */
const Index = () => {
  const {
    onboardingStep,
    setOnboardingStep,
    userRole,
    setUserRole,
    setAuthenticated,
    updateStudentConsent,
    setHasOptedInToShare,
    isAuthenticated,
  } = useApp();

  const [showDemoSelector, setShowDemoSelector] = useState(false);

  const handleSplashComplete = () => {
    setShowDemoSelector(true);
  };

  const handleDemoRoleSelect = (role: UserRole) => {
    setUserRole(role);
    if (role === 'student') {
      setShowDemoSelector(false);
      setOnboardingStep('onboarding');
    } else {
      // Non-student roles skip onboarding and go straight to their dashboard
      setAuthenticated(true);
      setOnboardingStep('complete');
      setShowDemoSelector(false);
    }
  };

  const handleContinueAsStudent = () => {
    setUserRole('student');
    setShowDemoSelector(false);
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

  const handleLoginComplete = () => {
    setAuthenticated(true);
    setOnboardingStep('complete');
  };

  // Show demo role selector after splash
  if (showDemoSelector) {
    return (
      <DemoRoleSelector
        onSelectRole={handleDemoRoleSelect}
        onContinueAsStudent={handleContinueAsStudent}
      />
    );
  }

  // If authenticated, show the appropriate dashboard
  if (isAuthenticated && onboardingStep === 'complete') {
    switch (userRole) {
      case 'parent':
        return <GuardianDashboard />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'student':
      default:
        return <MvpStatusPage />;
    }
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
