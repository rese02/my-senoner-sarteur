
'use client';

import { useState } from 'react';
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Feather } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getSession } from "next-auth/react"; // Assuming you use NextAuth.js
import { mockUsers } from "@/lib/mock-data";

export default function ConciergePage() {
    const [notes, setNotes] = useState('');
    const [address, setAddress] = useState({ street: 'Musterweg 1', city: '39046 St. Ulrich' });
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // In a real app, you'd fetch the user's address from the session/DB
    // useEffect(() => {
    //     const fetchUserData = async () => {
    //         const session = await getSession();
    //         const user = mockUsers.find(u => u.id === session?.userId);
    //         if (user?.deliveryAddress) {
    //             setAddress(user.deliveryAddress);
    //         }
    //     };
    //     fetchUserData();
    // }, []);
    
    const handleSubmit = async () => {
        if (!notes.trim()) {
            toast({ variant: 'destructive', title: 'Ihr Einkaufszettel ist leer.' });
            return;
        }
        setIsLoading(true);

        // Here you would call a server action to create the `grocery_list` order.
        // The server action would get the user from the session.
        // await createGroceryListOrder({ rawList: notes, deliveryAddress: address });
        
        // Simulating API call
        setTimeout(() => {
            toast({
                title: 'Bestellung abgeschickt!',
                description: 'Wir haben Ihren Einkaufszettel erhalten und werden ihn für Sie zusammenstellen.',
            });
            setNotes('');
            setIsLoading(false);
        }, 1500);
    };

    return (
        <>
            <PageHeader title="Concierge Service" description="Ihr persönlicher Einkaufszettel & Lieferservice." />
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Feather className="w-6 h-6 text-primary"/>
                        Ihr digitaler Einkaufszettel
                    </CardTitle>
                    <CardDescription>
                        Schreiben Sie einfach auf, was Sie benötigen. Wir stellen Ihren Einkauf zusammen und bringen ihn morgen gegen 11:00 Uhr zu Ihnen.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="shopping-list">Was darf es sein?</Label>
                        <div className="bg-[#fffdf5] border border-stone-200 rounded-lg p-1 shadow-sm">
                            <Textarea 
                                id="shopping-list"
                                placeholder="- 1L Frische Vollmilch&#10;- 200g Südtiroler Speck&#10;- 1 Laib Brot..." 
                                className="bg-transparent border-none focus-visible:ring-0 text-base leading-loose text-stone-800 placeholder:text-stone-400 min-h-[250px]"
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                     <div className="p-4 bg-secondary rounded-lg space-y-4">
                        <h4 className="font-semibold">Lieferdetails</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="street">Straße & Hausnummer</Label>
                                <Input id="street" value={address.street} onChange={e => setAddress(a => ({...a, street: e.target.value}))} disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">Ort</Label>
                                <Input id="city" value={address.city} onChange={e => setAddress(a => ({...a, city: e.target.value}))} disabled={isLoading} />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground">Die Lieferung erfolgt an die angegebene Adresse. Der Betrag wird Ihrem Kundenkonto zur späteren Bezahlung hinzugefügt.</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSubmit} disabled={isLoading || !notes.trim()} className="w-full" size="lg">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Bestellung an Senoner Team senden
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}
