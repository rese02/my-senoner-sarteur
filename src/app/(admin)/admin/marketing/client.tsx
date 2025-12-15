
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recipe, Story, PlannerEvent, Product, WheelOfFortuneSettings } from "@/lib/types";
import { RecipeManager } from "./_components/RecipeManager";
import { StoriesManager } from "./_components/StoriesManager";
import { PlannerManager } from "./_components/PlannerManager";
import { WheelOfFortuneManager } from "./_components/WheelOfFortuneManager";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { CookingPot, Camera, PartyPopper, FerrisWheel, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DeveloperWheelPreview } from "./_components/DeveloperWheelPreview";

interface MarketingClientProps {
    initialStories: Story[];
    initialPlannerEvents: PlannerEvent[];
    availableProducts: Product[];
    initialRecipe: Recipe;
    initialWheelSettings: WheelOfFortuneSettings;
}

type SheetType = 'recipe' | 'stories' | 'planner' | 'wheel' | null;

export function MarketingClient({ initialStories, initialPlannerEvents, availableProducts, initialRecipe, initialWheelSettings }: MarketingClientProps) {
    const [openSheet, setOpenSheet] = useState<SheetType>(null);
    
    // We pass the settings down to the preview and the manager
    const [wheelSettings, setWheelSettings] = useState(initialWheelSettings);
    const [recipe, setRecipe] = useState(initialRecipe);
    const [stories, setStories] = useState(initialStories);
    const [plannerEvents, setPlannerEvents] = useState(initialPlannerEvents);


    const sections = [
        { 
            id: 'recipe' as SheetType, 
            title: "Rezept der Woche", 
            description: "Verwalten Sie das Rezept, das auf dem Dashboard erscheint.", 
            icon: CookingPot,
            component: <RecipeManager initialRecipe={recipe} onUpdate={setRecipe} />
        },
        { 
            id: 'stories' as SheetType, 
            title: "Daily Stories", 
            description: "Verwalten Sie kurzlebige Bilder-Stories für Kunden.", 
            icon: Camera,
            component: <StoriesManager initialStories={stories} onUpdate={setStories} />
        },
        { 
            id: 'planner' as SheetType, 
            title: "Party Planer", 
            description: "Konfigurieren Sie Event-Vorlagen und Zutaten.", 
            icon: PartyPopper,
            component: <PlannerManager initialPlannerEvents={plannerEvents} availableProducts={availableProducts} onUpdate={setPlannerEvents} />
        },
        { 
            id: 'wheel' as SheetType, 
            title: "Glücksrad", 
            description: "Passen Sie die Gewinne und Regeln für das Glücksrad an.", 
            icon: FerrisWheel,
            component: <WheelOfFortuneManager initialSettings={wheelSettings} onUpdate={setWheelSettings} />
        },
    ];
    
    const activeSection = sections.find(s => s.id === openSheet);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column: Management Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:col-span-1">
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
                            <Button variant="outline" className="w-full" onClick={() => setOpenSheet(section.id)}>
                                Verwalten
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Right Column: Developer Preview */}
            <div className="xl:col-span-1">
                <DeveloperWheelPreview initialSettings={wheelSettings} />
            </div>

            <Sheet open={openSheet !== null} onOpenChange={(isOpen) => !isOpen && setOpenSheet(null)}>
                <SheetContent className={cn(
                    "sm:max-w-2xl w-full p-0 flex flex-col",
                    (openSheet === 'stories' || openSheet === 'planner') && 'sm:max-w-lg'
                )}>
                    {activeSection && (
                         <>
                            <SheetHeader className="p-6">
                                <SheetTitle>{activeSection.title}</SheetTitle>
                                <SheetDescription>{activeSection.description}</SheetDescription>
                            </SheetHeader>
                            {activeSection.component}
                        </>
                    )}
                     <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-secondary">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </SheetClose>
                </SheetContent>
            </Sheet>
        </div>
    );
}
