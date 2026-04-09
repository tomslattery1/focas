import { ReactNode } from 'react';
import { GuardianBottomNav } from './GuardianBottomNav';

interface GuardianLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export const GuardianLayout = ({ children, hideNav = false }: GuardianLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[430px] mx-auto relative">
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>
      {!hideNav && <GuardianBottomNav />}
    </div>
  );
};
