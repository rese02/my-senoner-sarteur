'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, Gift, Loader2, QrCode, X } from 'lucide-react';
import { mockUsers } from '@/lib/mock-data';
import type { User as UserType } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getLoyaltyTier, loyaltyTiers } from '@/lib/loyalty';
import Webcam from 'react-webcam';

// Zustand 1: Bereit zum Scannen
function ReadyToScanView({ onStartScan }: { onStartScan: () => void }) {
    return (
        <Card className="text-center shadow-xl border-none">
            <CardHeader>
                <div className="mx-auto bg-primary/10 text-primary rounded-full h-24 w-24 flex items-center justify-center mb-4">
                    <QrCode className="w-12 h-12" />
                </div>
                <CardTitle className="text-3xl">Bereit zum Scannen</CardTitle>
                <CardDescription>Klicken Sie auf den Button, um die Kamera zu aktivieren und die Kundenkarte zu scannen.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={onStartScan} size="lg" className="w-full h-14 text-lg rounded-full">
                    <Camera className="mr-2 h-6 w-6" />
                    Scan starten
                </Button>
            </CardContent>
        </Card>
    );
}

// Zustand 2: Aktiver Scanner
function ActiveScannerView({ onScanSuccess, onCancel }: { onScanSuccess: (data: string) => void, onCancel: () => void }) {
    const webcamRef = useRef<Webcam>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (typeof window.navigator.vibrate === 'function') {
            window.navigator.vibrate(100);
        }
    }, []);

    const handleMockScan = useCallback(() => {
        if (typeof window.navigator.vibrate === 'function') {
            window.navigator.vibrate(50);
        }
        toast({ title: 'QR Code erkannt, verarbeite...' });

        setTimeout(() => {
            onScanSuccess('user-1-customer');
        }, 1000);
    }, [onScanSuccess, toast]);
    
    return (
        <div className="fixed inset-0 z-50 bg-black flex flex-col text-white">
            <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                 <h2 className="font-bold text-lg drop-shadow-md">Karte scannen</h2>
                <Button variant="ghost" size="icon" onClick={onCancel} className="text-white hover:bg-white/20 hover:text-white rounded-full">
                    <X />
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
                    <div className="w-64 h-64 border-4 border-white/50 rounded-2xl animate-pulse" />
                </div>
            </main>
            <footer className="p-6 bg-gradient-to-t from-black/50 to-transparent">
                 <Button onClick={handleMockScan} className="w-full h-14 text-lg rounded-full" >
                    <QrCode className="mr-2 h-6 w-6" />
                    Code simulieren
                </Button>
            </footer>
        </div>
    );
}

// Zustand 3: Ergebnis des Scans
function ScanResultView({ user, onNextCustomer }: { user: UserType, onNextCustomer: () => void }) {
    const { toast } = useToast();
    const [loyaltyData, setLoyaltyData] = useState(user.loyaltyData);
    const tier = loyaltyData ? getLoyaltyTier(loyaltyData.points) : loyaltyTiers.bronze;

    const handleAddPoints = () => {
        if (!loyaltyData) return;
        const newPoints = loyaltyData.points + 50;
        setLoyaltyData(prev => prev ? { ...prev, points: newPoints } : null);
        toast({ title: 'Punkte hinzugefügt!', description: `${user?.name} hat jetzt ${newPoints} Punkte.` });
        if (typeof window.navigator.vibrate === 'function') {
            window.navigator.vibrate([100, 50, 100]);
        }
    };

    const handleRedeemCoupon = () => {
        if (!loyaltyData || loyaltyData.availableCoupons.length === 0) return;
        setLoyaltyData(prev => prev ? { ...prev, availableCoupons: [] } : null);
        toast({ title: 'Coupon eingelöst!', description: `Ein 5€-Gutschein wurde für ${user?.name} eingelöst.` });
         if (typeof window.navigator.vibrate === 'function') {
            window.navigator.vibrate(100);
        }
    };

    return (
         <Card className="w-full text-center shadow-xl animate-in fade-in-50 border-none">
            <CardHeader className="items-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                 <Avatar className="w-24 h-24 mt-4 border-4 border-white shadow-md">
                    <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <CardTitle className="text-2xl mt-2">{user.name}</CardTitle>
                <Badge variant="outline" className={`border-0 text-sm mt-1 ${tier.color.replace('text-', 'bg-').replace('600', '100')} ${tier.color}`}>
                  <Trophy className="w-3 h-3 mr-1.5" />
                  {tier.name} - {loyaltyData?.points} Punkte
                </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Button onClick={handleAddPoints} className="h-16 text-lg rounded-full">
                    Punkte hinzufügen
                </Button>
                <Button variant="outline" onClick={handleRedeemCoupon} className="h-16 text-lg rounded-full" disabled={!loyaltyData || loyaltyData.availableCoupons.length === 0}>
                    <Gift className="mr-2 h-6 w-6" />
                    Gutschein einlösen
                </Button>
                <Button variant="secondary" onClick={onNextCustomer} className="mt-8 h-12 rounded-full">
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

    const handleScanSuccess = (userId: string) => {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
            setScannedUser(user);
            setViewState('result');
            if (navigator.vibrate) {
                navigator.vibrate(200);
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
    
    const startScanFlow = async () => {
        try {
             if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error("getUserMedia not supported");
            }
            // Permission anfragen (oder Status prüfen)
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop()); // Stream sofort wieder schließen
            setViewState('scanning');
        } catch(err) {
             toast({ variant: 'destructive', title: 'Kamerazugriff verweigert', description: 'Bitte erlauben Sie den Kamerazugriff in Ihren Browser-Einstellungen.' });
        }
    }

    if (viewState === 'scanning') {
        return <ActiveScannerView onScanSuccess={handleScanSuccess} onCancel={resetScanner} />;
    }

    if (viewState === 'result' && scannedUser) {
        return <ScanResultView user={scannedUser} onNextCustomer={resetScanner} />;
    }

    return <ReadyToScanView onStartScan={startScanFlow} />;
}
