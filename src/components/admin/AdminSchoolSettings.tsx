import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { School, Shield, Save, Upload, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useApp } from '@/contexts/AppContext';

export const AdminSchoolSettings = () => {
  const { toast } = useToast();
  const { schoolSettings, updateSchoolSettings } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [settings, setSettings] = useState({
    schoolName: schoolSettings.schoolName,
    emergencyUnlockEnabled: schoolSettings.emergencyUnlockEnabled,
    parentNotificationsEnabled: schoolSettings.parentNotificationsEnabled,
    teacherAppSuggestionsEnabled: schoolSettings.teacherAppSuggestionsEnabled,
    schoolModeRemindersEnabled: schoolSettings.schoolModeRemindersEnabled,
  });

  const [logoPreview, setLogoPreview] = useState<string>(schoolSettings.schoolLogo);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateSchoolSettings({
      ...settings,
      schoolLogo: logoPreview,
    });
    toast({
      title: 'Settings saved',
      description: 'School settings have been updated successfully.',
    });
  };

  const updateSetting = (key: string, value: string | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-semibold">School Settings</h2>
        <p className="text-sm text-muted-foreground">
          Configure school-wide Fócas settings
        </p>
      </motion.div>

      {/* School Information */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-xl bg-card border space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <School className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">School Information</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="schoolName">School Name</Label>
          <Input
            id="schoolName"
            value={settings.schoolName}
            onChange={(e) => updateSetting('schoolName', e.target.value)}
          />
        </div>

        {/* Logo Upload */}
        <div className="space-y-2">
          <Label>School Logo</Label>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl border-2 border-dashed border-muted-foreground/30 overflow-hidden flex items-center justify-center bg-muted/50">
              {logoPreview ? (
                <img 
                  src={logoPreview} 
                  alt="School logo preview" 
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image className="w-8 h-8 text-muted-foreground/50" />
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground">
                PNG or JPG, max 2MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>
        </div>
      </motion.div>

      {/* Feature Toggles */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-xl bg-card border space-y-4"
      >
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Features & Permissions</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">School Mode Reminders</p>
              <p className="text-xs text-muted-foreground">
                Send reminders to students to enable school mode during school hours
              </p>
            </div>
            <Switch
              checked={settings.schoolModeRemindersEnabled}
              onCheckedChange={(checked) => updateSetting('schoolModeRemindersEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Emergency Unlock</p>
              <p className="text-xs text-muted-foreground">
                Allow students to request emergency device unlock
              </p>
            </div>
            <Switch
              checked={settings.emergencyUnlockEnabled}
              onCheckedChange={(checked) => updateSetting('emergencyUnlockEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Parent Notifications</p>
              <p className="text-xs text-muted-foreground">
                Send compliance updates to parents
              </p>
            </div>
            <Switch
              checked={settings.parentNotificationsEnabled}
              onCheckedChange={(checked) => updateSetting('parentNotificationsEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div>
              <p className="font-medium">Teacher App Suggestions</p>
              <p className="text-xs text-muted-foreground">
                Allow teachers to suggest apps for Fócas list
              </p>
            </div>
            <Switch
              checked={settings.teacherAppSuggestionsEnabled}
              onCheckedChange={(checked) => updateSetting('teacherAppSuggestionsEnabled', checked)}
            />
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <Button onClick={handleSave} className="w-full gap-2">
          <Save className="w-4 h-4" />
          Save Settings
        </Button>
      </motion.div>
    </div>
  );
};
