
'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, QrCode, ListTodo, User, Gift, CheckCircle, XCircle } from "lucide-react";
import { addStamp, redeemPrize } from '@/app/actions/loyalty.actions';
import { getScannerPageData } from '@/app/actions/scanner.actions';
import type { User as UserType } from '@/lib/types';
import { ActiveScannerView } from './_components/ActiveScannerView';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type ViewState = 'main' | 'scanning' | 'result';

function MainView({ onStartScan }: { onStartScan: () => void }) {
    const router = useRouter();
    return (
        <div className="space-y-6">
             <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Mitarbeiter-Menü</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4">
                    <Button onClick={onStartScan} className="h-20 text-lg" variant="default">
                        <QrCode className="mr-4 h-8 w-8"/>
                        Kundenkarte scannen
                    </Button>
                     <Button asChild className="h-20 text-lg" variant="secondary" onClick={() => router.push('/employee/picker')}>
                        <Link href="/employee/picker">
                            <ListTodo className="mr-4 h-8 w-8"/>
                            Einkaufszettel packen
                        </Link>
                    </Button>
                </CardContent>
             </Card>
        </div>
    );
}

function ResultView({ user, onReset }: { user: UserType, onReset: () => void }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleAddStamp = () => {
        startTransition(async () => {
            try {
                // Der Kaufbetrag ist hier symbolisch, da die Aufgabe nur "einen Stempel geben" ist.
                await addStamp(user.id, 10); 
                toast({ title: "Stempel gutgeschrieben!", description: `Ein Stempel wurde für ${user.name} hinzugefügt.` });
                onReset();
            } catch (error: any) {
                toast({ variant: 'destructive', title: 'Fehler', description: error.message });
            }
        });
    };
    
    const handleRedeemPrize = () => {
        if (!user.activePrize) return;
        startTransition(async () => {
             try {
                const result = await redeemPrize(user.id);
                toast({ title: "Gewinn eingelöst!", description: `Gewinn "${result.prize}" für ${user.name} wurde erfolgreich eingelöst.` });
                onReset();
            } catch (error: any) {
                toast({ variant: 'destructive', title: 'Fehler beim Einlösen', description: error.message });
            }
        });
    }

    return (
        <Card className="animate-in fade-in-50">
            <CardHeader className="items-center text-center p-6">
                <div className="p-3 bg-green-100 rounded-full mb-2">
                    <User className="w-8 h-8 text-green-700"/>
                </div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>ID: {user.id.slice(0, 8)}...</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-6 pb-6">
                
                {user.activePrize && (
                    <div className="p-4 border-2 border-dashed border-accent rounded-xl text-center space-y-3 bg-accent/10">
                        <div className="flex items-center justify-center gap-2 font-bold text-accent">
                            <Gift className="w-5 h-5"/>
                            <span>Aktiver Gewinn</span>
                        </div>
                        <p className="text-xl font-bold text-foreground">{user.activePrize}</p>
                         <Button onClick={handleRedeemPrize} disabled={isPending} className="w-full" variant="default" size="sm">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Gewinn jetzt einlösen
                        </Button>
                    </div>
                )}
                
                <Button onClick={handleAddStamp} disabled={isPending} className="w-full h-14 text-base" variant="secondary">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Stempel für Einkauf geben
                </Button>

            </CardContent>
            <CardFooter className="px-6 pb-6 border-t pt-4">
                 <Button variant="ghost" onClick={onReset} className="w-full text-muted-foreground">
                    Abbrechen / Nächster Scan
                </Button>
            </CardFooter>
        </Card>
    );
}


export default function EmployeeScannerPage() {
    const [view, setView] = useState<ViewState>('main');
    const [scannedUser, setScannedUser] = useState<UserType | null>(null);
    const [users, setUsers] = useState<UserType[]>([]);
    const { toast } = useToast();
    
    const refreshData = useCallback(async () => {
        try {
            const data = await getScannerPageData();
            setUsers(data.users);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Benutzerdaten konnten nicht geladen werden.' });
        }
    }, [toast]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const handleScanSuccess = (scannedData: string) => {
        const userId = scannedData.replace('senoner-user:', '');
        const foundUser = users.find(u => u.id === userId);

        if (foundUser) {
            setScannedUser(foundUser);
            setView('result');
        } else {
            toast({ variant: 'destructive', title: 'Fehler', description: 'Kunde nicht gefunden. Daten werden aktualisiert, bitte erneut versuchen.' });
            refreshData(); // Lade die neusten User Daten
            setView('main');
        }
    };
    
    const resetView = () => {
        setScannedUser(null);
        setView('main');
        // Daten für den nächsten Scan im Hintergrund neu laden
        refreshData();
    };

    if (view === 'scanning') {
        return <ActiveScannerView onScanSuccess={handleScanSuccess} onCancel={resetView} />;
    }
    
    if (view === 'result' && scannedUser) {
        return <ResultView user={scannedUser} onReset={resetView} />;
    }

    return <MainView onStartScan={() => setView('scanning')} />;
}
