'use client';

import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChefHat } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function RecipeCard({ recipe }: { recipe: Recipe }) {

    return (
        <Card className="overflow-hidden w-full">
            <div className="grid md:grid-cols-2">
                <div className="relative aspect-[4/3] md:aspect-auto">
                    <Image src={recipe.image} alt={recipe.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" data-ai-hint={recipe.imageHint} priority />
                </div>
                <div className="p-6 flex flex-col justify-center">
                    <h2 className="text-sm uppercase text-primary font-bold tracking-wider flex items-center gap-2"><ChefHat className="w-4 h-4"/>Rezept der Woche</h2>
                    <p className="mt-2 text-2xl font-bold font-headline">{recipe.title}</p>
                    <p className="mt-4 text-muted-foreground">{recipe.description}</p>
                    
                     <Sheet>
                        <SheetTrigger asChild>
                             <Button variant="outline" className="mt-6 w-fit">Rezept ansehen</Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[90vh] flex flex-col rounded-t-lg">
                             <SheetHeader className="text-left">
                                <SheetTitle className="text-2xl font-headline">{recipe.title}</SheetTitle>
                                <SheetDescription>{recipe.subtitle}</SheetDescription>
                            </SheetHeader>
                            <div className="mt-4 grid gap-6 flex-1 overflow-y-auto pr-4">
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Zutaten</h3>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        {recipe.ingredients.map((ingredient, index) => (
                                        <li key={index}>{ingredient}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Anleitung</h3>
                                    <p className="text-muted-foreground whitespace-pre-line">{recipe.instructions}</p>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>

                </div>
            </div>
        </Card>
    );
}
