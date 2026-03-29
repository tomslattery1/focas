/// <reference path="../types/web-nfc.d.ts" />
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';

interface UseNfcActivationReturn {
  isNfcSupported: boolean;
  isScanning: boolean;
  startNfcScan: () => Promise<void>;
  stopNfcScan: () => void;
}

export const useNfcActivation = (
  onTagRead: () => void
): UseNfcActivationReturn => {
  const [isNfcSupported, setIsNfcSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [reader, setReader] = useState<NDEFReader | null>(null);

  useEffect(() => {
    // Check for Web NFC API support
    const supported = 'NDEFReader' in window;
    setIsNfcSupported(supported);
  }, []);

  const startNfcScan = useCallback(async () => {
    if (!isNfcSupported) {
      toast.error('NFC not supported', {
        description: 'Your device does not support NFC scanning.',
      });
      return;
    }

    try {
      const ndefReader = new NDEFReader();
      await ndefReader.scan();
      
      setReader(ndefReader);
      setIsScanning(true);
      
      toast.info('Ready to scan', {
        description: 'Hold your device near the school NFC tag.',
      });

      ndefReader.addEventListener('reading', () => {
        // Any NFC tag will activate School Mode
        toast.success('Tag detected!', {
          description: 'School Mode activated.',
        });
        onTagRead();
        setIsScanning(false);
      });

      ndefReader.addEventListener('readingerror', () => {
        toast.error('Read error', {
          description: 'Could not read the NFC tag. Try again.',
        });
      });
    } catch (error) {
      console.error('NFC error:', error);
      
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          toast.error('Permission denied', {
            description: 'Please allow NFC access in your browser settings.',
          });
        } else if (error.name === 'NotSupportedError') {
          toast.error('NFC unavailable', {
            description: 'NFC is not available on this device.',
          });
        } else {
          toast.error('NFC error', {
            description: error.message,
          });
        }
      }
      
      setIsScanning(false);
    }
  }, [isNfcSupported, onTagRead]);

  const stopNfcScan = useCallback(() => {
    setIsScanning(false);
    setReader(null);
  }, []);

  return {
    isNfcSupported,
    isScanning,
    startNfcScan,
    stopNfcScan,
  };
};
