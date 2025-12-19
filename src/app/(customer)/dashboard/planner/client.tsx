
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
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { getLang } from '@/lib/utils';

function EventSelectionGrid({ events, onSelect, selectedEvent }: { events: PlannerEvent[], onSelect: (event: PlannerEvent) => void, selectedEvent: PlannerEvent | null }) {
    const { lang } = useLanguage();
    if (events.length === 0) {
        return (
            <Card className="text-center py-12 text-muted-foreground border-dashed bg-card/50">
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
                        "rounded-2xl overflow-hidden cursor-pointer group relative transition-all duration-300 ease-in-out border-4 shadow-sm hover:shadow-xl",
                        selectedEvent?.id === event.id ? "border-primary shadow-xl scale-105" : "border-transparent hover:border-primary/50"
                    )}
                >
                    <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors z-10"></div>
                    <div className="relative aspect-video w-full">
                        <Image 
                            src={event.imageUrl} 
                            alt={getLang(event.title, lang)} 
                            fill 
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 ease-in-out scale-105 group-hover:scale-110"
                            data-ai-hint={event.imageHint}
                        />
                    </div>
                    <div className="absolute z-20 bottom-4 left-4 text-white">
                        <h3 className="text-2xl font-bold leading-tight drop-shadow-md">{getLang(event.title, lang)}</h3>
                        <p className="text-sm opacity-80 drop-shadow">{getLang(event.description, lang)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

interface PlannerClientProps {
    initialEvents: PlannerEvent[];
    initialProducts: Product[];
}

export function PlannerClient({ initialEvents, initialProducts }: PlannerClientProps) {
  const { t, lang } = useLanguage();
  const [events] = useState<PlannerEvent[]>(initialEvents);
  const [products] = useState<Product[]>(initialProducts);
  const [selectedEvent, setSelectedEvent] = useState<PlannerEvent | null>(initialEvents[0] || null);
  const [people, setPeople] = useState(4);
  const { toast } = useToast();
  const addToCart = useCartStore(state => state.addToCart); 


  const handleAddToCart = () => {
    if (!selectedEvent) return;

    selectedEvent.ingredients.forEach(ingredient => {
        const product = products.find(p => p.id === ingredient.productId);
        if (product) {
            const totalAmount = ingredient.baseAmount * people;
            // Assuming price is per base unit (e.g. per kg or per piece)
            // A more complex logic might be needed if units vary widely
            const pricePerSmallestUnit = product.unit === 'kg' ? product.price / 1000 : product.price;
            const price = ingredient.unit === 'g' ? totalAmount * pricePerSmallestUnit : totalAmount * product.price;

            addToCart({ 
                productId: `${product.id}-${people}`, // Create a unique ID for this dynamic product
                name: `${getLang(product.name, lang)} (für ${people} Pers.)`, 
                quantity: 1, // We add it as a single package
                price: price
            });
        }
    });
    
    toast({
      title: t.planner.toast.addedTitle,
      description: t.planner.toast.addedDescription.replace('{event}', getLang(selectedEvent.title, lang)).replace('{count}', people.toString()),
    });
  };

  return (
    <div className="w-full space-y-8">
        <PageHeader title={t.planner.title} description={t.planner.description} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Linke Spalte: Event-Auswahl */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">{t.planner.selectEvent}</h2>
                <EventSelectionGrid events={events} onSelect={setSelectedEvent} selectedEvent={selectedEvent} />
            </div>

            {/* Rechte Spalte: Rechner */}
            {selectedEvent && (
                <div className="space-y-4 lg:sticky lg:top-8">
                    <h2 className="text-xl font-bold">{t.planner.setGuests}</h2>
                    <Card className="shadow-lg animate-in fade-in-50 overflow-hidden bg-card">
                        <CardHeader className="p-6">
                            <CardTitle className="text-2xl">{getLang(selectedEvent.title, lang)}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <Label className="text-base">{t.planner.guests}</Label>
                                <div className="flex items-center justify-between gap-4 bg-secondary p-4 rounded-xl border">
                                    <div className="flex items-center gap-4">
                                        <Users className="w-8 h-8 text-primary" />
                                        <span className="text-5xl font-bold text-primary">{people}</span>
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
                                <h3 className="text-sm uppercase tracking-wider text-muted-foreground font-bold mb-3 flex items-center gap-2">
                                    <Info size={14}/> {t.planner.recommendation.replace('{count}', people.toString())}
                                </h3>
                                <ul className="space-y-3 w-full">
                                    {selectedEvent.ingredients.map((ing, idx) => {
                                    const totalAmount = ing.baseAmount * people;
                                    return (
                                        <li key={idx} className="block sm:flex sm:justify-between sm:items-center border-b last:border-0 pb-2 last:pb-0 w-full">
                                            <span className="text-sm font-medium text-card-foreground break-words pr-0 sm:pr-4">
                                                {getLang(ing.productName, lang)}
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
                        <CardFooter className="p-6 bg-secondary/30 border-t">
                            <Button onClick={handleAddToCart} className="w-full h-12 text-base" size="lg">
                                <ShoppingCart className="mr-2 w-5 h-5" />
                                {t.planner.addToCart}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    </div>
  );
}
