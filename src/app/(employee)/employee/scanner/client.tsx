'use client';

import { useState, useTransition } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { QrCode, ClipboardList, Gift, Plus, Loader2 } from "lucide-react";
import { getCustomerDetails, redeemPrize, addStamp } from "@/app/actions/loyalty.actions";
import Link from 'next/link';
import type { Order, User } from '@/lib/types';

export function EmployeeScannerClient({ initialOrders }: { initialOrders: Order[] }) {
    const [scannedUser, setScannedUser] = useState<User | null>(null);
    const [manualId, setManualId] = useState("");
    const [isSearching, startSearchTransition] = useTransition();
    const [isActionPending, startActionTransition] = useTransition();
    const { toast } = useToast();

    // 1. Kunde suchen (via Scan oder Hand-Eingabe)
    const handleScan = async (userId: string) => {
        if (!userId) return;
        startSearchTransition(async () => {
            try {
                const user = await getCustomerDetails(userId);
                setScannedUser(user);
                toast({ title: "Kunde gefunden!", description: user.name || user.email });
            } catch (e) {
                toast({ variant: "destructive", title: "Nicht gefunden", description: "Falsche ID oder kein Kunde." });
                setScannedUser(null);
            }
        });
    };

    // 2. Gewinn einlösen
    const handleRedeem = async () => {
        if (!scannedUser) return;
        startActionTransition(async () => {
             try {
                await redeemPrize(scannedUser.id);
                // Lokal updaten damit der Button verschwindet
                setScannedUser({ ...scannedUser, activePrize: undefined });
                toast({ title: "Gewinn eingelöst!", className: "bg-green-600 text-white" });
            } catch (e) {
                toast({ variant: "destructive", title: "Fehler beim Einlösen" });
            }
        });
    };

    // 3. Stempel geben
    const handleAddStamp = async () => {
        if (!scannedUser) return;
        startActionTransition(async () => {
            try {
                await addStamp(scannedUser.id);
                // Lokal updaten
                setScannedUser({ ...scannedUser, loyaltyStamps: (scannedUser.loyaltyStamps || 0) + 1 });
                toast({ title: "Stempel hinzugefügt" });
            } catch (e) {
                toast({ variant: "destructive", title: "Fehler" });
            }
        });
    };

    const resetAll = () => {
        setScannedUser(null);
        setManualId("");
    }

    return (
        <div className="w-full">
            <h1 className="text-xl font-bold mb-4">Mitarbeiter Cockpit</h1>

            <Tabs defaultValue="scanner">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="scanner"><QrCode className="mr-2 h-4 w-4"/> Scanner</TabsTrigger>
                    <TabsTrigger value="lists"><ClipboardList className="mr-2 h-4 w-4"/> Listen ({initialOrders.length})</TabsTrigger>
                </TabsList>

                {/* --- TAB 1: SCANNER & KUNDEN --- */}
                <TabsContent value="scanner" className="space-y-4 mt-4">
                    
                     <Link href="/employee/scanner/scan" className="w-full">
                        <Button className="w-full h-20 text-lg">
                           <QrCode className="mr-4 h-8 w-8"/> Echten Code Scannen
                        </Button>
                     </Link>

                    {/* Manuelle Eingabe */}
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Kunden-ID manuell eingeben..." 
                            value={manualId}
                            onChange={e => setManualId(e.target.value)}
                        />
                        <Button onClick={() => handleScan(manualId)} disabled={isSearching || !manualId}>
                            {isSearching ? <Loader2 className="animate-spin" /> : "Suchen" }
                        </Button>
                    </div>

                    {/* KUNDEN ANSICHT (Wenn gefunden) */}
                    {scannedUser && (
                        <Card className="border-2 border-primary/20 animate-in fade-in slide-in-from-bottom-4">
                            <CardHeader className="pb-2">
                                <CardTitle>{scannedUser.name || scannedUser.email}</CardTitle>
                                <CardDescription>Stempel: {scannedUser.loyaltyStamps || 0}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                
                                {/* A. GEWINN ANZEIGE (Nur wenn einer da ist!) */}
                                {scannedUser.activePrize ? (
                                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg flex flex-col gap-3">
                                        <div className="flex items-center gap-2 text-yellow-800 font-bold">
                                            <Gift className="h-5 w-5" />
                                            <span>Gewinn verfügbar:</span>
                                        </div>
                                        <div className="text-xl text-center font-black text-yellow-900">
                                            {scannedUser.activePrize}
                                        </div>
                                        <Button onClick={handleRedeem} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black" disabled={isActionPending}>
                                            {isActionPending ? <Loader2 className="animate-spin" /> : 'Jetzt anwenden (Einlösen)'}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="text-center text-sm text-gray-400 py-2 border rounded-lg border-dashed">
                                        Kein offener Gewinn
                                    </div>
                                )}

                                {/* B. AKTIONEN */}
                                <div className="pt-4 border-t">
                                    <Button onClick={handleAddStamp} className="w-full h-12 text-lg" variant="outline" disabled={isActionPending}>
                                        {isActionPending ? <Loader2 className="animate-spin" /> : <><Plus className="mr-2 h-5 w-5" /> 1 Stempel geben</>}
                                    </Button>
                                </div>
                                
                                <Button variant="ghost" onClick={resetAll} className="w-full text-muted-foreground">
                                    Nächster Kunde
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>


                {/* --- TAB 2: EINKAUFSLISTEN --- */}
                <TabsContent value="lists" className="mt-4">
                    {initialOrders.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Keine offenen Listen.</p>
                    ) : (
                         <div className="space-y-2">
                            {initialOrders.map(order => (
                                <Link key={order.id} href="/employee/picker">
                                    <button className="w-full text-left p-3 rounded-xl border bg-card hover:bg-secondary transition-colors flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-sm">{order.customerName}</p>
                                            <p className="text-xs text-muted-foreground">{order.rawList?.split('\n').length} Artikel</p>
                                        </div>
                                        <ClipboardList className="text-primary"/>
                                    </button>
                                </Link>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
