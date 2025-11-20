'use client';

import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChefHat, Clock } from "lucide-react";
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
                        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl">
                          <div className="grid md:grid-cols-2 max-h-[90vh]">
                            {/* LINKS: Bild (Vollflächig) */}
                            <div className="relative h-64 md:h-full w-full">
                              <Image src={recipe.image} layout="fill" objectFit="cover" alt={recipe.title} data-ai-hint={recipe.imageHint} />
                            </div>

                            {/* RECHTS: Scrollbarer Inhalt */}
                            <div className="p-6 md:p-8 overflow-y-auto bg-card">
                              <h2 className="font-headline text-3xl text-primary mb-2">{recipe.title}</h2>
                              <div className="flex items-center gap-4 text-muted-foreground text-sm mb-6">
                                <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5"/> 20 Min</span>
                                <span className="flex items-center"><ChefHat className="w-4 h-4 mr-1.5"/> Leicht</span>
                              </div>

                              <div className="space-y-6">
                                {/* Zutaten Box */}
                                <div className="bg-secondary p-4 rounded-xl border">
                                  <h3 className="font-bold uppercase text-xs tracking-wider text-muted-foreground mb-3">Zutaten</h3>
                                  <ul className="space-y-2">
                                    {recipe.ingredients.map((ing, i) => (
                                      <li key={i} className="flex items-center text-card-foreground font-medium">
                                        <span className="w-1.5 h-1.5 bg-accent rounded-full mr-3"></span> {ing}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Anleitung */}
                                <div>
                                  <h3 className="font-bold uppercase text-xs tracking-wider text-muted-foreground mb-3">Zubereitung</h3>
                                  <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {recipe.instructions}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                    </Dialog>

                </div>
            </div>
        </Card>
    );
}
