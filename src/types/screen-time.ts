// TypeScript definitions for Screen Time plugin

export type ScreenTimeAuthorizationStatus = 
  | 'notDetermined' 
  | 'denied' 
  | 'approved' 
  | 'unknown';

export interface ScreenTimeAuthResult {
  granted: boolean;
  status: ScreenTimeAuthorizationStatus;
  error?: string;
}

export interface ScreenTimeStatusResult {
  status: ScreenTimeAuthorizationStatus;
  isAuthorized: boolean;
}

export interface MonitoringOptions {
  scheduleName: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface MonitoringResult {
  success: boolean;
  message: string;
}

export interface FocasScreenTimePlugin {
  requestAuthorization(): Promise<ScreenTimeAuthResult>;
  getAuthorizationStatus(): Promise<ScreenTimeStatusResult>;
  startMonitoring(options: MonitoringOptions): Promise<MonitoringResult>;
  stopMonitoring(options: { scheduleName: string }): Promise<{ success: boolean; message: string }>;
  setAppRestrictions(): Promise<{ success: boolean; message: string }>;
  removeRestrictions(): Promise<{ success: boolean; message: string }>;
  getUsageReport(): Promise<{ available: boolean; message: string }>;
}

// Mock implementation for web/development
export const createMockScreenTimePlugin = (): FocasScreenTimePlugin => ({
  async requestAuthorization() {
    const granted = localStorage.getItem('screenTimePermissionGranted') === 'true';
    return {
      granted,
      status: granted ? 'approved' : 'notDetermined'
    };
  },
  
  async getAuthorizationStatus() {
    const permission = localStorage.getItem('screenTimePermissionGranted');
    if (permission === 'true') {
      return { status: 'approved', isAuthorized: true };
    } else if (permission === 'false') {
      return { status: 'denied', isAuthorized: false };
    }
    return { status: 'notDetermined', isAuthorized: false };
  },
  
  async startMonitoring(options) {
    console.log('[Mock] Starting monitoring:', options);
    localStorage.setItem('screenTimeMonitoring', JSON.stringify(options));
    return { success: true, message: 'Mock monitoring started' };
  },
  
  async stopMonitoring(options) {
    console.log('[Mock] Stopping monitoring:', options);
    localStorage.removeItem('screenTimeMonitoring');
    return { success: true, message: 'Mock monitoring stopped' };
  },
  
  async setAppRestrictions() {
    console.log('[Mock] Setting app restrictions');
    localStorage.setItem('screenTimeRestrictions', 'active');
    return { success: true, message: 'Mock restrictions applied' };
  },
  
  async removeRestrictions() {
    console.log('[Mock] Removing restrictions');
    localStorage.removeItem('screenTimeRestrictions');
    return { success: true, message: 'Mock restrictions removed' };
  },
  
  async getUsageReport() {
    return { available: false, message: 'Usage reports not available in mock mode' };
  }
});
