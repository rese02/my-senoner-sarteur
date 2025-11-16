'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, Gift, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { mockUsers, mockLoyaltyData } from '@/lib/mock-data';
import type { User, LoyaltyData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

function QrScanner({ videoRef, hasCameraPermission }: { videoRef: React.RefObject<HTMLVideoElement>, hasCameraPermission: boolean }) {
  return (
    <div className="w-full max-w-md mx-auto">
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted border">
             <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
             {/* Overlay for scanning animation */}
             {!hasCameraPermission &&
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white p-4">
                    <Camera className="w-16 h-16 mb-4 text-muted-foreground" />
                    <p className="font-semibold text-lg">Kamera nicht verfügbar</p>
                    <p className="text-sm text-center">Bitte erlauben Sie den Kamerazugriff in Ihren Browser-Einstellungen.</p>
                </div>
             }
        </div>
    </div>
  );
}

export default function ScannerPage() {
    const [isScanning, setIsScanning] = useState(false);
    const [scannedUser, setScannedUser] = useState<User | null>(null);
    const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error("getUserMedia not supported");
            }
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
          }
        };
    
        getCameraPermission();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        }
      }, []);

    const handleScan = () => {
        if (!hasCameraPermission) {
            toast({ variant: 'destructive', title: 'Kamera nicht bereit', description: 'Bitte erlauben Sie den Kamerazugriff.' });
            return;
        }
        setIsScanning(true);
        toast({ title: 'Suche nach QR Code...' });

        // This would be replaced with a real QR code scanning library (e.g., html5-qrcode)
        // For now, we simulate a successful scan after 2 seconds.
        setTimeout(() => {
            const targetUser = mockUsers.find(u => u.id === 'user-1-customer');
            const targetLoyalty = mockLoyaltyData.find(l => l.userId === 'user-1-customer');
            
            if (targetUser && targetLoyalty) {
                setScannedUser(targetUser);
                setLoyaltyData({...targetLoyalty}); // Create a copy to allow state updates
                setIsModalOpen(true);
            } else {
                 toast({ variant: 'destructive', title: 'Scan Fehlgeschlagen', description: 'Kunde nicht gefunden.'});
            }
            setIsScanning(false);
        }, 2000);
    };

    const handleAddStamp = () => {
        if (!loyaltyData) return;
        setLoyaltyData(prev => prev ? { ...prev, stamps: prev.stamps + 1 } : null);
        toast({ title: 'Stempel hinzugefügt!', description: `${scannedUser?.name} hat jetzt ${loyaltyData.stamps + 1} Stempel.` });
    };

    const handleRedeemCoupon = () => {
        if (!loyaltyData || loyaltyData.availableCoupons.length === 0) return;
        setLoyaltyData(prev => prev ? { ...prev, availableCoupons: [] } : null);
        toast({ title: 'Coupon eingelöst!', description: `Ein 5€-Gutschein wurde für ${scannedUser?.name} eingelöst.` });
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setScannedUser(null);
        setLoyaltyData(null);
    }

  return (
    <Card className="w-full max-w-2xl text-center shadow-xl">
        <CardHeader>
            <CardTitle className="text-3xl">Point of Sale Scanner</CardTitle>
            <CardDescription>Scannen Sie Kundenkarten, um Stempel zu vergeben oder Gutscheine einzulösen.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
            <QrScanner videoRef={videoRef} hasCameraPermission={!!hasCameraPermission} />
             {hasCameraPermission === false && (
                <Alert variant="destructive" className="text-left">
                    <Camera className="h-4 w-4" />
                    <AlertTitle>Kamerazugriff erforderlich</AlertTitle>
                    <AlertDescription>
                        Bitte erlauben Sie den Kamerazugriff in Ihren Browser-Einstellungen, um diese Funktion zu nutzen.
                    </AlertDescription>
                </Alert>
            )}
            <Button size="lg" onClick={handleScan} disabled={isScanning || !hasCameraPermission}>
                {isScanning ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Camera className="mr-2 h-5 w-5" />}
                {isScanning ? 'Scanne...' : 'Kundenkarte scannen'}
            </Button>
        </CardContent>

        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">Scan Erfolgreich</DialogTitle>
                    <div className="text-center pt-4">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <p className="text-xl font-bold mt-2">{scannedUser?.name}</p>
                        <p className="text-muted-foreground">Aktuelle Stempel: {loyaltyData?.stamps}</p>
                    </div>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                    <Button size="lg" onClick={handleAddStamp}>Stempel hinzufügen (Kauf > 20€)</Button>
                    <Button size="lg" variant="outline" onClick={handleRedeemCoupon} disabled={!loyaltyData?.availableCoupons || loyaltyData.availableCoupons.length === 0}>
                        <Gift className="mr-2 h-4 w-4" /> Gutschein einlösen
                    </Button>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="w-full" variant="secondary">Nächsten Kunden scannen</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Card>
  );
}
