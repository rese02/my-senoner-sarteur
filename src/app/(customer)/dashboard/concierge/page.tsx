'use client';

import { useState, useTransition } from 'react';
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Feather } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { createConciergeOrder } from '@/app/actions/order.actions';

export default function ConciergePage() {
    const [notes, setNotes] = useState('');
    const [address, setAddress] = useState({ street: 'Musterweg 1', city: '39046 St. Ulrich' });
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    
    const handleSubmit = async () => {
        if (!notes.trim()) {
            toast({ variant: 'destructive', title: 'Ihr Einkaufszettel ist leer.' });
            return;
        }

        startTransition(async () => {
            try {
                await createConciergeOrder(notes, address);
                toast({
                    title: 'Bestellung abgeschickt!',
                    description: 'Wir haben Ihren Einkaufszettel erhalten und werden ihn für Sie zusammenstellen.',
                });
                setNotes('');
            } catch (error) {
                console.error(error);
                toast({ variant: 'destructive', title: 'Fehler', description: 'Ihre Bestellung konnte nicht gesendet werden.' });
            }
        });
    };

    return (
        <>
            <PageHeader title="Concierge Service" description="Ihr persönlicher Einkaufszettel & Lieferservice." />
            
            <Card className="shadow-lg border-none max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Feather className="w-5 h-5 text-primary"/>
                        Ihr digitaler Einkaufszettel
                    </CardTitle>
                    <CardDescription>
                        Schreiben Sie einfach auf, was Sie benötigen. Wir stellen es zusammen und bringen es morgen gegen 11:00 Uhr.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="shopping-list">Was darf es sein?</Label>
                        <div className="bg-[#fffdf5] border border-stone-200 rounded-lg p-1 shadow-inner">
                            <Textarea 
                                id="shopping-list"
                                placeholder="- 1L Frische Vollmilch&#10;- 200g Südtiroler Speck&#10;- 1 Laib Brot..." 
                                className="bg-transparent border-none focus-visible:ring-0 text-sm leading-relaxed text-stone-800 placeholder:text-stone-400 min-h-[200px]"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                disabled={isPending}
                            />
                        </div>
                    </div>
                     <div className="p-3 bg-secondary rounded-lg space-y-3 border">
                        <h4 className="font-semibold text-sm">Lieferdetails</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="street">Straße & Hausnummer</Label>
                                <Input id="street" value={address.street} onChange={e => setAddress(a => ({...a, street: e.target.value}))} disabled={isPending} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="city">Ort</Label>
                                <Input id="city" value={address.city} onChange={e => setAddress(a => ({...a, city: e.target.value}))} disabled={isPending} />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Der Betrag wird Ihrem Kundenkonto zur späteren Bezahlung hinzugefügt.</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit} disabled={isPending || !notes.trim()} className="w-full" size="lg">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Bestellung an Senoner Team senden
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}
