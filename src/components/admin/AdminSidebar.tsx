import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Calendar, 
  AppWindow, 
  Bell, 
  Clock, 
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  BookOpen,
  Monitor,
  Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  section?: string;
}

const navItems: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, section: 'main' },
  { id: 'focus-scores', label: 'Focus Scores', icon: Shield, section: 'main' },
  { id: 'users', label: 'Users', icon: Users, section: 'manage' },
  { id: 'classes', label: 'Classes', icon: GraduationCap, section: 'manage' },
  { id: 'subject-groups', label: 'Subject Groups', icon: BookOpen, section: 'manage' },
  { id: 'schedule', label: 'Schedule', icon: Clock, section: 'manage' },
  { id: 'timetable', label: 'Timetable', icon: Calendar, section: 'timetable' },
  { id: 'apps', label: 'App Approvals', icon: AppWindow, section: 'content' },
  { id: 'app-suggestions', label: 'App Suggestions', icon: Smartphone, section: 'content' },
  { id: 'announcements', label: 'Announcements', icon: Bell, section: 'content' },
  { id: 'log', label: 'Activity Log', icon: LayoutDashboard, section: 'content' },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'system' },
];

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const AdminSidebar = ({ activeSection, onSectionChange }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { resetOnboarding, schoolSettings, adminViewMode, setAdminViewMode } = useApp();

  const handleSignOut = () => {
    resetOnboarding();
    navigate('/');
  };

  const sections = {
    main: 'Dashboard',
    manage: 'Management',
    timetable: 'Timetable',
    content: 'Content',
    system: 'System',
  };

  const groupedItems = navItems.reduce((acc, item) => {
    const section = item.section || 'main';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <aside className={cn(
      "h-screen sticky top-0 border-r bg-card flex flex-col transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-sm">Fócas Admin</h1>
              <p className="text-xs text-muted-foreground truncate max-w-[140px]">{schoolSettings.schoolName}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
            <Shield className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-6">
        {Object.entries(groupedItems).map(([sectionKey, items]) => (
          <div key={sectionKey}>
            {!collapsed && (
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">
                {sections[sectionKey as keyof typeof sections]}
              </p>
            )}
            <div className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      collapsed && "justify-center px-2",
                      isActive && "bg-primary/10 text-primary hover:bg-primary/15"
                    )}
                    onClick={() => onSectionChange(item.id)}
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {!collapsed && <span>{item.label}</span>}
                  </Button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t space-y-2">
        {/* View Mode Toggle */}
        <div className={cn("flex items-center gap-2", collapsed ? "justify-center" : "px-2")}>
          {!collapsed && <span className="text-xs text-muted-foreground">View:</span>}
          <ToggleGroup 
            type="single" 
            value={adminViewMode} 
            onValueChange={(value) => value && setAdminViewMode(value as 'mobile' | 'desktop')}
            className="bg-muted rounded-md"
          >
            <ToggleGroupItem 
              value="mobile" 
              aria-label="Mobile view" 
              className="px-2 py-1 h-7 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="desktop" 
              aria-label="Desktop view" 
              className="px-2 py-1 h-7 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
            >
              <Monitor className="w-3.5 h-3.5" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn("w-full justify-start gap-3", collapsed && "justify-center px-2")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span>Collapse</span>}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
            collapsed && "justify-center px-2"
          )}
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sign out</span>}
        </Button>
      </div>
    </aside>
  );
};
