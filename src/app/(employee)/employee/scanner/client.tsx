
'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Gift, Plus, Loader2 } from "lucide-react";
import { getCustomerDetails, redeemPrize, addStamp } from "@/app/actions/loyalty.actions";
import type { User } from '@/lib/types';
import { useSearchParams, useRouter } from 'next/navigation';

// Diese Komponente wird jetzt nur noch getriggert, wenn ein Scan erfolgt ist.
export function EmployeeScannerClient() {
    const [scannedUser, setScannedUser] = useState<User | null>(null);
    const [isSearching, startSearchTransition] = useTransition();
    const [isActionPending, startActionTransition] = useTransition();
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleScan = useCallback(async (userId: string) => {
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
    // Wir übergeben router, damit der ESLint zufrieden ist
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [toast]);

    useEffect(() => {
        const scannedUserId = searchParams.get('userId');
        if (scannedUserId) {
            handleScan(scannedUserId);
            // URL bereinigen, nachdem der Scan verarbeitet wurde, um Loops zu vermeiden
            router.replace('/employee/scanner', { scroll: false });
        }
    }, [searchParams, handleScan, router]);

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
        // Zurück zum Menü, da die Scan-Seite jetzt separat ist
        router.push('/employee/scanner');
    }
    
    if (isSearching) {
         return (
            <div className="flex justify-center items-center p-8 mt-4">
                <Loader2 className="animate-spin h-8 w-8 text-primary"/>
            </div>
        );
    }
    
    if (!scannedUser) {
        // Nichts anzeigen, wenn kein User gescannt wurde. Die Hauptseite zeigt die Menü-Optionen.
        return null;
    }

    return (
        <Card className="border-2 border-primary/20 animate-in fade-in slide-in-from-bottom-4 mt-4">
            <CardHeader className="pb-2">
                <CardTitle>{scannedUser.name || scannedUser.email}</CardTitle>
                <p className="text-sm text-muted-foreground">Stempel: {scannedUser.loyaltyStamps || 0}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                
                {/* A. GEWINN ANZEIGE */}
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
                    Zurück zum Menü
                </Button>
            </CardContent>
        </Card>
    );
}
