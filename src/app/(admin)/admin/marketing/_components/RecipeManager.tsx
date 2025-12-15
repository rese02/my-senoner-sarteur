
'use client';

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/custom/ImageUploader";
import type { Recipe } from "@/lib/types";
import { saveRecipeOfTheWeek } from "@/app/actions/marketing.actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export function RecipeManager({ initialRecipe, onUpdate }: { initialRecipe: Recipe, onUpdate: (recipe: Recipe) => void }) {
    const [recipe, setRecipe] = useState<Recipe>(initialRecipe);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'ingredients') {
            setRecipe(prev => ({ ...prev, ingredients: value.split('\n') }));
        } else {
            setRecipe(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleImageUpload = (url: string) => {
        setRecipe(prev => ({ ...prev, image: url }));
    };

    const handlePublishRecipe = () => {
        startTransition(async () => {
            try {
                await saveRecipeOfTheWeek(recipe);
                onUpdate(recipe);
                toast({
                    title: "Wochen-Special veröffentlicht!",
                    description: "Das neue Rezept der Woche ist jetzt für Kunden sichtbar.",
                });
            } catch (error) {
                 toast({
                    variant: "destructive",
                    title: "Fehler beim Speichern",
                    description: "Das Rezept konnte nicht aktualisiert werden.",
                });
            }
        });
    };
    
  return (
    <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="title">Titel</Label>
                    <Input id="title" name="title" value={recipe.title} onChange={handleInputChange} placeholder="z.B. Frische Pfifferlinge..." />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="subtitle">Untertitel</Label>
                    <Input id="subtitle" name="subtitle" value={recipe.subtitle} onChange={handleInputChange} placeholder="z.B. Ein herbstlicher Genuss" />
                </div>
            </div>
            <div className="space-y-1.5">
                <Label>Rezeptbild</Label>
                <ImageUploader 
                    onUploadComplete={handleImageUpload}
                    currentImageUrl={recipe.image}
                    folder="recipes"
                />
            </div>
             <div className="space-y-1.5">
                <Label htmlFor="imageHint">Bild-Hinweis</Label>
                <Input id="imageHint" name="imageHint" value={recipe.imageHint || ''} onChange={handleInputChange} placeholder="z.B. cooking dish"/>
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="description">Kurzbeschreibung (auf der Hauptkarte)</Label>
                <Textarea id="description" name="description" value={recipe.description} onChange={handleInputChange} placeholder="Eine kurze, ansprechende Beschreibung..." />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="ingredients">Zutaten (eine pro Zeile)</Label>
                <Textarea id="ingredients" name="ingredients" value={recipe.ingredients.join('\n')} onChange={handleInputChange} placeholder="500g Pfifferlinge\n1 Zwiebel..." className="min-h-24" />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="instructions">Anleitung</Label>
                <Textarea id="instructions" name="instructions" value={recipe.instructions} onChange={handleInputChange} placeholder="1. Pilze putzen...\n2. Zwiebeln anbraten..." className="min-h-32" />
            </div>
        </div>
        <div className="p-6 border-t bg-card mt-auto sticky bottom-0">
            <Button onClick={handlePublishRecipe} disabled={isPending} className="w-full">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Jetzt veröffentlichen
            </Button>
        </div>
    </div>
  );
}

