import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ie.tomlattery.focas',
  appName: 'Fócas',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
    scheme: 'Fócas'
  }
};

export default config;
