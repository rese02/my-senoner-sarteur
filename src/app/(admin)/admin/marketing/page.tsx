'use client';

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { mockAppConfig, mockStories } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";
import type { Recipe, Story } from "@/lib/types";
import { Loader2, PlusCircle, Trash2, Edit } from "lucide-react";
import { ImageUploader } from "@/components/custom/ImageUploader";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

// Helper component for story modal form
function StoryForm({ story, onSave, isPending }: { story: Partial<Story> | null, onSave: (story: Partial<Story>) => void, isPending: boolean }) {
    const [currentStory, setCurrentStory] = useState(story);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!currentStory) return;
        const { name, value } = e.target;
        setCurrentStory({ ...currentStory, [name]: value });
    };

    const handleImageUpload = (url: string) => {
        if (!currentStory) return;
        setCurrentStory({ ...currentStory, imageUrl: url });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStory) {
            onSave(currentStory);
        }
    };
    
    if (!currentStory) return null;

    return (
        <form onSubmit={handleFormSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
             <div className="space-y-2">
                <Label>Story Bild</Label>
                <ImageUploader 
                    onUploadComplete={handleImageUpload}
                    currentImageUrl={currentStory.imageUrl}
                    folder="stories"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="label">Titel (z.B. "Käse des Tages")</Label>
                <Input id="label" name="label" value={currentStory.label || ''} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="author">Autor (z.B. "Käsetheke")</Label>
                <Input id="author" name="author" value={currentStory.author || ''} onChange={handleChange} required />
            </div>
             <div className="space-y-2">
                <Label htmlFor="imageHint">Bild-Hinweis für KI</Label>
                <Input id="imageHint" name="imageHint" value={currentStory.imageHint || ''} onChange={handleChange} placeholder="z.B. cheese counter" />
            </div>
            <DialogFooter className="mt-4 sticky bottom-0 bg-background py-4">
                <DialogClose asChild><Button type="button" variant="outline">Abbrechen</Button></DialogClose>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 animate-spin" />}
                    Speichern
                </Button>
            </DialogFooter>
        </form>
    )
}


export default function MarketingPage() {
    const [recipe, setRecipe] = useState<Recipe>(mockAppConfig.recipeOfTheWeek);
    const [stories, setStories] = useState<Story[]>(mockStories);

    const [isRecipePending, startRecipeTransition] = useTransition();
    const [isStoryPending, startStoryTransition] = useTransition();

    const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
    const [editingStory, setEditingStory] = useState<Partial<Story> | null>(null);

    const { toast } = useToast();

    // --- Recipe of the Week Logic ---
    const handleRecipeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'ingredients') {
            setRecipe(prev => ({ ...prev, ingredients: value.split('\n') }));
        } else {
            setRecipe(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleRecipeImageUpload = (url: string) => {
        setRecipe(prev => ({ ...prev, image: url }));
    };

    const handlePublishRecipe = () => {
        startRecipeTransition(() => {
            console.log("Publishing new recipe:", recipe);
            mockAppConfig.recipeOfTheWeek = recipe;
            toast({
                title: "Wochen-Special veröffentlicht!",
                description: "Das neue Rezept der Woche ist jetzt für Kunden sichtbar.",
            });
        });
    };
    
    // --- Daily Stories Logic ---
    const handleOpenStoryModal = (story: Story | null) => {
        setEditingStory(story ? { ...story } : { label: '', author: '', imageUrl: '', imageHint: '' });
        setIsStoryModalOpen(true);
    };

    const handleSaveStory = (storyData: Partial<Story>) => {
        startStoryTransition(() => {
            if (storyData.id) {
                // Update
                const updatedStories = stories.map(s => s.id === storyData.id ? storyData as Story : s);
                setStories(updatedStories);
                const mockIndex = mockStories.findIndex(s => s.id === storyData.id);
                if (mockIndex > -1) mockStories[mockIndex] = storyData as Story;
                toast({ title: "Story aktualisiert!" });
            } else {
                // Create
                const newStory: Story = { ...storyData, id: `story-${Date.now()}` } as Story;
                setStories([...stories, newStory]);
                mockStories.push(newStory);
                toast({ title: "Neue Story erstellt!" });
            }
            setIsStoryModalOpen(false);
            setEditingStory(null);
        });
    };

    const handleDeleteStory = (storyId: string) => {
        startStoryTransition(() => {
            setStories(stories.filter(s => s.id !== storyId));
            const mockIndex = mockStories.findIndex(s => s.id === storyId);
            if (mockIndex > -1) mockStories.splice(mockIndex, 1);
            toast({ title: "Story gelöscht." });
        });
    };

    return (
        <div className="pb-24 md:pb-0">
            <PageHeader title="Marketing" description="Verwalten Sie hier Inhalte, die auf der Kundenseite angezeigt werden." />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                 {/* Left Column */}
                 <div className="space-y-8">
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-start">
                           <div>
                             <CardTitle>Daily Stories</CardTitle>
                             <CardDescription>
                                Verwalten Sie die Stories, die auf dem Dashboard der Kunden angezeigt werden.
                            </CardDescription>
                           </div>
                           <Button onClick={() => handleOpenStoryModal(null)}><PlusCircle className="mr-2 h-4 w-4" />Neu</Button>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {stories.map(story => (
                                <div key={story.id} className="group relative">
                                    <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-md">
                                        <Image src={story.imageUrl} alt={story.label} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-2 left-2 text-white">
                                            <p className="font-bold text-sm leading-tight">{story.label}</p>
                                            <p className="text-xs opacity-80">{story.author}</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => handleOpenStoryModal(story)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="icon" className="h-7 w-7">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
                                                    <AlertDialogDescription>Möchten Sie die Story '{story.label}' wirklich löschen?</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteStory(story.id)}>Löschen</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                 </div>
                 
                 {/* Right Column */}
                 <div className="space-y-8">
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
                                    <Input id="title" name="title" value={recipe.title} onChange={handleRecipeInputChange} placeholder="z.B. Frische Pfifferlinge..." />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subtitle">Untertitel</Label>
                                    <Input id="subtitle" name="subtitle" value={recipe.subtitle} onChange={handleRecipeInputChange} placeholder="z.B. Ein herbstlicher Genuss" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Rezeptbild</Label>
                                <ImageUploader 
                                    onUploadComplete={handleRecipeImageUpload}
                                    currentImageUrl={recipe.image}
                                    folder="recipes"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Kurzbeschreibung (auf der Hauptkarte)</Label>
                                <Textarea id="description" name="description" value={recipe.description} onChange={handleRecipeInputChange} placeholder="Eine kurze, ansprechende Beschreibung..." />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ingredients">Zutaten (eine pro Zeile)</Label>
                                <Textarea id="ingredients" name="ingredients" value={recipe.ingredients.join('\n')} onChange={handleRecipeInputChange} placeholder="500g Pfifferlinge\n1 Zwiebel..." className="min-h-32" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instructions">Anleitung</Label>
                                <Textarea id="instructions" name="instructions" value={recipe.instructions} onChange={handleRecipeInputChange} placeholder="1. Pilze putzen...\n2. Zwiebeln anbraten..." className="min-h-48" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handlePublishRecipe} disabled={isRecipePending}>
                                {isRecipePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Jetzt veröffentlichen
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Modal for creating/editing a story */}
            <Dialog open={isStoryModalOpen} onOpenChange={setIsStoryModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingStory?.id ? 'Story bearbeiten' : 'Neue Story erstellen'}</DialogTitle>
                        <DialogDescription>
                            Fügen Sie ein Bild hinzu und geben Sie einen Titel und Autor an.
                        </DialogDescription>
                    </DialogHeader>
                    {editingStory && <StoryForm story={editingStory} onSave={handleSaveStory} isPending={isStoryPending} />}
                </DialogContent>
            </Dialog>
        </div>
    );
}
