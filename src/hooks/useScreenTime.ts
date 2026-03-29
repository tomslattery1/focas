import { useState, useEffect, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { registerPlugin } from '@capacitor/core';
import { 
  FocasScreenTimePlugin, 
  ScreenTimeAuthorizationStatus,
  createMockScreenTimePlugin 
} from '@/types/screen-time';

// Register the native plugin or use mock for web
const getScreenTimePlugin = (): FocasScreenTimePlugin => {
  if (Capacitor.isNativePlatform()) {
    return registerPlugin<FocasScreenTimePlugin>('FocasScreenTime');
  }
  return createMockScreenTimePlugin();
};

export interface UseScreenTimeReturn {
  status: ScreenTimeAuthorizationStatus;
  isAuthorized: boolean;
  isLoading: boolean;
  isNative: boolean;
  requestAuthorization: () => Promise<boolean>;
  startSchoolMode: (startHour: number, startMinute: number, endHour: number, endMinute: number) => Promise<boolean>;
  stopSchoolMode: () => Promise<boolean>;
  refreshStatus: () => Promise<void>;
}

export const useScreenTime = (): UseScreenTimeReturn => {
  const [status, setStatus] = useState<ScreenTimeAuthorizationStatus>('notDetermined');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const isNative = Capacitor.isNativePlatform();
  const plugin = getScreenTimePlugin();

  const refreshStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await plugin.getAuthorizationStatus();
      setStatus(result.status);
      setIsAuthorized(result.isAuthorized);
    } catch (error) {
      console.error('Failed to get Screen Time status:', error);
      // Fallback to localStorage for web
      const permission = localStorage.getItem('screenTimePermissionGranted');
      if (permission === 'true') {
        setStatus('approved');
        setIsAuthorized(true);
      } else if (permission === 'false') {
        setStatus('denied');
        setIsAuthorized(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, [plugin]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const requestAuthorization = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const result = await plugin.requestAuthorization();
      setStatus(result.status);
      setIsAuthorized(result.granted);
      return result.granted;
    } catch (error) {
      console.error('Failed to request authorization:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [plugin]);

  const startSchoolMode = useCallback(async (
    startHour: number, 
    startMinute: number, 
    endHour: number, 
    endMinute: number
  ): Promise<boolean> => {
    try {
      const result = await plugin.startMonitoring({
        scheduleName: 'school_hours',
        startHour,
        startMinute,
        endHour,
        endMinute
      });
      
      if (result.success) {
        await plugin.setAppRestrictions();
      }
      
      return result.success;
    } catch (error) {
      console.error('Failed to start school mode:', error);
      return false;
    }
  }, [plugin]);

  const stopSchoolMode = useCallback(async (): Promise<boolean> => {
    try {
      await plugin.removeRestrictions();
      const result = await plugin.stopMonitoring({ scheduleName: 'school_hours' });
      return result.success;
    } catch (error) {
      console.error('Failed to stop school mode:', error);
      return false;
    }
  }, [plugin]);

  return {
    status,
    isAuthorized,
    isLoading,
    isNative,
    requestAuthorization,
    startSchoolMode,
    stopSchoolMode,
    refreshStatus
  };
};
