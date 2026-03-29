import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.ee5961ed24034ce9979ee57293f1bf47',
  appName: 'Fócas',
  webDir: 'dist',
  server: {
    url: 'https://ee5961ed-2403-4ce9-979e-e57293f1bf47.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    contentInset: 'automatic',
    scheme: 'Fócas'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
