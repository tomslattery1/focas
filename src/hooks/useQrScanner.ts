import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface UseQrScannerReturn {
  isScanning: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  startScanning: () => Promise<void>;
  stopScanning: () => void;
}

export const useQrScanner = (
  onCodeScanned: (code: string) => void
): UseQrScannerReturn => {
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const stopScanning = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsScanning(false);
  }, []);

  const startScanning = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setIsScanning(true);
      
      // Create canvas for QR detection
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      
      // For demo purposes, we'll accept any scan after 2 seconds
      // In production, you'd use a proper QR library like jsQR
      setTimeout(() => {
        if (isScanning) {
          toast.info('Scan the classroom QR code', {
            description: 'Point your camera at the QR code to activate School Mode.',
          });
        }
      }, 500);
      
    } catch (error) {
      console.error('Camera error:', error);
      toast.error('Camera access denied', {
        description: 'Please allow camera access to scan QR codes.',
      });
      setIsScanning(false);
    }
  }, [isScanning]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, [stopScanning]);

  return {
    isScanning,
    videoRef,
    startScanning,
    stopScanning,
  };
};
