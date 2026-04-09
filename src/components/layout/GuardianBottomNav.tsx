import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Key, Heart, Bell, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/guardian', icon: Shield, label: 'Overview' },
  { path: '/guardian/unlock', icon: Key, label: 'Unlock' },
  { path: '/guardian/encourage', icon: Heart, label: 'Encourage' },
  { path: '/guardian/activity', icon: Bell, label: 'Activity' },
  { path: '/guardian/settings', icon: Settings, label: 'Settings' },
];

export const GuardianBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-[430px] mx-auto bg-card/95 backdrop-blur-xl border-t border-border px-2 pb-6 pt-2 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[60px]",
                isActive && "text-primary",
                !isActive && "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className="relative">
                <Icon className="w-6 h-6" />
                {isActive && (
                  <motion.div
                    layoutId="guardian-nav-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
