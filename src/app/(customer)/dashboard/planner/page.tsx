
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Info } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useCartStore } from '@/hooks/use-cart-store';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { PageHeader } from '@/components/common/PageHeader';

// Hardcoded logic for the Party Planner
const EVENTS = [
  {
    id: 'raclette',
    name: 'Raclette Abend',
    description: 'Der Klassiker für gemütliche Abende.',
    image: PlaceHolderImages.find(p => p.id === 'event-raclette')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'event-raclette')?.imageHint || 'raclette cheese',
    baseAmountPerPerson: 250, // Gramm
    unit: 'g',
    productName: 'Regionale Käseplatte',
    productId: 'prod-4', // Hard-linked to the existing cheese platter product
    pricePer100g: 12.50 / 4, // Assuming the 12.50 plate is ~400g
  },
  {
    id: 'fondue',
    name: 'Grillfest',
    description: 'Feinstes Fleisch für den besonderen Anlass.',
    image: PlaceHolderImages.find(p => p.id === 'event-fondue')?.imageUrl || '',
    imageHint: PlaceHolderImages.find(p => p.id === 'event-fondue')?.imageHint || 'fondue meat',
    baseAmountPerPerson: 300, // Gramm Fleisch
    unit: 'g',
    productName: 'Südtiroler Speck',
    productId: 'prod-5', // Hard-linked to the existing speck product
    pricePer100g: 22.00 / 10, // Price for 1kg is 22, so per 100g it's 2.20
  }
];

export default function PartyPlannerPage() {
  const [people, setPeople] = useState(4);
  const [selectedEvent, setSelectedEvent] = useState(EVENTS[0]);
  const { toast } = useToast();
  const addToCart = useCartStore(state => state.addToCart); 

  // Calculation
  const totalAmount = people * selectedEvent.baseAmountPerPerson;
  const estimatedPrice = (totalAmount / 100) * selectedEvent.pricePer100g;

  const handleAddToCart = () => {
    addToCart({ 
        productId: `${selectedEvent.productId}-${people}`, // Make ID unique per configuration
        name: `${selectedEvent.productName} für ${people}`, 
        quantity: 1, // We add it as one package item
        price: estimatedPrice // The calculated price
    });
    
    toast({
      title: "Hinzugefügt!",
      description: `${totalAmount}${selectedEvent.unit} ${selectedEvent.productName} im Warenkorb.`,
    });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 pb-24">
      <PageHeader title="Party Planer" description="Planen Sie die perfekte Menge für Ihre Gäste." />

      {/* 1. Event Selection */}
      <div className="grid grid-cols-2 gap-4">
        {EVENTS.map((ev) => (
          <div
            key={ev.id}
            onClick={() => setSelectedEvent(ev)}
            className={`relative h-32 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
              selectedEvent.id === ev.id ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'
            }`}
          >
             <Image 
                src={ev.image} 
                alt={ev.name} 
                fill 
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
                data-ai-hint={ev.imageHint}
             />
            <div className="absolute inset-0 bg-black/40 flex items-end p-3">
              <span className="text-white font-bold">{ev.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 2. The Calculator */}
      <Card className="border-none shadow-lg">
        <CardContent className="p-6 space-y-8">
          
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-primary">{selectedEvent.name}</h2>
              <p className="text-sm text-muted-foreground">Wie viele Gäste erwarten Sie?</p>
            </div>
            <div className="text-4xl font-headline text-primary font-bold">
              {people} <span className="text-base font-body text-muted-foreground font-normal">Pers.</span>
            </div>
          </div>

          <Slider
            value={[people]}
            onValueChange={(val) => setPeople(val[0])}
            min={2}
            max={20}
            step={1}
            className="py-4"
          />

          {/* Result Box */}
          <div className="bg-secondary p-5 rounded-xl border space-y-4">
            <div className="flex items-start gap-3">
              <Info className="text-primary w-5 h-5 mt-0.5 shrink-0" />
              <div className="text-sm text-card-foreground">
                Für <strong>{people} Personen</strong> empfehlen wir ca. 
                <strong className="text-primary"> {totalAmount}{selectedEvent.unit}</strong> {selectedEvent.productName}.
              </div>
            </div>
            
            <div className="flex justify-between items-end border-t pt-4">
              <span className="text-muted-foreground text-sm">Geschätzter Preis</span>
              <span className="text-2xl font-bold text-primary">~ {estimatedPrice.toFixed(2)} €</span>
            </div>
          </div>

          <Button onClick={handleAddToCart} className="w-full h-14 text-lg" size="lg">
            <ShoppingCart className="mr-2 w-5 h-5" />
            Menge in den Warenkorb
          </Button>

        </CardContent>
      </Card>
    </div>
  );
}
