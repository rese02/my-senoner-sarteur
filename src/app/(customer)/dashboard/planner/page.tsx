'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ShoppingCart, Users, Info, Loader2, Minus, Plus } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/hooks/use-cart-store';
import { PageHeader } from '@/components/common/PageHeader';
import { mockPlannerEvents, mockProducts } from '@/lib/mock-data';
import type { PlannerEvent } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';

function EventSelectionCarousel({ events, onSelect, selectedEvent }: { events: PlannerEvent[], onSelect: (event: PlannerEvent) => void, selectedEvent: PlannerEvent | null }) {
    return (
        <div className="w-full">
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {events.map((event) => (
                    <div 
                        key={event.id}
                        onClick={() => onSelect(event)}
                        className={cn(
                            "flex-shrink-0 w-48 h-28 rounded-2xl overflow-hidden cursor-pointer group relative transition-all duration-300 ease-in-out border-4",
                             selectedEvent?.id === event.id ? "border-primary shadow-2xl" : "border-transparent hover:shadow-lg"
                        )}
                    >
                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors z-10"></div>
                        <Image 
                            src={event.imageUrl} 
                            alt={event.title} 
                            fill 
                            sizes="200px" 
                            className="object-cover transition-transform duration-500 ease-in-out scale-105 group-hover:scale-110"
                            data-ai-hint={event.imageHint}
                        />
                        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center p-2">
                            <h3 className="font-headline text-xl font-bold drop-shadow-md leading-tight">{event.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function PartyPlannerPage() {
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<PlannerEvent | null>(null);
  const [people, setPeople] = useState(4);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const addToCart = useCartStore(state => state.addToCart); 


  useEffect(() => {
    setEvents(mockPlannerEvents);
    if (mockPlannerEvents.length > 0) {
      setSelectedEvent(mockPlannerEvents[0]);
    }
    setLoading(false);
  }, []);

  const handleAddToCart = () => {
    if (!selectedEvent) return;

    selectedEvent.ingredients.forEach(ingredient => {
        const product = mockProducts.find(p => p.id === ingredient.productId);
        if (product) {
            const totalAmount = ingredient.baseAmount * people;
            const pricePerGram = product.unit === 'kg' ? product.price / 1000 : product.price; // assuming 'g' or 'stück' otherwise
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
    <div className="space-y-8 pb-24 md:pb-8">
      <PageHeader title="Party Planer" description="Wählen Sie ein Event und wir berechnen die perfekte Menge für Ihre Gäste." />
      
       <EventSelectionCarousel events={events} onSelect={setSelectedEvent} selectedEvent={selectedEvent} />
      

      {selectedEvent && (
        <Card className="border-none shadow-xl animate-in fade-in-50 overflow-hidden">
            <CardHeader className="bg-secondary/50">
                <CardTitle className="text-xl font-headline">Mengenrechner für "{selectedEvent.title}"</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-6">
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
                           <li key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b last:border-0 pb-2 last:pb-0 w-full">
                                <span className="text-sm font-medium text-card-foreground break-words pr-0 sm:pr-4">
                                    {ing.productName}
                                </span>
                                <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded text-xs self-start sm:self-auto mt-1 sm:mt-0 whitespace-nowrap">
                                    {totalAmount.toLocaleString('de-DE')} {ing.unit}
                                </span>
                            </li>
                        );
                        })}
                    </ul>
                </div>
            </CardContent>
            <CardFooter className="p-4 md:p-6 bg-secondary/50 border-t">
                <Button onClick={handleAddToCart} className="w-full h-14 text-lg" size="lg">
                    <ShoppingCart className="mr-2 w-5 h-5" />
                    Gesamtpaket in den Warenkorb
                </Button>
            </CardFooter>
        </Card>
      )}
    </div>
  );
}
