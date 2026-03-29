import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface MobileLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export const MobileLayout = ({ children, hideNav = false }: MobileLayoutProps) => {
  return (
    <div className="min-h-screen bg-background flex flex-col max-w-[430px] mx-auto relative">
      <main className="flex-1 pb-24 overflow-y-auto">
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  );
};
