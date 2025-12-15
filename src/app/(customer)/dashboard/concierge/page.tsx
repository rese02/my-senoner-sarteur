'use client';

import { useState, useTransition } from 'react';
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Feather, Truck } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { createConciergeOrder } from '@/app/actions/order.actions';

export default function ConciergePage() {
    const [notes, setNotes] = useState('');
    const [address, setAddress] = useState({ street: '', city: '' });
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    
    const handleSubmit = async () => {
        if (!notes.trim()) {
            toast({ variant: 'destructive', title: 'Ihr Einkaufszettel ist leer.' });
            return;
        }
        if (!address.street.trim() || !address.city.trim()) {
            toast({ variant: 'destructive', title: 'Lieferadresse unvollständig.' });
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
                setAddress({ street: '', city: '' });
            } catch (error) {
                console.error(error);
                toast({ variant: 'destructive', title: 'Fehler', description: 'Ihre Bestellung konnte nicht gesendet werden.' });
            }
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Concierge Service" description="Ihr persönlicher Einkaufszettel & Lieferservice." />
            
            <Card>
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
                        <Textarea 
                            id="shopping-list"
                            placeholder="- 1L Frische Vollmilch&#10;- 200g Südtiroler Speck&#10;- 1 Laib Brot..." 
                            className="bg-secondary/50 min-h-[200px]"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            disabled={isPending}
                        />
                    </div>
                    <div className="space-y-4">
                        <h4 className="font-semibold text-sm">Lieferdetails</h4>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                           <Truck className="w-5 h-5 text-primary shrink-0" />
                           <div>
                                <p>Wir liefern nur nach <strong>Wolkenstein</strong> und <strong>St. Christina</strong>.</p>
                                <p>Die Liefergebühr beträgt pauschal <strong>5,00 €</strong>.</p>
                           </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="street">Straße & Hausnummer</Label>
                                <Input id="street" value={address.street} onChange={e => setAddress(a => ({...a, street: e.target.value}))} disabled={isPending} placeholder="Ihre Straße" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="city">Ort</Label>
                                <Input id="city" value={address.city} onChange={e => setAddress(a => ({...a, city: e.target.value}))} disabled={isPending} placeholder="Ihr Ort" />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Die Gesamtsumme inkl. Liefergebühr wird Ihrem Kundenkonto zur späteren Bezahlung hinzugefügt.</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit} disabled={isPending || !notes.trim()} className="w-full" size="lg">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Bestellung an Senoner Team senden
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
