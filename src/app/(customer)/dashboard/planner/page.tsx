'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ShoppingCart, Users, Info, Loader2, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/hooks/use-cart-store';
import { PageHeader } from '@/components/common/PageHeader';
import type { PlannerEvent, Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { getPlannerPageData } from '@/app/actions/marketing.actions';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

function EventSelectionCarousel({ events, onSelect, selectedEvent }: { events: PlannerEvent[], onSelect: (event: PlannerEvent) => void, selectedEvent: PlannerEvent | null }) {
    return (
        <Carousel opts={{
            align: "start",
            loop: false,
        }} 
        className="w-full"
        >
            <CarouselContent className="-ml-2 md:-ml-4">
                {events.map((event) => (
                     <CarouselItem key={event.id} className="pl-2 md:pl-4 basis-2/3 md:basis-1/3 lg:basis-1/4">
                        <div 
                            onClick={() => onSelect(event)}
                            className={cn(
                                "h-28 rounded-2xl overflow-hidden cursor-pointer group relative transition-all duration-300 ease-in-out border-4",
                                selectedEvent?.id === event.id ? "border-primary shadow-2xl" : "border-transparent hover:shadow-lg"
                            )}
                        >
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors z-10"></div>
                            <Image 
                                src={event.imageUrl} 
                                alt={event.title} 
                                fill 
                                sizes="(max-width: 768px) 66vw, 33vw"
                                className="object-cover transition-transform duration-500 ease-in-out scale-105 group-hover:scale-110"
                                data-ai-hint={event.imageHint}
                            />
                            <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center p-2">
                                <h3 className="font-headline text-xl font-bold drop-shadow-md leading-tight">{event.title}</h3>
                            </div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
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
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="w-full space-y-8 pb-24 md:pb-8">
      <div>
          <PageHeader title="Party Planer" description="Wählen Sie ein Event und wir berechnen die perfekte Menge für Ihre Gäste." />
      </div>
      
       <EventSelectionCarousel events={events} onSelect={setSelectedEvent} selectedEvent={selectedEvent} />
      
      {selectedEvent && (
        <div>
            <Card className="border-none shadow-xl animate-in fade-in-50 overflow-hidden">
                <CardHeader className="p-4">
                    <CardTitle className="text-xl font-headline">Mengenrechner für "{selectedEvent.title}"</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-6">
                    <div className="space-y-2">
                        <Label>Wie viele Gäste erwarten Sie?</Label>
                        <div className="flex items-center justify-between gap-4 bg-secondary p-2 rounded-xl border">
                            <Button variant="outline" size="icon" onClick={() => setPeople(p => Math.max(1, p - 1))} className="w-12 h-12 rounded-lg bg-background">
                                <Minus className="w-5 h-5"/>
                            </Button>
                            <div className="flex items-center gap-2">
                                <Users className="w-6 h-6 text-primary" />
                                <span className="text-3xl font-bold font-headline text-primary">{people}</span>
                            </div>
                            <Button variant="outline" size="icon" onClick={() => setPeople(p => p + 1)} className="w-12 h-12 rounded-lg bg-background">
                                <Plus className="w-5 h-5"/>
                            </Button>
                        </div>
                    </div>
                
                
                    <div className="bg-background p-4 rounded-xl border w-full max-w-full overflow-hidden">
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
        </div>
      )}
    </div>
  );
}
