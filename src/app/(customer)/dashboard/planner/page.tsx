
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Info, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/hooks/use-cart-store';
import { PageHeader } from '@/components/common/PageHeader';
import { mockPlannerEvents, mockProducts } from '@/lib/mock-data';
import type { PlannerEvent } from '@/lib/types';


export default function PartyPlannerPage() {
  const [events, setEvents] = useState<PlannerEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<PlannerEvent | null>(null);
  const [people, setPeople] = useState(4);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const addToCart = useCartStore(state => state.addToCart); 


  // 1. Daten laden (aus mock-data.ts)
  useEffect(() => {
    // Simulating a fetch from a database
    setEvents(mockPlannerEvents);
    if (mockPlannerEvents.length > 0) {
      setSelectedEvent(mockPlannerEvents[0]);
    }
    setLoading(false);
  }, []);

  const handleAddToCart = () => {
    if (!selectedEvent) return;

    // Logik: Gehe durch alle Ingredients des selectedEvent
    // Menge = ingredient.baseAmount * people
    // AddToCart(ingredient.productId, Menge)
    
    selectedEvent.ingredients.forEach(ingredient => {
        const product = mockProducts.find(p => p.id === ingredient.productId);
        if (product) {
            const totalAmount = ingredient.baseAmount * people;
            // The price calculation needs to be smart.
            // Example: if product unit is 'kg' and baseAmount is in 'g', we need conversion.
            // This is a simplified example assuming price is per base unit.
            // A real implementation would need a price-per-unit/gram logic.
            const calculatedPrice = (totalAmount / (product.unit === 'kg' ? 1000 : 1)) * product.price;

            addToCart({ 
                productId: `${product.id}-${people}`, // Make ID unique per configuration
                name: `${product.name} (für ${people} Pers.)`, 
                quantity: 1, // We add the calculated amount as one item
                price: calculatedPrice
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
      <PageHeader title="Party Planer" description="Planen Sie die perfekte Menge für Ihre Gäste." />

      {/* 1. Event Selection */}
       <div className="w-full">
        <div className="flex space-x-4 pb-4 overflow-x-auto scrollbar-hide">
          {events.map((ev) => (
            <button
              key={ev.id}
              onClick={() => setSelectedEvent(ev)}
              className={`snap-center shrink-0 w-48 h-32 rounded-xl relative overflow-hidden border-4 cursor-pointer transition-all duration-300 ${
                selectedEvent?.id === ev.id ? 'border-primary ring-4 ring-primary/20 scale-105' : 'border-transparent opacity-75 hover:opacity-100'
              }`}
            >
              <Image src={ev.imageUrl} fill sizes="200px" className="object-cover" alt={ev.title} data-ai-hint={ev.imageHint}/>
              <div className="absolute bottom-0 bg-black/60 w-full p-2 text-white text-sm font-bold truncate">
                {ev.title}
              </div>
            </button>
          ))}
        </div>
      </div>


      {/* 2. The Calculator */}
      {selectedEvent && (
        <Card className="border-none shadow-lg animate-in fade-in-50">
            <CardContent className="p-4 sm:p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                <h2 className="text-xl font-bold text-primary">{selectedEvent.title}</h2>
                <p className="text-sm text-muted-foreground">Wie viele Gäste erwarten Sie?</p>
                </div>
                <div className="text-4xl font-headline text-primary font-bold mt-2 sm:mt-0">
                {people} <span className="text-base font-body text-muted-foreground font-normal">Pers.</span>
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

            {/* Result Box */}
            <div className="bg-secondary p-5 rounded-xl border">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-bold mb-3 flex items-center gap-2">
                    <Info size={14}/> Unsere Empfehlung für {people} Personen:
                </h3>
                <ul className="space-y-3">
                    {selectedEvent.ingredients.map((ing, idx) => {
                    const totalAmount = ing.baseAmount * people;
                    return (
                        <li key={idx} className="flex justify-between items-center text-card-foreground text-lg">
                        <span>{ing.productName}</span>
                        <span className="font-bold text-primary">
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
