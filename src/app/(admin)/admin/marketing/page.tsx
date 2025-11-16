'use client';

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { mockAppConfig } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";
import type { Recipe } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { ImageUploader } from "@/components/custom/ImageUploader";

export default function MarketingPage() {
    const [recipe, setRecipe] = useState<Recipe>(mockAppConfig.recipeOfTheWeek);
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

    const handlePublish = () => {
        startTransition(() => {
            // In a real app, this would be a server action to update the database.
            // For now, we'll just simulate it.
            console.log("Publishing new recipe:", recipe);
            mockAppConfig.recipeOfTheWeek = recipe; // "Updating" the mock data source
            toast({
                title: "Wochen-Special veröffentlicht!",
                description: "Das neue Rezept der Woche ist jetzt für Kunden sichtbar.",
            });
        });
    };

    return (
        <>
            <PageHeader title="Marketing & Wochen-Special" description="Verwalten Sie hier das Rezept der Woche, das auf der Kundenseite angezeigt wird." />

            <Card>
                <CardHeader>
                    <CardTitle>Rezept der Woche</CardTitle>
                    <CardDescription>
                        Füllen Sie die Felder aus, um das Rezept zu aktualisieren. Änderungen sind nach dem Veröffentlichen sofort sichtbar.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Titel</Label>
                            <Input id="title" name="title" value={recipe.title} onChange={handleInputChange} placeholder="z.B. Frische Pfifferlinge..." />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subtitle">Untertitel</Label>
                            <Input id="subtitle" name="subtitle" value={recipe.subtitle} onChange={handleInputChange} placeholder="z.B. Ein herbstlicher Genuss" />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label>Rezeptbild</Label>
                        <ImageUploader 
                            onUploadComplete={handleImageUpload}
                            currentImageUrl={recipe.image}
                            folder="recipes"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Kurzbeschreibung (auf der Hauptkarte)</Label>
                        <Textarea id="description" name="description" value={recipe.description} onChange={handleInputChange} placeholder="Eine kurze, ansprechende Beschreibung..." />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="ingredients">Zutaten (eine pro Zeile)</Label>
                        <Textarea id="ingredients" name="ingredients" value={recipe.ingredients.join('\n')} onChange={handleInputChange} placeholder="500g Pfifferlinge\n1 Zwiebel..." className="min-h-32" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="instructions">Anleitung</Label>
                        <Textarea id="instructions" name="instructions" value={recipe.instructions} onChange={handleInputChange} placeholder="1. Pilze putzen...\n2. Zwiebeln anbraten..." className="min-h-48" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handlePublish} disabled={isPending}>
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Jetzt veröffentlichen
                    </Button>
                </CardFooter>
            </Card>
        </>
    );
}
