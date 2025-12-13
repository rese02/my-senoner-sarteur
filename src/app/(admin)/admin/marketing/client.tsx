
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import type { Recipe, Story, PlannerEvent, Product, WheelOfFortuneSettings } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeManager } from "./_components/RecipeManager";
import { StoriesManager } from "./_components/StoriesManager";
import { PlannerManager } from "./_components/PlannerManager";
import { WheelOfFortuneManager } from "./_components/WheelOfFortuneManager";
import { ChefHat, Camera, PartyPopper, FerrisWheel } from "lucide-react";


interface MarketingClientProps {
    initialStories: Story[];
    initialPlannerEvents: PlannerEvent[];
    availableProducts: Product[];
    initialRecipe: Recipe;
    initialWheelSettings: WheelOfFortuneSettings;
}

export function MarketingClient({ initialStories, initialPlannerEvents, availableProducts, initialRecipe, initialWheelSettings }: MarketingClientProps) {

    return (
        <div>
            <Tabs defaultValue="recipe" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 h-auto gap-2 bg-transparent p-0">
                    <TabsTrigger value="recipe" className="h-14 text-sm sm:text-xs md:text-sm flex items-center justify-start gap-3 p-4 rounded-lg">
                        <ChefHat className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Rezept der Woche</span>
                    </TabsTrigger>
                    <TabsTrigger value="stories" className="h-14 text-sm sm:text-xs md:text-sm flex items-center justify-start gap-3 p-4 rounded-lg">
                        <Camera className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Daily Stories</span>
                    </TabsTrigger>
                    <TabsTrigger value="planner" className="h-14 text-sm sm:text-xs md:text-sm flex items-center justify-start gap-3 p-4 rounded-lg">
                        <PartyPopper className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Party Planer</span>
                    </TabsTrigger>
                    <TabsTrigger value="wheel" className="h-14 text-sm sm:text-xs md:text-sm flex items-center justify-start gap-3 p-4 rounded-lg">
                        <FerrisWheel className="w-5 h-5 text-primary" />
                        <span className="font-semibold">Glücksrad</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="recipe">
                    <RecipeManager initialRecipe={initialRecipe} />
                </TabsContent>

                <TabsContent value="stories">
                    <StoriesManager initialStories={initialStories} />
                </TabsContent>

                <TabsContent value="planner">
                    <PlannerManager initialPlannerEvents={initialPlannerEvents} availableProducts={availableProducts} />
                </TabsContent>

                <TabsContent value="wheel">
                    <WheelOfFortuneManager initialSettings={initialWheelSettings} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
