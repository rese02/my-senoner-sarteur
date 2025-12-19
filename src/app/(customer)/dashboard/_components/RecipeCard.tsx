
'use client';

import {
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChefHat, Clock } from "lucide-react";
import type { Recipe } from "@/lib/types";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { getLang } from "@/lib/utils";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
    const { t, lang } = useLanguage();

    // Ensure ingredients are always an array
    const ingredients = getLang(recipe.ingredients, lang);
    const safeIngredients = Array.isArray(ingredients) ? ingredients : [];

    return (
        <Card className="overflow-hidden w-full bg-card shadow-sm h-full flex flex-col md:flex-row">
            <div className="relative aspect-[16/9] md:aspect-auto md:w-1/2 min-h-[200px]">
                <Image src={recipe.image} alt={getLang(recipe.title, lang)} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" data-ai-hint={recipe.imageHint} priority />
            </div>
            <div className="p-6 flex flex-col justify-between flex-grow md:w-1/2">
              <div>
                <h2 className="text-sm uppercase text-primary font-bold tracking-wider flex items-center gap-2"><ChefHat className="w-4 h-4"/>{t.dashboard.recipe_title}</h2>
                <p className="mt-2 text-2xl font-bold">{getLang(recipe.title, lang)}</p>
                <p className="mt-4 text-muted-foreground line-clamp-3 flex-grow">{getLang(recipe.description, lang)}</p>
              </div>
                
                 <Dialog>
                    <DialogTrigger asChild>
                         <Button variant="outline" className="mt-6 w-fit">{t.dashboard.btn_view_recipe}</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-4xl w-[95vw] p-0 overflow-hidden rounded-2xl">
                       <DialogHeader className="sr-only">
                          <DialogTitle>{getLang(recipe.title, lang)}</DialogTitle>
                          <DialogDescription>{getLang(recipe.subtitle, lang)}</DialogDescription>
                        </DialogHeader>
                      <div className="grid md:grid-cols-2 max-h-[90vh]">
                        {/* LINKS: Bild (Vollflächig) */}
                        <div className="relative h-64 md:h-full w-full">
                          <Image src={recipe.image} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" alt={getLang(recipe.title, lang)} data-ai-hint={recipe.imageHint} />
                        </div>

                        {/* RECHTS: Scrollbarer Inhalt */}
                        <div className="p-6 md:p-8 overflow-y-auto bg-card">
                          <div className="mb-6 text-left">
                            <h2 className="text-3xl text-primary font-bold">{getLang(recipe.title, lang)}</h2>
                            <p className="text-muted-foreground">{getLang(recipe.subtitle, lang)}</p>
                          </div>
                          
                          <div className="flex items-center gap-4 text-muted-foreground text-sm mb-6">
                            <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5"/> 20 Min</span>
                            <span className="flex items-center"><ChefHat className="w-4 h-4 mr-1.5"/> Leicht</span>
                          </div>

                          <div className="space-y-6">
                            {/* Zutaten Box */}
                            <div className="bg-secondary/50 p-4 rounded-xl border">
                              <h3 className="font-bold uppercase text-xs tracking-wider text-muted-foreground mb-3">{t.dashboard.recipe_ingredients}</h3>
                              <ul className="space-y-2">
                                {safeIngredients.map((ing: string, i: number) => (
                                  <li key={i} className="flex items-center text-card-foreground font-medium">
                                    <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></span> {ing}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Anleitung */}
                            <div>
                              <h3 className="font-bold uppercase text-xs tracking-wider text-muted-foreground mb-3">{t.dashboard.recipe_prep}</h3>
                              <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
                                {getLang(recipe.instructions, lang)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                </Dialog>

            </div>
        </Card>
    );
}
