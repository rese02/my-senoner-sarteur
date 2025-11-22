'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, CheckCircle, Gift, Loader2, QrCode, X, ListTodo, Check, Trophy } from 'lucide-react';
import { mockUsers, mockOrders } from '@/lib/mock-data';
import type { User as UserType, Order, ChecklistItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials, cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { getLoyaltyTier, loyaltyTiers } from '@/lib/loyalty';
import Webcam from 'react-webcam';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// =================================================================
// Zustand 1: Hauptansicht (mit Tabs)
// =================================================================
function MainView({ onStartScan, onStartPicking }: { onStartScan: () => void, onStartPicking: (order: Order) => void }) {
    const newGroceryLists = mockOrders.filter(o => o.type === 'grocery_list' && o.status === 'new');
    
    return (
        <Tabs defaultValue="scanner" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14">
                <TabsTrigger value="scanner" className="h-12 text-base">QR Scanner</TabsTrigger>
                <TabsTrigger value="lists" className="h-12 text-base relative">
                    Einkaufszettel
                    {newGroceryLists.length > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{newGroceryLists.length}</Badge>}
                </TabsTrigger>
            </TabsList>

            {/* Tab 1: QR Code Scanner */}
            <TabsContent value="scanner">
                <Card className="text-center shadow-xl border-none mt-6">
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
            </TabsContent>
            
            {/* Tab 2: Einkaufszettel */}
            <TabsContent value="lists">
                 <Card className="shadow-xl border-none mt-6">
                    <CardHeader>
                         <CardTitle>Offene Einkaufszettel</CardTitle>
                         <CardDescription>Wählen Sie eine Liste, um mit dem Packen zu beginnen.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {newGroceryLists.length === 0 ? (
                            <div className="text-muted-foreground text-center py-8">
                                <ListTodo className="mx-auto h-12 w-12 text-gray-300" />
                                <p className="mt-4">Keine neuen Einkaufszettel vorhanden.</p>
                            </div>
                        ) : (
                            newGroceryLists.map(order => (
                                <button key={order.id} onClick={() => onStartPicking(order)} className="w-full text-left p-4 rounded-lg border bg-card hover:bg-secondary transition-colors flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{order.customerName}</p>
                                        <p className="text-sm text-muted-foreground">{order.rawList?.split('\n').length} Artikel</p>
                                    </div>
                                    <ListTodo className="text-primary"/>
                                </button>
                            ))
                        )}
                    </CardContent>
                 </Card>
            </TabsContent>
        </Tabs>
    );
}


// =================================================================
// Zustand 2: Aktiver Scanner
// =================================================================
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

// =================================================================
// Zustand 3: Scan Ergebnis
// =================================================================
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
                <Badge variant="outline" className={`border-0 text-sm mt-1 bg-blue-100 text-blue-800`}>
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
                    Zurück zum Menü
                </Button>
            </CardContent>
        </Card>
    );
}

// =================================================================
// Zustand 4: Picker Mode
// =================================================================
function PickerModeView({ order, onFinish }: { order: Order, onFinish: () => void }) {
    const initialChecklist = order.rawList?.split('\n').map(item => ({ item: item.trim(), isFound: false })).filter(i => i.item) || [];
    const [checklist, setChecklist] = useState<ChecklistItem[]>(initialChecklist);
    const [finalPrice, setFinalPrice] = useState('');
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        // In a real app, update order status to 'picking' in Firestore here
        console.log(`Started picking for order ${order.id}`);
        if (navigator.vibrate) navigator.vibrate(100);
    }, [order.id]);

    const toggleItem = (index: number) => {
        setChecklist(prev => {
            const newChecklist = [...prev];
            newChecklist[index].isFound = !newChecklist[index].isFound;
            return newChecklist;
        });
        if (navigator.vibrate) navigator.vibrate(50);
    };
    
    const handleFinish = () => {
         if (!finalPrice || parseFloat(finalPrice) <= 0) {
            toast({ variant: 'destructive', title: 'Ungültiger Preis', description: 'Bitte geben Sie eine gültige Endsumme ein.' });
            return;
        }
        setIsSaving(true);
        
        // In a real app, update order in Firestore with status 'ready_for_delivery', finalPrice, and checklist
        console.log(`Finished picking for order ${order.id}. Final price: ${finalPrice}`);

        setTimeout(() => {
            // Mock server action
            const orderIndex = mockOrders.findIndex(o => o.id === order.id);
            if (orderIndex !== -1) {
                mockOrders[orderIndex].status = 'ready_for_delivery';
                mockOrders[orderIndex].total = parseFloat(finalPrice);
                mockOrders[orderIndex].checklist = checklist;
                mockOrders[orderIndex].processedBy = 'user-2-employee'; // Mock employee
            }
            
            toast({ title: 'Einkauf abgeschlossen!', description: `Die Endsumme von €${finalPrice} wurde gespeichert.` });
            setIsSaving(false);
            onFinish();
        }, 1000);
    }

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
            <header className="p-4 border-b flex justify-between items-center bg-card sticky top-0">
                 <div>
                    <h2 className="font-bold text-lg">Einkauf für {order.customerName}</h2>
                    <p className="text-sm text-muted-foreground">Haken Sie die gefundenen Artikel ab.</p>
                 </div>
                <Button variant="ghost" size="icon" onClick={onFinish} className="rounded-full">
                    <X />
                </Button>
            </header>
            <main className="flex-grow overflow-y-auto pb-40">
                {checklist.map((entry, index) => (
                    <div 
                        key={index} 
                        onClick={() => toggleItem(index)}
                        className={cn("p-4 border-b flex items-center gap-4 cursor-pointer transition-colors", entry.isFound ? 'bg-green-50 text-muted-foreground' : 'bg-card hover:bg-secondary/50')}
                    >
                        <div className={cn("w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all", entry.isFound ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground")}>
                           {entry.isFound && <Check className="w-4 h-4" />}
                        </div>
                        <span className={cn("text-lg flex-1", entry.isFound && 'line-through')}>{entry.item}</span>
                    </div>
                ))}
            </main>
            <footer className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t shadow-lg grid gap-2 animate-in slide-in-from-bottom-10">
                 <Label htmlFor="final-price">Endsumme (€)</Label>
                 <div className="flex gap-2">
                    <Input 
                        id="final-price"
                        type="number" 
                        className="text-2xl h-14" 
                        placeholder="0.00" 
                        value={finalPrice}
                        onChange={(e) => setFinalPrice(e.target.value)}
                    />
                    <Button onClick={handleFinish} disabled={isSaving || !finalPrice || parseFloat(finalPrice) <= 0} className="h-14 px-6 text-lg">
                        {isSaving ? <Loader2 className="animate-spin"/> : 'Fertig'}
                    </Button>
                 </div>
            </footer>
        </div>
    )
}

// =================================================================
// Hauptkomponente
// =================================================================
export default function ScannerPage() {
    type ViewState = 'main' | 'scanning' | 'result' | 'picking';
    const [viewState, setViewState] = useState<ViewState>('main');
    const [scannedUser, setScannedUser] = useState<UserType | null>(null);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const { toast } = useToast();

    const handleScanSuccess = (userId: string) => {
        const user = mockUsers.find(u => u.id === userId);
        if (user) {
            setScannedUser(user);
            setViewState('result');
            if (navigator.vibrate) navigator.vibrate(200);
        } else {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Kunde nicht gefunden.' });
            setViewState('main');
        }
    };
    
    const handleStartPicking = (order: Order) => {
        setCurrentOrder(order);
        setViewState('picking');
    }

    const resetToMain = () => {
        setViewState('main');
        setScannedUser(null);
        setCurrentOrder(null);
    };
    
    const startScanFlow = async () => {
        try {
             if (!navigator.mediaDevices?.getUserMedia) {
                throw new Error("getUserMedia not supported");
            }
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            setViewState('scanning');
        } catch(err) {
             toast({ variant: 'destructive', title: 'Kamerazugriff verweigert', description: 'Bitte erlauben Sie den Kamerazugriff in Ihren Browser-Einstellungen.' });
        }
    }

    if (viewState === 'scanning') {
        return <ActiveScannerView onScanSuccess={handleScanSuccess} onCancel={resetToMain} />;
    }

    if (viewState === 'result' && scannedUser) {
        return <ScanResultView user={scannedUser} onNextCustomer={resetToMain} />;
    }

    if (viewState === 'picking' && currentOrder) {
        return <PickerModeView order={currentOrder} onFinish={resetToMain} />
    }

    return <MainView onStartScan={startScanFlow} onStartPicking={handleStartPicking}/>;
}

    
