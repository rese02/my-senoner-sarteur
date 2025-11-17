'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, Gift, Loader2, QrCode, User } from 'lucide-react';
import { mockUsers, mockLoyaltyData } from '@/lib/mock-data';
import type { User as UserType, LoyaltyData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';


// Zustand 1: Bereit zum Scannen
function ReadyToScanView({ onStartScan }: { onStartScan: () => void }) {
    return (
        <Card className="text-center shadow-xl">
            <CardHeader>
                <QrCode className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-3xl">Bereit zum Scannen</CardTitle>
                <CardDescription>Klicken Sie auf den Button, um die Kamera zu aktivieren und die Kundenkarte zu scannen.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={onStartScan} size="lg" className="w-full h-14 text-lg">
                    <Camera className="mr-2 h-6 w-6" />
                    Scan starten
                </Button>
            </CardContent>
        </Card>
    );
}

// Zustand 2: Aktiver Scanner
function ActiveScannerView({ onScanSuccess, onCancel, hasCameraPermission }: { onScanSuccess: (data: string) => void, onCancel: () => void, hasCameraPermission: boolean | null }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isScanning, setIsScanning] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error("getUserMedia not supported");
            }
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            onCancel(); // Go back if camera fails
          }
        };
        if (hasCameraPermission) {
            getCameraPermission();
        }

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
    }, [hasCameraPermission, onCancel]);

    const handleMockScan = () => {
        if (!hasCameraPermission) {
            toast({ variant: 'destructive', title: 'Kamera nicht bereit', description: 'Bitte erlauben Sie den Kamerazugriff.' });
            return;
        }
        setIsScanning(true);
        toast({ title: 'Suche nach QR Code...' });

        // Simulate a successful scan after 2 seconds.
        setTimeout(() => {
            onScanSuccess('user-1-customer');
            setIsScanning(false);
        }, 1500);
    }
    
    return (
        <Card className="text-center">
            <CardHeader>
                <CardTitle>Karte scannen</CardTitle>
                <CardDescription>Richten Sie die Kamera auf den QR-Code des Kunden.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
                 <div className="w-full max-w-md mx-auto">
                    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted border">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
                        {!hasCameraPermission &&
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-4">
                                <Camera className="w-16 h-16 mb-4 text-muted-foreground" />
                                <p className="font-semibold text-lg">Kamera nicht verfügbar</p>
                            </div>
                        }
                    </div>
                </div>
                <Button size="lg" onClick={handleMockScan} disabled={isScanning || !hasCameraPermission}>
                    {isScanning ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Camera className="mr-2 h-5 w-5" />}
                    {isScanning ? 'Scanne...' : 'Jetzt Scannen'}
                </Button>
                <Button variant="ghost" onClick={onCancel}>Abbrechen</Button>
            </CardContent>
        </Card>
    );
}

// Zustand 3: Ergebnis des Scans
function ScanResultView({ user, onNextCustomer }: { user: UserType, onNextCustomer: () => void }) {
    const { toast } = useToast();
    const [loyaltyData, setLoyaltyData] = useState(mockLoyaltyData.find(l => l.userId === user.id));

    const handleAddStamp = () => {
        if (!loyaltyData) return;
        setLoyaltyData(prev => prev ? { ...prev, stamps: prev.stamps + 50 } : null);
        toast({ title: 'Punkte hinzugefügt!', description: `${user?.name} hat jetzt ${loyaltyData.stamps + 50} Punkte.` });
    };

    const handleRedeemCoupon = () => {
        if (!loyaltyData || loyaltyData.availableCoupons.length === 0) return;
        setLoyaltyData(prev => prev ? { ...prev, availableCoupons: [] } : null);
        toast({ title: 'Coupon eingelöst!', description: `Ein 5€-Gutschein wurde für ${user?.name} eingelöst.` });
    };

    return (
         <Card className="w-full text-center shadow-xl animate-in fade-in-50">
            <CardHeader>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                <CardTitle className="text-2xl mt-2">{user.name}</CardTitle>
                <CardDescription>Aktuelle Punkte: {loyaltyData?.stamps}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Button onClick={handleAddStamp} className="h-16 text-lg">
                    Punkte hinzufügen
                </Button>
                <Button variant="outline" onClick={handleRedeemCoupon} className="h-16 text-lg" disabled={!loyaltyData || loyaltyData.availableCoupons.length === 0}>
                    <Gift className="mr-2 h-6 w-6" />
                    Gutschein einlösen
                </Button>
                <Button variant="secondary" onClick={onNextCustomer} className="mt-8 h-12">
                    Nächsten Kunden scannen
                </Button>
            </CardContent>
        </Card>
    );
}


export default function ScannerPage() {
    type ViewState = 'ready' | 'scanning' | 'result';
    const [viewState, setViewState] = useState<ViewState>('ready');
    const [scannedUser, setScannedUser] = useState<UserType | null>(null);
    const { toast } = useToast();
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

    useEffect(() => {
        const checkCameraPermission = async () => {
          try {
            if (!navigator.mediaDevices?.getUserMedia) {
                setHasCameraPermission(false);
                return;
            }
            // Try to get permission status
            const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
            if (result.state === 'granted') {
                setHasCameraPermission(true);
            } else if (result.state === 'prompt') {
                // We can't know for sure, but we can assume we can ask.
                setHasCameraPermission(true);
            } else {
                setHasCameraPermission(false);
            }
          } catch (error) {
            // Some browsers don't support permissions.query, so we assume we can ask.
            console.warn('Camera permission query failed, assuming we can ask.', error);
            setHasCameraPermission(true);
          }
        };
        checkCameraPermission();
    }, []);

    const handleScanSuccess = (userId: string) => {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
            setScannedUser(user);
            setViewState('result');
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(100);
            }
        } else {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Kunde nicht gefunden.' });
            setViewState('ready');
        }
    };

    const resetScanner = () => {
        setViewState('ready');
        setScannedUser(null);
    };
    
    const startScanFlow = () => {
        if (hasCameraPermission === false) {
             toast({ variant: 'destructive', title: 'Kamerazugriff verweigert', description: 'Bitte erlauben Sie den Kamerazugriff in Ihren Browser-Einstellungen.' });
             return;
        }
        setViewState('scanning');
    }

    if (viewState === 'scanning') {
        return <ActiveScannerView onScanSuccess={handleScanSuccess} onCancel={resetScanner} hasCameraPermission={hasCameraPermission} />;
    }

    if (viewState === 'result' && scannedUser) {
        return <ScanResultView user={scannedUser} onNextCustomer={resetScanner} />;
    }

    return <ReadyToScanView onStartScan={startScanFlow} />;
}
