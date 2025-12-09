'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import type { Recipe, Story, PlannerEvent, Product } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecipeManager } from "./_components/RecipeManager";
import { StoriesManager } from "./_components/StoriesManager";
import { PlannerManager } from "./_components/PlannerManager";


interface MarketingClientProps {
    initialStories: Story[];
    initialPlannerEvents: PlannerEvent[];
    availableProducts: Product[];
    initialRecipe: Recipe;
}

export function MarketingClient({ initialStories, initialPlannerEvents, availableProducts, initialRecipe }: MarketingClientProps) {

    return (
        <div className="pb-24 md:pb-0">
            <Tabs defaultValue="recipe" className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 mb-8 h-auto sm:h-10">
                    <TabsTrigger value="recipe" className="h-10">🍳 Rezept der Woche</TabsTrigger>
                    <TabsTrigger value="stories" className="h-10">📸 Stories</TabsTrigger>
                    <TabsTrigger value="planner" className="h-10">🎉 Party Planer</TabsTrigger>
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
            </Tabs>
        </div>
    );
}
