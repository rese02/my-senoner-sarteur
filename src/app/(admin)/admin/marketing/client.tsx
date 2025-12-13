'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import type { Recipe, Story, PlannerEvent, Product, WheelOfFortuneSettings } from "@/lib/types";
import { RecipeManager } from "./_components/RecipeManager";
import { StoriesManager } from "./_components/StoriesManager";
import { PlannerManager } from "./_components/PlannerManager";
import { WheelOfFortuneManager } from "./_components/WheelOfFortuneManager";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CookingPot, Camera, PartyPopper, FerrisWheel } from "lucide-react";
import { cn } from "@/lib/utils";

interface MarketingClientProps {
    initialStories: Story[];
    initialPlannerEvents: PlannerEvent[];
    availableProducts: Product[];
    initialRecipe: Recipe;
    initialWheelSettings: WheelOfFortuneSettings;
}

type ModalType = 'recipe' | 'stories' | 'planner' | 'wheel' | null;

export function MarketingClient({ initialStories, initialPlannerEvents, availableProducts, initialRecipe, initialWheelSettings }: MarketingClientProps) {
    const [openModal, setOpenModal] = useState<ModalType>(null);

    const sections = [
        { 
            id: 'recipe' as ModalType, 
            title: "Rezept der Woche", 
            description: "Verwalten Sie das Rezept, das auf dem Dashboard erscheint.", 
            icon: CookingPot,
            component: <RecipeManager initialRecipe={initialRecipe} />
        },
        { 
            id: 'stories' as ModalType, 
            title: "Daily Stories", 
            description: "Verwalten Sie kurzlebige Bilder-Stories für Kunden.", 
            icon: Camera,
            component: <StoriesManager initialStories={initialStories} />
        },
        { 
            id: 'planner' as ModalType, 
            title: "Party Planer", 
            description: "Konfigurieren Sie Event-Vorlagen und Zutaten.", 
            icon: PartyPopper,
            component: <PlannerManager initialPlannerEvents={initialPlannerEvents} availableProducts={availableProducts} />
        },
        { 
            id: 'wheel' as ModalType, 
            title: "Glücksrad", 
            description: "Passen Sie die Gewinne und Regeln für das Glücksrad an.", 
            icon: FerrisWheel,
            component: <WheelOfFortuneManager initialSettings={initialWheelSettings} />
        },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sections.map(section => (
                    <Card key={section.id} className="hover:shadow-lg transition-shadow group flex flex-col">
                        <CardHeader>
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <CardTitle className="text-xl">{section.title}</CardTitle>
                                    <CardDescription className="mt-2">{section.description}</CardDescription>
                                </div>
                                <section.icon className="h-8 w-8 text-primary/70 group-hover:text-primary transition-colors" />
                            </div>
                        </CardHeader>
                        <CardContent className="mt-auto">
                            <Button variant="outline" className="w-full" onClick={() => setOpenModal(section.id)}>
                                Verwalten
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={openModal !== null} onOpenChange={(isOpen) => !isOpen && setOpenModal(null)}>
                <DialogContent className={cn(
                    "sm:max-w-4xl p-0", 
                    openModal === 'planner' && 'sm:max-w-lg',
                    openModal === 'wheel' && 'sm:max-w-2xl'
                )}>
                    {sections.find(s => s.id === openModal)?.component}
                </DialogContent>
            </Dialog>
        </div>
    );
}
