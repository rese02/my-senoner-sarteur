
'use client';
import { useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Webcam from 'react-webcam';

interface ActiveScannerViewProps {
    onScanSuccess: (data: string) => void;
    onCancel: () => void;
}

export function ActiveScannerView({ onScanSuccess, onCancel }: ActiveScannerViewProps) {
    const webcamRef = useRef<Webcam>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (typeof window.navigator.vibrate === 'function') {
            window.navigator.vibrate(100);
        }
    }, []);

    // This is a MOCK scan for demonstration purposes. 
    // In a real app, you would integrate a QR code scanning library.
    const handleMockScan = useCallback(() => {
        if (typeof window.navigator.vibrate === 'function') {
            window.navigator.vibrate(50);
        }
        toast({ title: 'QR Code erkannt, verarbeite...' });

        setTimeout(() => {
            // This simulates scanning a QR code with the content "senoner-user:user-1-customer"
            onScanSuccess('senoner-user:user-1-customer');
        }, 1000);
    }, [onScanSuccess, toast]);
    
    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col text-white">
            <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                 <h2 className="font-bold text-lg drop-shadow-md">Karte scannen</h2>
                <Button variant="ghost" size="icon" onClick={onCancel} className="text-white hover:bg-white/20 hover:text-white rounded-full">
                    <X />
                    <span className="sr-only">Schließen</span>
                </Button>
            </header>
            <main className="flex-grow relative">
                <Webcam
                    audio={false}
                    ref={webcamRef}
                    videoConstraints={{ facingMode: "environment" }}
                    className="h-full w-full object-cover"
                />
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-60 h-60 border-4 border-white/50 rounded-2xl animate-pulse" />
                </div>
            </main>
            <footer className="p-4 bg-gradient-to-t from-black/50 to-transparent">
                 <Button onClick={handleMockScan} className="w-full h-12 text-lg rounded-full" >
                    <QrCode className="mr-2 h-5 w-5" />
                    Code simulieren (Dev)
                </Button>
            </footer>
        </div>
    );
}
