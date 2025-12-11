'use client';

import { useState, useRef, useEffect, useCallback, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Gift, Loader2, QrCode, X, ListTodo, Check, Package, Star } from 'lucide-react';
import type { User as UserType, Order, ChecklistItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Webcam from 'react-webcam';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { addStamp, redeemReward, redeemPrize } from '@/app/actions/loyalty.actions';
import { setGroceryOrderTotal } from '@/app/actions/order.actions';
import { getScannerPageData } from '@/app/actions/scanner.actions';


// =================================================================
// Zustand 1: Hauptansicht (mit Tabs)
// =================================================================
function MainView({ onStartScan, onStartPicking, groceryLists }: { onStartScan: () => void, onStartPicking: (order: Order) => void, groceryLists: Order[] }) {
    
    return (
        <Tabs defaultValue="scanner" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="scanner" className="h-10 text-base">QR Scanner</TabsTrigger>
                <TabsTrigger value="lists" className="h-10 text-base relative">
                    Einkaufszettel
                    {groceryLists.length > 0 && <Badge className="absolute -top-1 -right-1 h-5 w-5 justify-center p-0">{groceryLists.length}</Badge>}
                </TabsTrigger>
            </TabsList>

            <TabsContent value="scanner">
                <Card className="text-center shadow-lg border-none mt-4">
                    <CardHeader>
                        <div className="mx-auto bg-primary/10 text-primary rounded-full h-20 w-20 flex items-center justify-center mb-4">
                            <QrCode className="w-10 h-10" />
                        </div>
                        <CardTitle className="text-2xl">Bereit zum Scannen</CardTitle>
                        <CardDescription>Kamera aktivieren, um Kundenkarte zu scannen.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={onStartScan} size="lg" className="w-full h-12 text-lg rounded-full">
                            <Camera className="mr-2 h-5 w-5" />
                            Scan starten
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="lists">
                 <Card className="shadow-lg border-none mt-4">
                    <CardHeader>
                         <CardTitle>Offene Einkaufszettel</CardTitle>
                         <CardDescription>Wählen Sie eine Liste zum Packen.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {groceryLists.length === 0 ? (
                            <div className="text-muted-foreground text-center py-8">
                                <ListTodo className="mx-auto h-10 w-10 text-gray-300" />
                                <p className="mt-2 text-sm">Keine neuen Einkaufszettel.</p>
                            </div>
                        ) : (
                            groceryLists.map(order => (
                                <button key={order.id} onClick={() => onStartPicking(order)} className="w-full text-left p-3 rounded-xl border bg-card hover:bg-secondary transition-colors flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-sm">{order.customerName}</p>
                                        <p className="text-xs text-muted-foreground">{order.rawList?.split('\n').length} Artikel</p>
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
                    Code simulieren
                </Button>
            </footer>
        </div>
    );
}

// =================================================================
// Zustand 3: Scan Ergebnis - Stempelsystem & Kontext-Bestellungen
// =================================================================
function ScanResultView({ user, orders, onNextCustomer }: { user: UserType, orders: Order[], onNextCustomer: () => void }) {
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  
  const stamps = user.loyaltyStamps || 0;
  const canRedeemSmall = stamps >= 5;
  const canRedeemBig = stamps >= 10;
  const openOrders = orders.filter(o => ['new', 'ready', 'picking', 'ready_for_delivery'].includes(o.status));
  const activePrize = user.activePrize;


  const handleAddStamp = async () => {
    if (!purchaseAmount || parseFloat(purchaseAmount) < 15) {
      toast({ variant: 'destructive', title: "Mindesteinkauf 15€!"}); 
      return;
    }
    startTransition(async () => {
        try {
          await addStamp(user.id, parseFloat(purchaseAmount));
          toast({ title: "Stempel vergeben!" });
          onNextCustomer(); 
        } catch(e: any) {
            toast({ variant: 'destructive', title: "Fehler", description: e.message });
        }
    });
  };

  const handleRedeem = async (tier: 'small' | 'big') => {
    const discount = tier === 'big' ? '7€' : '3€';
    if(!confirm(`Kunde möchte ${discount} Rabatt nutzen?`)) return;
    
    startTransition(async () => {
        try {
          await redeemReward(user.id, tier);
          toast({ title: "Rabatt angewendet!", description: `Bitte ${discount} vom Endpreis abziehen.`});
          onNextCustomer(); 
        } catch(e: any) {
            toast({ variant: 'destructive', title: "Fehler", description: e.message });
        }
    });
  };

  const handleRedeemPrize = async () => {
      if (!activePrize) return;
      if(!confirm(`Kunde möchte "${activePrize}" einlösen?`)) return;
      
      startTransition(async () => {
          try {
              await redeemPrize(user.id);
              toast({ title: "Gewinn eingelöst!", description: `"${activePrize}" wurde angewendet.` });
              onNextCustomer();
          } catch(e: any) {
              toast({ variant: 'destructive', title: "Fehler", description: e.message });
          }
      });
  };

  return (
    <div className="w-full space-y-4 animate-in fade-in-50">
        <Card className="w-full p-4 text-center shadow-lg border-none">
            <h2 className="text-xl font-bold font-headline">{user.name}</h2>
            <div className="text-5xl font-bold text-primary my-1">
                {stamps} <span className="text-lg text-muted-foreground font-normal">Stempel</span>
            </div>
        </Card>

        {activePrize && (
             <Card className="w-full p-4 shadow-lg border-2 border-dashed border-accent bg-accent/10">
                <h3 className="font-bold text-accent-foreground text-sm uppercase flex items-center gap-2 mb-2"><Star className="w-4 h-4" />Aktiver Gewinn</h3>
                <div className="flex justify-between items-center">
                    <p className="text-lg font-bold text-foreground">{activePrize}</p>
                    <Button onClick={handleRedeemPrize} disabled={isPending} size="sm">Einlösen</Button>
                </div>
            </Card>
        )}

        {openOrders.length > 0 && (
            <Card className="w-full p-4 shadow-lg border-none">
                <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><Package className="w-4 h-4 text-primary"/> Offene Vorbestellungen</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                    {openOrders.map(order => (
                        <p key={order.id} className="border-b last:border-0 py-1">
                            Bestellung #{order.id.slice(-6)} - Status: <Badge variant="secondary">{order.status}</Badge>
                        </p>
                    ))}
                </div>
            </Card>
        )}

        {(canRedeemSmall || canRedeemBig) && (
            <Card className="w-full p-4 shadow-lg border-none bg-accent/10 border-accent/30">
            <h3 className="font-bold text-accent-foreground text-sm uppercase flex items-center gap-2 mb-2"><Gift className="w-4 h-4" />Belohnung verfügbar!</h3>
            
            <div className="grid grid-cols-2 gap-2">
                <Button 
                onClick={() => handleRedeem('small')}
                disabled={!canRedeemSmall || isPending}
                variant="outline"
                className="border-primary/50 text-primary bg-background hover:bg-primary/5 h-auto flex flex-col py-2"
                >
                <span className="font-bold text-base">3€ Rabatt</span>
                <span className="text-xs font-normal">(5 Stempel)</span>
                </Button>

                <Button 
                onClick={() => handleRedeem('big')}
                disabled={!canRedeemBig || isPending}
                className="h-auto flex flex-col py-2"
                >
                <span className="font-bold text-base">7€ Rabatt</span>
                <span className="text-xs font-normal">(10 Stempel)</span>
                </Button>
            </div>
            </Card>
        )}

        <Card className="w-full p-4 shadow-lg border-none">
            <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground">Neuer Einkaufswert (€)</Label>
                <div className="flex gap-2">
                <Input 
                    type="number" 
                    placeholder="0.00" 
                    className="text-lg h-12" 
                    value={purchaseAmount}
                    onChange={e => setPurchaseAmount(e.target.value)}
                    disabled={isPending}
                />
                <Button 
                    onClick={handleAddStamp} 
                    disabled={isPending || !purchaseAmount || parseFloat(purchaseAmount) < 15}
                    className="w-2/5 h-12"
                >
                    {isPending ? <Loader2 className="animate-spin" /> : '+1 Stempel'}
                </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                1 Stempel pro Einkauf ab 15,00€
                </p>
            </div>
        </Card>

        <Button variant="secondary" onClick={onNextCustomer} className="w-full">
                Schließen &amp; Nächster Kunde
        </Button>
    </div>
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
    const [isPending, startTransition] = useTransition();
    
    useEffect(() => {
        if (navigator.vibrate) navigator.vibrate(100);
    }, []);

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
        startTransition(async () => {
            try {
                await setGroceryOrderTotal(order.id, parseFloat(finalPrice), checklist);
                toast({ title: 'Einkauf abgeschlossen!', description: `Die Endsumme von €${finalPrice} wurde gespeichert.` });
                onFinish();
            } catch (error) {
                 toast({ variant: 'destructive', title: 'Fehler', description: 'Konnte die Bestellung nicht abschließen.' });
            }
        });
    }

    return (
        <div className="w-full space-y-4 animate-in fade-in-50">
            <Card className="w-full shadow-lg border-none">
                <CardHeader>
                    <CardTitle>Einkauf für {order.customerName}</CardTitle>
                    <CardDescription>Gefundene Artikel abhaken.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-1">
                        {checklist.map((entry, index) => (
                            <div 
                                key={index} 
                                onClick={() => toggleItem(index)}
                                className={cn(
                                    "p-3 border rounded-xl flex items-center gap-3 cursor-pointer transition-all duration-200", 
                                    entry.isFound 
                                        ? 'bg-green-50 border-green-200 text-muted-foreground' 
                                        : 'bg-card hover:bg-secondary/50'
                                )}
                            >
                                <div className={cn(
                                    "w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0", 
                                    entry.isFound 
                                        ? "bg-primary border-primary text-primary-foreground" 
                                        : "border-muted-foreground/50 bg-background"
                                )}>
                                   {entry.isFound && <Check className="w-4 h-4" />}
                                </div>
                                <span className={cn(
                                    "text-base flex-1 transition-opacity", 
                                    entry.isFound && 'line-through opacity-60'
                                )}>
                                    {entry.item}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex-col items-stretch space-y-3 pt-4 border-t bg-secondary/50">
                     <Label htmlFor="final-price" className="text-sm font-semibold">Endsumme (€)</Label>
                     <div className="flex gap-2">
                        <Input 
                            id="final-price"
                            type="number" 
                            className="text-2xl font-bold h-14 bg-background" 
                            placeholder="0.00" 
                            value={finalPrice}
                            onChange={(e) => setFinalPrice(e.target.value)}
                        />
                        <Button onClick={handleFinish} disabled={isPending || !finalPrice || parseFloat(finalPrice) <= 0} className="h-14 px-6 text-base">
                            {isPending ? <Loader2 className="animate-spin"/> : 'Fertig'}
                        </Button>
                     </div>
                </CardFooter>
            </Card>
             <Button variant="outline" onClick={onFinish} className="w-full">
                Abbrechen und zurück
            </Button>
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
    
    const [users, setUsers] = useState<UserType[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [groceryLists, setGroceryLists] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        setLoading(true);
        try {
            const { users, orders, groceryLists } = await getScannerPageData();
            setUsers(users);
            setOrders(orders);
            setGroceryLists(groceryLists);
        } catch(err) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Daten konnten nicht geladen werden.'});
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        if (viewState === 'main') {
            refreshData();
        }
    }, [viewState, refreshData]);


    const handleScanSuccess = (scanData: string) => {
        const prefix = "senoner-user:";
        if (!scanData.startsWith(prefix)) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Ungültiger QR Code.' });
            resetToMain();
            return;
        }
        const userId = scanData.substring(prefix.length);
        const user = users.find(u => u.id === userId);

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

    if (loading && viewState === 'main') {
         return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (viewState === 'scanning') {
        return <ActiveScannerView onScanSuccess={handleScanSuccess} onCancel={resetToMain} />;
    }

    if (viewState === 'result' && scannedUser) {
        const userOrders = orders.filter(o => o.userId === scannedUser.id);
        return <ScanResultView user={scannedUser} orders={userOrders} onNextCustomer={resetToMain} />;
    }



    if (viewState === 'picking' && currentOrder) {
        return <PickerModeView order={currentOrder} onFinish={resetToMain} />
    }

    return <MainView onStartScan={startScanFlow} onStartPicking={handleStartPicking} groceryLists={groceryLists} />;
}
