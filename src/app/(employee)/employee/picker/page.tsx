
'use client';

import { useState, useTransition, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ListTodo, Check } from 'lucide-react';
import type { Order, ChecklistItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { setGroceryOrderTotal } from '@/app/actions/order.actions';
import { getScannerPageData } from '@/app/actions/scanner.actions';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';


// =================================================================
// Main View to show open lists
// =================================================================
function GroceryListsView({ onStartPicking, groceryLists }: { onStartPicking: (order: Order) => void, groceryLists: Order[] }) {
    
    return (
        <Card className="shadow-lg border-none mt-4">
            <CardHeader>
                    <CardTitle>Offene Einkaufszettel</CardTitle>
                    <CardDescription>Wählen Sie eine Liste zum Packen aus. Diese Ansicht ist identisch mit der des Admin-Bereichs.</CardDescription>
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
    );
}

// =================================================================
// Picker Mode View
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
                    <Alert variant="destructive" className="bg-destructive/10">
                        <AlertDescription className="text-destructive font-bold">
                            ⚠️ Betrag muss separat in die Kasse eingetippt und ein offizieller Kassenbon gedruckt werden!
                        </AlertDescription>
                    </Alert>
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

function LoadingSkeleton() {
    return (
        <div className="space-y-4 w-full">
             <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-5 w-full max-w-md" />
            </div>
            <Card className="w-full">
                <CardHeader>
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-72" />
                </CardHeader>
                 <CardContent className="space-y-2">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                 </CardContent>
            </Card>
        </div>
    )
}

// =================================================================
// Main Component
// =================================================================
export default function EmployeePickerPage() {
    type ViewState = 'main' | 'picking';
    const [viewState, setViewState] = useState<ViewState>('main');
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [groceryLists, setGroceryLists] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    const refreshData = useCallback(async () => {
        setLoading(true);
        try {
            // We only need the grocery lists from this action
            const { groceryLists } = await getScannerPageData();
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

    const handleStartPicking = (order: Order) => {
        setCurrentOrder(order);
        setViewState('picking');
    }

    const resetToMain = () => {
        setCurrentOrder(null);
        setViewState('main');
    };

    if (loading) {
        return <LoadingSkeleton />;
    }
    
    if (viewState === 'picking' && currentOrder) {
        return (
            <div className="w-full">
                 <PickerModeView order={currentOrder} onFinish={resetToMain} />
            </div>
        )
    }

    return (
        <div className="space-y-6 w-full">
             <Button asChild variant="outline" className="mb-4">
                <Link href="/employee/scanner">Zurück zum Menü</Link>
            </Button>
            <div>
                <GroceryListsView onStartPicking={handleStartPicking} groceryLists={groceryLists} />
            </div>
        </div>
    )
}
