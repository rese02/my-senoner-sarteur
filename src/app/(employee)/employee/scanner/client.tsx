
'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Gift, Plus, Loader2 } from "lucide-react";
import { redeemPrize, addStamp } from "@/app/actions/loyalty.actions";
import { getCustomerDetails } from '@/app/actions/customer.actions';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';

// This component is now only responsible for displaying scan results and actions.
export function EmployeeScannerClient({ userId }: { userId: string }) {
    const [scannedUser, setScannedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionPending, startActionTransition] = useTransition();
    const { toast } = useToast();
    const router = useRouter();

    // The handleScan function is wrapped in useCallback to stabilize it.
    const handleScan = useCallback(async (id: string) => {
        setIsLoading(true);
        try {
            const { customer } = await getCustomerDetails(id);
            if (!customer) throw new Error("Kunde nicht gefunden");
            setScannedUser(customer);
            toast({ title: "Kunde gefunden!", description: customer.name || customer.email });
        } catch (e: any) {
            toast({ variant: "destructive", title: "Fehler beim Scannen", description: e.message });
            setScannedUser(null);
            router.push('/employee/scanner'); // Go back to menu on error
        } finally {
            setIsLoading(false);
        }
    }, [toast, router]);

    // This effect runs once when the component mounts with a userId.
    useEffect(() => {
        handleScan(userId);
    }, [userId, handleScan]);


    const handleRedeem = async () => {
        if (!scannedUser) return;
        startActionTransition(async () => {
             try {
                await redeemPrize(scannedUser.id);
                setScannedUser({ ...scannedUser, activePrize: undefined });
                toast({ title: "Gewinn eingelöst!", className: "bg-green-600 text-white" });
            } catch (e: any) {
                toast({ variant: "destructive", title: "Fehler beim Einlösen", description: e.message });
            }
        });
    };

    const handleAddStamp = async () => {
        if (!scannedUser) return;
        startActionTransition(async () => {
            try {
                await addStamp(scannedUser.id);
                setScannedUser({ ...scannedUser, loyaltyStamps: (scannedUser.loyaltyStamps || 0) + 1 });
                toast({ title: "Stempel hinzugefügt" });
            } catch (e: any) {
                toast({ variant: "destructive", title: "Fehler", description: e.message });
            }
        });
    };

    const resetAndGoToMenu = () => {
        router.push('/employee/scanner');
    }
    
    if (isLoading) {
         return (
            <div className="flex justify-center items-center p-8 mt-4">
                <Loader2 className="animate-spin h-8 w-8 text-primary"/>
                <p className="ml-4">Lade Kundendetails...</p>
            </div>
        );
    }
    
    if (!scannedUser) {
        // This case should ideally not be seen if error handling pushes back to menu.
        return (
            <div className="text-center text-red-500 mt-4">
                <p>Kunde konnte nicht geladen werden. Bitte versuchen Sie es erneut.</p>
                 <Button onClick={resetAndGoToMenu} variant="link">Zurück zum Menü</Button>
            </div>
        );
    }

    return (
        <Card className="border-2 border-primary/20 animate-in fade-in slide-in-from-bottom-4 mt-4">
            <CardHeader className="pb-2">
                <CardTitle>{scannedUser.name || scannedUser.email}</CardTitle>
                <p className="text-sm text-muted-foreground">Stempel: {scannedUser.loyaltyStamps || 0}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                
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

                <div className="pt-4 border-t">
                    <Button onClick={handleAddStamp} className="w-full h-12 text-lg" variant="outline" disabled={isActionPending}>
                        {isActionPending ? <Loader2 className="animate-spin" /> : <><Plus className="mr-2 h-5 w-5" /> Stempel für Einkauf geben</>}
                    </Button>
                </div>
                
                <Button variant="ghost" onClick={resetAndGoToMenu} className="w-full text-muted-foreground">
                    Zurück zum Menü
                </Button>
            </CardContent>
        </Card>
    );
}
