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
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function ConciergePage() {
    const { t } = useLanguage();
    const [notes, setNotes] = useState('');
    const [address, setAddress] = useState({ street: '', city: '' });
    const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(() => add(new Date(), { days: 1 }));
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    
    const handleSubmit = async () => {
        if (!notes.trim()) {
            toast({ variant: 'destructive', title: t.concierge.toast.listEmpty });
            return;
        }
        if (!address.street.trim() || !address.city.trim()) {
            toast({ variant: 'destructive', title: t.concierge.toast.addressIncomplete });
            return;
        }
        if (!deliveryDate) {
            toast({ variant: 'destructive', title: t.concierge.toast.dateMissing });
            return;
        }
        if (isBefore(deliveryDate, new Date())) {
            toast({ variant: 'destructive', title: t.concierge.toast.datePast });
            return;
        }


        startTransition(async () => {
            try {
                await createConciergeOrder(notes, address, deliveryDate);
                toast({
                    title: t.concierge.toast.successTitle,
                    description: t.concierge.toast.successDescription,
                });
                setNotes('');
                setAddress({ street: '', city: '' });
                setDeliveryDate(add(new Date(), {days: 1}));
            } catch (error) {
                console.error(error);
                toast({ variant: 'destructive', title: t.concierge.toast.errorTitle, description: t.concierge.toast.errorDescription });
            }
        });
    };

    return (
        <div className="space-y-6">
            <PageHeader title={t.concierge.title} description={t.concierge.description} />
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Feather className="w-5 h-5 text-primary"/>
                        {t.concierge.listTitle}
                    </CardTitle>
                    <CardDescription>
                        {t.concierge.listDescription}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-1.5">
                        <Label htmlFor="shopping-list">{t.concierge.whatYouNeed}</Label>
                        <Textarea 
                            id="shopping-list"
                            placeholder={t.concierge.listPlaceholder}
                            className="bg-secondary/50 min-h-[200px]"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            disabled={isPending}
                        />
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                           <Truck className="w-5 h-5 text-primary shrink-0" /> {t.concierge.deliveryDetails}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <Label htmlFor="delivery-date">{t.concierge.deliveryDate}</Label>
                                <DatePicker date={deliveryDate} setDate={setDeliveryDate} />
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="street">{t.concierge.street}</Label>
                                    <Input id="street" value={address.street} onChange={e => setAddress(a => ({...a, street: e.target.value}))} disabled={isPending} placeholder={t.concierge.streetPlaceholder} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="city">{t.concierge.city}</Label>
                                    <Input id="city" value={address.city} onChange={e => setAddress(a => ({...a, city: e.target.value}))} disabled={isPending} placeholder={t.concierge.cityPlaceholder} />
                                </div>
                            </div>
                        </div>
                         <p className="text-xs text-muted-foreground">{t.concierge.deliveryInfo}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit} disabled={isPending || !notes.trim()} className="w-full" size="lg">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {t.concierge.submitButton}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
