
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ShoppingCart, Users, Info, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/hooks/use-cart-store';
import { PageHeader } from '@/components/common/PageHeader';
import { mockPlannerEvents, mockProducts } from '@/lib/mock-data';
import type { PlannerEvent } from '@/lib/types';
import { cn } from '@/lib/utils';

function EventSelectionCard({ event, onSelect, isSelected }: { event: PlannerEvent, onSelect: (event: PlannerEvent) => void, isSelected: boolean }) {
    return (
        <div 
            onClick={() => onSelect(event)}
            className={cn(
                "rounded-2xl overflow-hidden cursor-pointer group relative transition-all duration-300 ease-in-out border-4 h-40",
                isSelected ? "border-primary shadow-2xl" : "border-transparent hover:shadow-lg"
            )}
        >
            <div className={cn("absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors z-10", isSelected && "bg-black/30")}></div>
            <Image 
                src={event.imageUrl} 
                alt={event.title} 
                fill 
                sizes="(max-width: 768px) 100vw, 50vw" 
                className={cn("object-cover transition-transform duration-500 ease-in-out", isSelected ? "scale-110" : "scale-100 group-hover:scale-105")}
                data-ai-hint={event.imageHint}
            />
            <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center p-4">
                <h3 className="font-headline text-3xl font-bold drop-shadow-md">{event.title}</h3>
                <p className="text-sm drop-shadow-sm">{event.description}</p>
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
    <div className="space-y-8 pb-24 md:pb-8 overflow-x-hidden">
      <PageHeader title="Party Planer" description="Wählen Sie ein Event und wir berechnen die perfekte Menge für Ihre Gäste." />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <EventSelectionCard 
                key={ev.id}
                event={ev}
                onSelect={setSelectedEvent}
                isSelected={selectedEvent?.id === ev.id}
            />
          ))}
      </div>


      {selectedEvent && (
        <Card className="border-none shadow-lg animate-in fade-in-50">
            <CardHeader>
                <CardTitle className="text-2xl font-headline">Mengenrechner für "{selectedEvent.title}"</CardTitle>
                <CardDescription>Wie viele Gäste erwarten Sie?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            
            <div className="flex justify-between items-center bg-secondary p-4 rounded-xl border">
                <Users className="w-8 h-8 text-primary" />
                <div className="text-4xl font-headline text-primary font-bold">
                    {people}
                </div>
            </div>

            <Slider
                value={[people]}
                onValueChange={(val) => setPeople(val[0])}
                min={1}
                max={30}
                step={1}
                className="py-4"
            />
            
            <div className="bg-background p-4 rounded-xl border-2 border-dashed w-full max-w-full overflow-hidden">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-3 flex items-center gap-2">
                    <Info size={14}/> Unsere Empfehlung für {people} Personen:
                </h3>
                <ul className="space-y-3 w-full">
                    {selectedEvent.ingredients.map((ing, idx) => {
                    const totalAmount = ing.baseAmount * people;
                    return (
                        <li key={idx} className="block sm:flex sm:justify-between sm:items-center border-b last:border-0 pb-2 last:pb-0">
                          <span className="text-sm sm:text-base font-medium break-words text-card-foreground">
                            {ing.productName}
                          </span>
                          <span className="font-bold text-primary bg-primary/10 px-2 py-1 rounded text-sm whitespace-nowrap self-start sm:self-auto mt-1 sm:mt-0">
                            {totalAmount.toLocaleString('de-DE')} {ing.unit}
                          </span>
                        </li>
                    );
                    })}
                </ul>
            </div>

            <Button onClick={handleAddToCart} className="w-full h-14 text-lg" size="lg">
                <ShoppingCart className="mr-2 w-5 h-5" />
                Gesamtpaket in den Warenkorb
            </Button>

            </CardContent>
        </Card>
      )}
    </div>
  );
}
