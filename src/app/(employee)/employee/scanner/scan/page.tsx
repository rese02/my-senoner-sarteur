
'use client';
import { Button } from '@/components/ui/button';
import { X, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef, useCallback, useState, Suspense } from 'react';
import jsQR from 'jsqr';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const Webcam = dynamic(() => import('react-webcam'), {
    ssr: false,
    loading: () => <Skeleton className="h-full w-full bg-muted" />
});

export default function ScanPage() {
    const { toast } = useToast();
    const router = useRouter();
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();
    const [isScanning, setIsScanning] = useState(true);

    const scanQrCode = useCallback(() => {
        if (!isScanning || !webcamRef.current || !webcamRef.current.video || !canvasRef.current) {
            return;
        }

        const video = webcamRef.current.video;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d', { willReadFrequently: true });

            if (context) {
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: 'dontInvert',
                });

                if (code && code.data.startsWith('senoner-user:')) {
                    setIsScanning(false);
                    if (typeof window.navigator.vibrate === 'function') {
                        window.navigator.vibrate([100, 50, 100]);
                    }
                    toast({ title: 'QR Code erkannt', description: 'Daten werden verarbeitet...' });
                    
                    const userId = code.data.replace('senoner-user:', '');
                    
                    router.push(`/employee/scanner?userId=${userId}`);
                }
            }
        }
        if (isScanning) {
            requestRef.current = requestAnimationFrame(scanQrCode);
        }
    }, [isScanning, toast, router]);

    useEffect(() => {
        // Start scanning animation frame loop
        requestRef.current = requestAnimationFrame(scanQrCode);
        
        // Cleanup function to cancel the animation frame when the component unmounts
        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [scanQrCode]);

     useEffect(() => {
        // Vibrate on mount to signal camera is ready
        if (typeof window.navigator.vibrate === 'function') {
            window.navigator.vibrate(100);
        }
    }, []);
    
    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col text-white">
            <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-20">
                 <h2 className="font-bold text-lg drop-shadow-md flex items-center gap-2"><QrCode className="w-5 h-5"/> Kundenkarte scannen</h2>
                <Button variant="ghost" size="icon" onClick={() => router.push('/employee/scanner')} className="text-white hover:bg-white/20 hover:text-white rounded-full">
                    <X />
                    <span className="sr-only">Schließen</span>
                </Button>
            </header>
            <main className="flex-grow relative bg-black">
                 <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{ facingMode: "environment" }}
                    className="h-full w-full object-cover"
                />
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="w-60 h-60 border-4 border-white/50 rounded-2xl animate-pulse" />
                </div>
                <canvas ref={canvasRef} style={{ display: 'none' }} />
            </main>
        </div>
    );
}
