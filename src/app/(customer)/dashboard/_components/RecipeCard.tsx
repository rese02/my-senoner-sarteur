import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { mockAppConfig } from "@/lib/mock-data";
import { ChefHat } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function RecipeCard() {
    const recipeImage = PlaceHolderImages.find(p => p.id === 'recipe-of-the-week');

    const recipeOfTheWeek = {
        title: "Recipe of the Week",
        text: mockAppConfig.seasonalHighlightText,
        imageUrl: recipeImage?.imageUrl || "https://picsum.photos/seed/recipe/600/400",
        imageHint: recipeImage?.imageHint || "cooking dish"
    };

    return (
        <Card className="overflow-hidden w-full">
            <div className="grid md:grid-cols-2">
                <div className="relative aspect-[4/3] md:aspect-auto">
                    <Image src={recipeOfTheWeek.imageUrl} alt={recipeOfTheWeek.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" data-ai-hint={recipeOfTheWeek.imageHint} />
                </div>
                <div className="p-6 flex flex-col justify-center">
                    <h2 className="text-sm uppercase text-primary font-bold tracking-wider flex items-center gap-2"><ChefHat className="w-4 h-4"/>{recipeOfTheWeek.title}</h2>
                    <p className="mt-2 text-2xl font-bold font-headline">{recipeOfTheWeek.text}</p>
                    <p className="mt-4 text-muted-foreground">Discover a new delicious meal idea, featuring our best seasonal products. Perfect for a cozy autumn evening.</p>
                    <Button variant="outline" className="mt-6 w-fit">Get Recipe</Button>
                </div>
            </div>
        </Card>
    );
}
