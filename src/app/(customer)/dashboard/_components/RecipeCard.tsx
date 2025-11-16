'use client';

import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChefHat } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
                    
                     <Dialog>
                        <DialogTrigger asChild>
                             <Button variant="outline" className="mt-6 w-fit">Rezept ansehen</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                             <DialogHeader>
                                <DialogTitle className="text-2xl">{recipe.title}</DialogTitle>
                                <DialogDescription>{recipe.subtitle}</DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 grid gap-6 max-h-[70vh] overflow-y-auto pr-4">
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
                        </DialogContent>
                    </Dialog>

                </div>
            </div>
        </Card>
    );
}
