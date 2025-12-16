'use client';
import { Button } from '@/components/ui/button';
import { X, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';
import Webcam from 'react-webcam';

interface ActiveScannerViewProps {
    onScanSuccess: (data: string) => void;
    onCancel: () => void;
}

export function ActiveScannerView({ onScanSuccess, onCancel }: ActiveScannerViewProps) {
    const { toast } = useToast();
    const webcamRef = useRef<Webcam>(null);

     useEffect(() => {
        if (typeof window.navigator.vibrate === 'function') {
            window.navigator.vibrate(100);
        }
    }, []);

    // Simuliert einen erfolgreichen Scan für Entwicklungszwecke
    const simulateScan = () => {
        // HINWEIS: Ersetzen Sie dies durch eine echte User-ID aus Ihrer Datenbank für Tests
        const testUserId = "cus_MOCK_ID_001"; 
        const scanData = `senoner-user:${testUserId}`;
        
        if (typeof window.navigator.vibrate === 'function') {
            window.navigator.vibrate([100, 50, 100]);
        }
        toast({ title: 'QR Code (Simuliert) erkannt', description: 'Daten werden verarbeitet...' });
        onScanSuccess(scanData);
    };
    
    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col text-white">
            <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-20">
                 <h2 className="font-bold text-lg drop-shadow-md flex items-center gap-2"><QrCode className="w-5 h-5"/> Kundenkarte scannen</h2>
                <Button variant="ghost" size="icon" onClick={onCancel} className="text-white hover:bg-white/20 hover:text-white rounded-full">
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
            </main>
            {/* DEV-ONLY SIMULATION BUTTON */}
            <div className="absolute bottom-4 left-4 right-4 z-20">
                <Button onClick={simulateScan} variant="secondary" className="w-full">
                    Scan Simulieren (DEV)
                </Button>
            </div>
        </div>
    );
}
