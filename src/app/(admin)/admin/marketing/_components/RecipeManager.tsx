
'use client';

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageUploader } from "@/components/custom/ImageUploader";
import type { Recipe, MultilingualText } from "@/lib/types";
import { saveRecipeOfTheWeek } from "@/app/actions/marketing.actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { getEmptyMultilingualText, getLang } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export function RecipeManager({ initialRecipe, onUpdate }: { initialRecipe: Recipe, onUpdate: (recipe: Recipe) => void }) {
    const [recipe, setRecipe] = useState<Recipe>(initialRecipe);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleInputChange = (field: keyof Recipe, lang: keyof MultilingualText, value: string) => {
        setRecipe(prev => {
            const newRecipe = { ...prev };
            const currentField = newRecipe[field] as MultilingualText;
            (newRecipe[field] as MultilingualText) = { ...currentField, [lang]: value };
            return newRecipe;
        });
    };
    
    const handleImageUpload = (url: string) => {
        setRecipe(prev => ({ ...prev, image: url }));
    };

    const handleImageHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRecipe(prev => ({ ...prev, imageHint: e.target.value }));
    };

    const addIngredient = () => {
        setRecipe(prev => ({ ...prev, ingredients: [...prev.ingredients, getEmptyMultilingualText()] }));
    };

    const removeIngredient = (index: number) => {
        setRecipe(prev => ({ ...prev, ingredients: prev.ingredients.filter((_, i) => i !== index) }));
    };

    const handleIngredientChange = (index: number, lang: keyof MultilingualText, value: string) => {
        setRecipe(prev => {
            const newIngredients = [...prev.ingredients];
            newIngredients[index] = { ...newIngredients[index], [lang]: value };
            return { ...prev, ingredients: newIngredients };
        });
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
            } catch (error: any) {
                 toast({
                    variant: "destructive",
                    title: "Fehler beim Speichern",
                    description: error.message || "Das Rezept konnte nicht aktualisiert werden.",
                });
            }
        });
    };
    
  return (
    <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
            <Tabs defaultValue="de" className="pt-4">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="de">Deutsch</TabsTrigger>
                    <TabsTrigger value="it">Italienisch</TabsTrigger>
                    <TabsTrigger value="en">Englisch</TabsTrigger>
                </TabsList>
                <TabsContent value="de" className="space-y-4">
                     <div className="space-y-1.5">
                        <Label>Titel (DE)</Label>
                        <Input value={getLang(recipe.title, 'de')} onChange={(e) => handleInputChange('title', 'de', e.target.value)} />
                    </div>
                     <div className="space-y-1.5">
                        <Label>Untertitel (DE)</Label>
                        <Input value={getLang(recipe.subtitle, 'de')} onChange={(e) => handleInputChange('subtitle', 'de', e.target.value)} />
                    </div>
                     <div className="space-y-1.5">
                        <Label>Beschreibung (DE)</Label>
                        <Textarea value={getLang(recipe.description, 'de')} onChange={(e) => handleInputChange('description', 'de', e.target.value)} />
                    </div>
                     <div className="space-y-1.5">
                        <Label>Anleitung (DE)</Label>
                        <Textarea value={getLang(recipe.instructions, 'de')} onChange={(e) => handleInputChange('instructions', 'de', e.target.value)} className="min-h-32"/>
                    </div>
                </TabsContent>
                <TabsContent value="it" className="space-y-4">
                     <div className="space-y-1.5">
                        <Label>Titel (IT)</Label>
                        <Input value={getLang(recipe.title, 'it')} onChange={(e) => handleInputChange('title', 'it', e.target.value)} />
                    </div>
                     <div className="space-y-1.5">
                        <Label>Untertitel (IT)</Label>
                        <Input value={getLang(recipe.subtitle, 'it')} onChange={(e) => handleInputChange('subtitle', 'it', e.target.value)} />
                    </div>
                     <div className="space-y-1.5">
                        <Label>Beschreibung (IT)</Label>
                        <Textarea value={getLang(recipe.description, 'it')} onChange={(e) => handleInputChange('description', 'it', e.target.value)} />
                    </div>
                     <div className="space-y-1.5">
                        <Label>Anleitung (IT)</Label>
                        <Textarea value={getLang(recipe.instructions, 'it')} onChange={(e) => handleInputChange('instructions', 'it', e.target.value)} className="min-h-32"/>
                    </div>
                </TabsContent>
                <TabsContent value="en" className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Titel (EN)</Label>
                        <Input value={getLang(recipe.title, 'en')} onChange={(e) => handleInputChange('title', 'en', e.target.value)} />
                    </div>
                     <div className="space-y-1.5">
                        <Label>Untertitel (EN)</Label>
                        <Input value={getLang(recipe.subtitle, 'en')} onChange={(e) => handleInputChange('subtitle', 'en', e.target.value)} />
                    </div>
                     <div className="space-y-1.5">
                        <Label>Beschreibung (EN)</Label>
                        <Textarea value={getLang(recipe.description, 'en')} onChange={(e) => handleInputChange('description', 'en', e.target.value)} />
                    </div>
                     <div className="space-y-1.5">
                        <Label>Anleitung (EN)</Label>
                        <Textarea value={getLang(recipe.instructions, 'en')} onChange={(e) => handleInputChange('instructions', 'en', e.target.value)} className="min-h-32"/>
                    </div>
                </TabsContent>
            </Tabs>

            <div className="space-y-1.5 border-t pt-6">
                <Label>Rezeptbild</Label>
                <ImageUploader 
                    onUploadComplete={handleImageUpload}
                    currentImageUrl={recipe.image}
                    folder="recipes"
                />
            </div>
             <div className="space-y-1.5">
                <Label htmlFor="imageHint">Bild-Hinweis für KI</Label>
                <Input id="imageHint" name="imageHint" value={recipe.imageHint || ''} onChange={handleImageHintChange} placeholder="z.B. cooking dish"/>
            </div>

            <div className="space-y-4 border-t pt-6">
                 <Label>Zutaten</Label>
                 {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-secondary/30 space-y-3">
                         <div className="flex justify-end">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeIngredient(index)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <Tabs defaultValue={`ing-de-${index}`}>
                             <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value={`ing-de-${index}`}>DE</TabsTrigger>
                                <TabsTrigger value={`ing-it-${index}`}>IT</TabsTrigger>
                                <TabsTrigger value={`ing-en-${index}`}>EN</TabsTrigger>
                            </TabsList>
                             <TabsContent value={`ing-de-${index}`}>
                                <Input placeholder="Zutat auf Deutsch" value={getLang(ingredient, 'de')} onChange={(e) => handleIngredientChange(index, 'de', e.target.value)} />
                            </TabsContent>
                             <TabsContent value={`ing-it-${index}`}>
                                <Input placeholder="Zutat auf Italienisch" value={getLang(ingredient, 'it')} onChange={(e) => handleIngredientChange(index, 'it', e.target.value)} />
                            </TabsContent>
                             <TabsContent value={`ing-en-${index}`}>
                                <Input placeholder="Zutat auf Englisch" value={getLang(ingredient, 'en')} onChange={(e) => handleIngredientChange(index, 'en', e.target.value)} />
                            </TabsContent>
                        </Tabs>
                    </div>
                 ))}
                 <Button variant="outline" size="sm" className="w-full" onClick={addIngredient}><Plus className="w-4 h-4 mr-2" /> Zutat hinzufügen</Button>
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