'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import type { Recipe, Story, PlannerEvent, Product, WheelOfFortuneSettings } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeManager } from "./_components/RecipeManager";
import { StoriesManager } from "./_components/StoriesManager";
import { PlannerManager } from "./_components/PlannerManager";
import { WheelOfFortuneManager } from "./_components/WheelOfFortuneManager";


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
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 mb-6 h-auto sm:h-10">
                    <TabsTrigger value="recipe" className="h-10 text-sm sm:text-xs md:text-sm">🍳 Rezept der Woche</TabsTrigger>
                    <TabsTrigger value="stories" className="h-10 text-sm sm:text-xs md:text-sm">📸 Daily Stories</TabsTrigger>
                    <TabsTrigger value="planner" className="h-10 text-sm sm:text-xs md:text-sm">🎉 Party Planer</TabsTrigger>
                    <TabsTrigger value="wheel" className="h-10 text-sm sm:text-xs md:text-sm">🎡 Glücksrad</TabsTrigger>
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
