
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
import { DatePicker } from '@/components/custom/DatePicker';
import { add, isBefore } from 'date-fns';

export default function ConciergePage() {
    const [notes, setNotes] = useState('');
    const [address, setAddress] = useState({ street: '', city: '' });
    const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(() => add(new Date(), { days: 1 }));
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
        if (!deliveryDate) {
            toast({ variant: 'destructive', title: 'Lieferdatum fehlt.' });
            return;
        }
        if (isBefore(deliveryDate, new Date())) {
            toast({ variant: 'destructive', title: 'Das Lieferdatum darf nicht in der Vergangenheit liegen.' });
            return;
        }


        startTransition(async () => {
            try {
                await createConciergeOrder(notes, address, deliveryDate);
                toast({
                    title: 'Bestellung abgeschickt!',
                    description: 'Wir haben Ihren Einkaufszettel erhalten und werden ihn für Sie zusammenstellen.',
                });
                setNotes('');
                setAddress({ street: '', city: '' });
                setDeliveryDate(add(new Date(), {days: 1}));
            } catch (error) {
                console.error(error);
                toast({ variant: 'destructive', title: 'Fehler', description: 'Ihre Bestellung konnte nicht gesendet werden.' });
            }
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader title="Concierge Service" description="Ihr persönlicher Einkaufszettel & Lieferservice." />
            
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Feather className="w-5 h-5 text-primary"/>
                        Ihr digitaler Einkaufszettel
                    </CardTitle>
                    <CardDescription>
                        Schreiben Sie einfach auf, was Sie benötigen. Wir stellen es zusammen und bringen es zum gewünschten Zeitpunkt.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                           <Truck className="w-5 h-5 text-primary shrink-0" /> Lieferdetails
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <Label htmlFor="delivery-date">Gewünschter Liefertag</Label>
                                <DatePicker date={deliveryDate} setDate={setDeliveryDate} />
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="street">Straße & Hausnummer</Label>
                                    <Input id="street" value={address.street} onChange={e => setAddress(a => ({...a, street: e.target.value}))} disabled={isPending} placeholder="Ihre Straße" />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="city">Ort</Label>
                                    <Input id="city" value={address.city} onChange={e => setAddress(a => ({...a, city: e.target.value}))} disabled={isPending} placeholder="Ihr Ort" />
                                </div>
                            </div>
                        </div>
                         <p className="text-xs text-muted-foreground">Wir liefern nur nach <strong>Wolkenstein</strong> und <strong>St. Christina</strong>. Die Liefergebühr beträgt pauschal <strong>5,00 €</strong>. Die Gesamtsumme wird Ihrem Kundenkonto zur späteren Bezahlung hinzugefügt.</p>
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
