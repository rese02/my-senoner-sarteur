
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShoppingCart, Users, Info, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/hooks/use-cart-store';
import { PageHeader } from '@/components/common/PageHeader';
import type { PlannerEvent, Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { getPlannerPageData } from '@/app/actions/marketing.actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';

function EventSelectionGrid({ events, onSelect, selectedEvent }: { events: PlannerEvent[], onSelect: (event: PlannerEvent) => void, selectedEvent: PlannerEvent | null }) {
    if (events.length === 0) {
        return (
            <Card className="text-center py-12 text-muted-foreground border-dashed">
                <p>Keine Planer-Events verfügbar.</p>
            </Card>
        );
    }
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event) => (
                <div 
                    key={event.id}
                    onClick={() => onSelect(event)}
                    className={cn(
                        "rounded-2xl overflow-hidden cursor-pointer group relative transition-all duration-300 ease-in-out border-4 shadow-sm hover:shadow-lg",
                        selectedEvent?.id === event.id ? "border-primary shadow-xl scale-105" : "border-transparent"
                    )}
                >
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors z-10"></div>
                    <div className="relative aspect-video w-full">
                        <Image 
                            src={event.imageUrl} 
                            alt={event.title} 
                            fill 
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 ease-in-out scale-105 group-hover:scale-110"
                            data-ai-hint={event.imageHint}
                        />
                    </div>
                    <div className="absolute z-20 bottom-4 left-4 text-white">
                        <h3 className="font-headline text-xl font-bold drop-shadow-md leading-tight">{event.title}</h3>
                        <p className="text-xs opacity-80 drop-shadow">{event.description}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

function PlannerSkeleton() {
    return (
        <div className="w-full space-y-8">
            <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-5 w-80" />
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <Skeleton className="h-48 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
        </div>
    )
}

export default function PartyPlannerPage() {
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<PlannerEvent | null>(null);
  const [people, setPeople] = useState(4);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const addToCart = useCartStore(state => state.addToCart); 


  useEffect(() => {
    setLoading(true);
    getPlannerPageData()
        .then(data => {
            setEvents(data.plannerEvents);
            setProducts(data.products);
            if (data.plannerEvents.length > 0) {
                setSelectedEvent(data.plannerEvents[0]);
            }
        })
        .catch(err => toast({ variant: 'destructive', title: 'Fehler', description: 'Daten konnten nicht geladen werden.'}))
        .finally(() => setLoading(false));
  }, [toast]);

  const handleAddToCart = () => {
    if (!selectedEvent) return;

    selectedEvent.ingredients.forEach(ingredient => {
        const product = products.find(p => p.id === ingredient.productId);
        if (product) {
            const totalAmount = ingredient.baseAmount * people;
            const pricePerGram = product.unit === 'kg' ? product.price / 1000 : product.price;
            const price = ingredient.unit === 'g' ? totalAmount * pricePerGram : totalAmount * product.price;

            addToCart({ 
                productId: `${product.id}-${people}`,
                name: `${product.name} (für ${people} Pers.)`, 
                quantity: 1,
                price: price
            });
        }
    });
    
    toast({
      title: "Hinzugefügt!",
      description: `Zutaten für "${selectedEvent.title}" für ${people} Personen im Warenkorb.`,
    });
  };

  if (loading) {
    return <PlannerSkeleton />;
  }

  return (
    <div className="w-full space-y-8">
      <div>
          <PageHeader title="Party Planer" description="Wählen Sie ein Event und wir berechnen die perfekte Menge für Ihre Gäste." />
      </div>
      
       <EventSelectionGrid events={events} onSelect={setSelectedEvent} selectedEvent={selectedEvent} />
      
      {selectedEvent && (
        <Card className="shadow-xl animate-in fade-in-50 overflow-hidden">
            <CardHeader className="p-4">
                <CardTitle className="text-xl font-headline">Mengenrechner für "{selectedEvent.title}"</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
                <div className="space-y-2">
                    <Label>Wie viele Gäste erwarten Sie?</Label>
                    <div className="flex items-center justify-between gap-4 bg-secondary p-2 rounded-xl border">
                        <div className="flex items-center gap-2">
                            <Users className="w-6 h-6 text-primary" />
                            <span className="text-3xl font-bold font-headline text-primary">{people}</span>
                        </div>
                         <Slider
                            defaultValue={[people]}
                            max={30}
                            min={1}
                            step={1}
                            onValueChange={(value) => setPeople(value[0])}
                            className="w-full max-w-xs"
                        />
                    </div>
                </div>
            
            
                <div className="bg-secondary/50 p-4 rounded-xl border w-full max-w-full overflow-hidden">
                    <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-3 flex items-center gap-2">
                        <Info size={14}/> Empfehlung für {people} Personen:
                    </h3>
                    <ul className="space-y-3 w-full">
                        {selectedEvent.ingredients.map((ing, idx) => {
                        const totalAmount = ing.baseAmount * people;
                        return (
                            <li key={idx} className="block sm:flex sm:justify-between sm:items-center border-b last:border-0 pb-2 last:pb-0 w-full">
                                <span className="text-sm font-medium text-card-foreground break-words pr-0 sm:pr-4">
                                    {ing.productName}
                                </span>
                                <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded text-xs mt-1 sm:mt-0 inline-block whitespace-nowrap">
                                    {totalAmount.toLocaleString('de-DE')} {ing.unit}
                                </span>
                            </li>
                        );
                        })}
                    </ul>
                </div>
            </CardContent>
            <CardFooter className="p-4 bg-secondary/50 border-t">
                <Button onClick={handleAddToCart} className="w-full h-12 text-base" size="lg">
                    <ShoppingCart className="mr-2 w-5 h-5" />
                    Gesamtpaket in den Warenkorb
                </Button>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
