import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQrScanner } from '@/hooks/useQrScanner';
import { X, Camera } from 'lucide-react';

interface QrScannerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const QrScannerDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: QrScannerDialogProps) => {
  const { isScanning, videoRef, startScanning, stopScanning } = useQrScanner((code) => {
    // Any valid QR code activates School Mode
    onSuccess();
    onOpenChange(false);
  });

  useEffect(() => {
    if (open) {
      startScanning();
    } else {
      stopScanning();
    }
  }, [open, startScanning, stopScanning]);

  const handleSimulateScan = () => {
    // Demo: simulate a successful scan
    onSuccess();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <div className="relative">
          {/* Video feed */}
          <div className="relative aspect-square bg-black">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              muted
            />
            
            {/* Scanning overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-48 h-48 border-2 border-primary rounded-lg"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.98, 1, 0.98],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              {/* Corner markers */}
              <div className="absolute w-52 h-52">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
              </div>
              
              {/* Scanning line */}
              <motion.div
                className="absolute w-44 h-0.5 bg-primary/80"
                animate={{
                  y: [-80, 80],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* Camera not available overlay */}
            {!isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/90">
                <Camera className="w-12 h-12 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Camera loading...</p>
              </div>
            )}
          </div>

          {/* Info section */}
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-foreground">Scan Classroom QR Code</h3>
              <p className="text-sm text-muted-foreground">
                Point your camera at the QR code displayed in your classroom.
              </p>
            </div>

            {/* Demo button - remove in production */}
            <Button 
              onClick={handleSimulateScan} 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              Demo: Simulate Scan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
