'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, Gift, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { mockUsers, mockLoyaltyData } from '@/lib/mock-data';
import type { User, LoyaltyData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

function QrScanner({ onScan, isScanning }: { onScan: () => void, isScanning: boolean }) {
  return (
    <div 
      className="flex flex-col items-center justify-center gap-4 p-8 border-2 border-dashed rounded-lg w-full max-w-md cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
      onClick={onScan}
    >
      <Camera className="w-24 h-24 text-muted-foreground" />
      <Button variant="ghost" className="text-lg" disabled={isScanning}>
        {isScanning ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
        {isScanning ? 'Scanning...' : 'Tap to Scan Customer Code'}
      </Button>
      <p className="text-sm text-muted-foreground">Point the camera at the customer's QR code</p>
    </div>
  );
}

export default function ScannerPage() {
    const [isScanning, setIsScanning] = useState(false);
    const [scannedUser, setScannedUser] = useState<User | null>(null);
    const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { toast } = useToast();

    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => {
            // Simulate scanning a random user with loyalty data
            const targetUser = mockUsers.find(u => u.id === 'user-1-customer');
            const targetLoyalty = mockLoyaltyData.find(l => l.userId === 'user-1-customer');
            
            if (targetUser && targetLoyalty) {
                setScannedUser(targetUser);
                setLoyaltyData({...targetLoyalty}); // Create a copy to allow state updates
                setIsModalOpen(true);
            } else {
                 toast({ variant: 'destructive', title: 'Scan Failed', description: 'Customer not found.'});
            }
            setIsScanning(false);
        }, 1500);
    };

    const handleAddStamp = () => {
        if (!loyaltyData) return;
        setLoyaltyData(prev => prev ? { ...prev, stamps: prev.stamps + 1 } : null);
        toast({ title: 'Stamp Added!', description: `${scannedUser?.name} now has ${loyaltyData.stamps + 1} stamps.` });
    };

    const handleRedeemCoupon = () => {
        if (!loyaltyData) return;
        setLoyaltyData(prev => prev ? { ...prev, availableCoupons: [] } : null);
        toast({ title: 'Coupon Redeemed!', description: `A €5 coupon was redeemed for ${scannedUser?.name}.` });
    };

  return (
    <Card className="w-full max-w-2xl text-center shadow-xl">
        <CardHeader>
            <CardTitle className="text-3xl">Point of Sale Scanner</CardTitle>
            <CardDescription>Scan customer cards to award stamps or redeem coupons.</CardDescription>
        </CardHeader>
        <CardContent>
            <QrScanner onScan={handleScan} isScanning={isScanning} />
        </CardContent>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl text-center">Scan Successful</DialogTitle>
                    <div className="text-center pt-4">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <p className="text-xl font-bold mt-2">{scannedUser?.name}</p>
                        <p className="text-muted-foreground">Current Stamps: {loyaltyData?.stamps}</p>
                    </div>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-4 py-4">
                    <Button size="lg" onClick={handleAddStamp}>Add Stamp (Purchase &gt; €20)</Button>
                    <Button size="lg" variant="outline" onClick={handleRedeemCoupon} disabled={!loyaltyData?.availableCoupons || loyaltyData.availableCoupons.length === 0}>
                        <Gift className="mr-2 h-4 w-4" /> Redeem Coupon
                    </Button>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="w-full" variant="secondary">Scan Next Customer</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Card>
  );
}
