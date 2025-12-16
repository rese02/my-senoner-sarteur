'use client';

import { useState } from 'react';
import jsQR from 'jsqr';
import { addStamp } from '@/app/actions/loyalty.actions';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, Loader2 } from "lucide-react";
import Webcam from 'react-webcam';
import { useRef, useCallback, useEffect } from 'react';

export default function EmployeeScannerPage() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [manualId, setManualId] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>();

    const processUser = (userId: string) => {
        if (userId) {
            setScanResult(userId);
            if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
        }
    };
    
    const scanQrCode = useCallback(() => {
        if (!webcamRef.current?.video || !canvasRef.current) return;
        
        const video = webcamRef.current.video;
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d', { willReadFrequently: true });
            if (!context) return;
            
            canvas.height = video.videoHeight;
            canvas.width = video.videoWidth;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert"
            });
            
            if (code && code.data.startsWith('senoner-user:')) {
                const userId = code.data.replace('senoner-user:', '');
                processUser(userId);
                 cancelAnimationFrame(requestRef.current!);
            } else {
                 requestRef.current = requestAnimationFrame(scanQrCode);
            }
        } else {
             requestRef.current = requestAnimationFrame(scanQrCode);
        }

    }, []);

    useEffect(() => {
        if (!scanResult) {
            requestRef.current = requestAnimationFrame(scanQrCode);
        }
        return () => {
            if (requestRef.current) {
                 cancelAnimationFrame(requestRef.current);
            }
        }
    }, [scanResult, scanQrCode]);

    const handleGivePoints = async (purchaseAmount: number) => {
        if (!scanResult) return;
        setLoading(true);
        try {
            await addStamp(scanResult, purchaseAmount);
            toast({ 
                title: "Erfolg", 
                description: `Stempel gutgeschrieben!`,
                className: "bg-green-600 text-white" 
            });
            resetScanner();
        } catch (e: any) {
            toast({ variant: "destructive", title: "Fehler", description: e.message || "Kunde nicht gefunden." });
        } finally {
            setLoading(false);
        }
    };
    
    const resetScanner = () => {
        setScanResult(null);
        setManualId("");
    }

    return (
        <div className="space-y-6">
            {!scanResult ? (
                <div className="space-y-4">
                    {/* Kamera Bereich */}
                    <div className="rounded-xl overflow-hidden border-2 border-primary aspect-square relative bg-black">
                         <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: "environment" }}
                            className="h-full w-full object-cover"
                         />
                         <canvas ref={canvasRef} style={{ display: 'none' }} />
                        <div className="absolute inset-0 border-8 border-white/30 m-8 rounded-lg pointer-events-none" />
                        <p className="absolute bottom-4 left-0 right-0 text-center text-white font-bold bg-black/50 p-2">QR Code scannen</p>
                    </div>

                    {/* Manuelle Eingabe als Fallback */}
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Kunden-ID manuell..." 
                            value={manualId}
                            onChange={e => setManualId(e.target.value)}
                        />
                        <Button onClick={() => processUser(manualId)} disabled={manualId.length < 5}>OK</Button>
                    </div>
                </div>
            ) : (
                // Ansicht NACH dem Scan
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6 text-center space-y-6">
                        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
                        <div>
                            <h2 className="text-xl font-bold text-green-900">Kunde erkannt!</h2>
                            <p className="text-sm font-mono text-green-700 mt-1">{scanResult}</p>
                        </div>
                        
                         <div className="space-y-2">
                            <Button onClick={() => handleGivePoints(10)} disabled={loading} className="w-full h-14" variant="outline">Stempel für Einkauf geben</Button>
                             <p className="text-xs text-muted-foreground">Fügt einen Stempel für den heutigen Einkauf hinzu.</p>
                        </div>
                        

                        <Button variant="ghost" onClick={resetScanner} className="text-muted-foreground">
                            Abbrechen / Neuer Scan
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}