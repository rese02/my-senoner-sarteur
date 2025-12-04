'use client';

import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { mockAppConfig, mockStories, mockPlannerEvents, mockProducts } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";
import { useState, useTransition, useEffect } from "react";
import type { Recipe, Story, PlannerEvent, PlannerIngredientRule } from "@/lib/types";
import { Loader2, PlusCircle, Trash2, Edit, Plus, Save } from "lucide-react";
import { ImageUploader } from "@/components/custom/ImageUploader";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Helper component for story modal form
function StoryForm({ story, onSave, isPending }: { story: Partial<Story> | null, onSave: (story: Partial<Story>) => void, isPending: boolean }) {
    const [currentStory, setCurrentStory] = useState(story);
    
    useEffect(() => {
        setCurrentStory(story);
    }, [story]);

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
             <div className="space-y-1.5">
                <Label>Story Bild</Label>
                <ImageUploader 
                    onUploadComplete={handleImageUpload}
                    currentImageUrl={currentStory.imageUrl}
                    folder="stories"
                />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="label">Titel (z.B. "Käse des Tages")</Label>
                <Input id="label" name="label" value={currentStory.label || ''} onChange={handleChange} required />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="author">Autor (z.B. "Käsetheke")</Label>
                <Input id="author" name="author" value={currentStory.author || ''} onChange={handleChange} required />
            </div>
             <div className="space-y-1.5">
                <Label htmlFor="imageHint">Bild-Hinweis für KI</Label>
                <Input id="imageHint" name="imageHint" value={currentStory.imageHint || ''} onChange={handleChange} placeholder="z.B. cheese counter" />
            </div>
            <DialogFooter className="mt-4 sticky bottom-0 bg-background py-4">
                <DialogClose asChild><Button type="button" variant="outline">Abbrechen</Button></DialogClose>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 animate-spin h-4 w-4" />}
                    Speichern
                </Button>
            </DialogFooter>
        </form>
    )
}

function PlannerEventForm({ event: initialEvent, onSave, isPending }: { event: Partial<PlannerEvent> | null, onSave: (event: Partial<PlannerEvent>) => void, isPending: boolean }) {
    const [event, setEvent] = useState(initialEvent);
    
    useEffect(() => {
        setEvent(initialEvent);
    }, [initialEvent]);

    const [tempRule, setTempRule] = useState<{productId: string, productName: string, baseAmount: string, unit: string}>({ productId: '', productName: '', baseAmount: '', unit: 'g' });

    if (!event) return null;

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEvent({ ...event, [name]: value });
    };

    const handleImageUpload = (url: string) => {
        setEvent({ ...event, imageUrl: url });
    };

    const addRule = () => {
        if (!tempRule.productId || !tempRule.baseAmount) {
            alert('Produkt und Menge sind erforderlich.');
            return;
        }
        const newRule: PlannerIngredientRule = {
            productId: tempRule.productId,
            productName: tempRule.productName,
            baseAmount: parseFloat(tempRule.baseAmount),
            unit: tempRule.unit,
        };
        const newIngredients = [...(event.ingredients || []), newRule];
        setEvent({ ...event, ingredients: newIngredients });
        setTempRule({ productId: '', productName: '', baseAmount: '', unit: 'g' });
    };

    const removeRule = (index: number) => {
        const newIngredients = [...(event.ingredients || [])];
        newIngredients.splice(index, 1);
        setEvent({ ...event, ingredients: newIngredients });
    };
    
    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(event);
    };

    return (
        <form onSubmit={handleFormSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
            <div className="space-y-1.5">
                <Label htmlFor="title">Event Name</Label>
                <Input id="title" name="title" value={event.title || ''} onChange={handleFormChange} required placeholder="z.B. Raclette Abend"/>
            </div>
             <div className="space-y-1.5">
                <Label htmlFor="description">Kurzbeschreibung</Label>
                <Input id="description" name="description" value={event.description || ''} onChange={handleFormChange} placeholder="Der Klassiker für gemütliche Abende."/>
            </div>
            <div className="space-y-1.5">
                <Label>Event Bild</Label>
                <ImageUploader onUploadComplete={handleImageUpload} currentImageUrl={event.imageUrl} folder="planner" />
            </div>
            <div className="space-y-1.5">
                <Label htmlFor="imageHint">Bild-Hinweis</Label>
                <Input id="imageHint" name="imageHint" value={event.imageHint || ''} onChange={handleFormChange} placeholder="z.B. raclette cheese"/>
            </div>

            <div className="space-y-3 pt-4 border-t mt-4">
                <Label>Zutaten-Regeln (Menge pro 1 Person)</Label>
                <div className="flex gap-2 items-end bg-secondary p-2 rounded-lg border">
                    <div className="flex-1 space-y-1">
                        <Label className="text-xs">Produkt</Label>
                         <Select onValueChange={(val) => {
                            const product = mockProducts.find(p => p.id === val);
                            setTempRule(r => ({...r, productId: val, productName: product?.name || ''}))
                         }} value={tempRule.productId}>
                            <SelectTrigger><SelectValue placeholder="Wählen..." /></SelectTrigger>
                            <SelectContent>
                                {mockProducts.filter(p => p.isAvailable).map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                         </Select>
                    </div>
                     <div className="w-20 space-y-1">
                        <Label className="text-xs">Menge</Label>
                        <Input type="number" placeholder="150" value={tempRule.baseAmount} onChange={(e) => setTempRule(r => ({...r, baseAmount: e.target.value}))}/>
                    </div>
                     <div className="w-16 space-y-1">
                        <Label className="text-xs">Einheit</Label>
                        <Input placeholder="g" value={tempRule.unit} onChange={(e) => setTempRule(r => ({...r, unit: e.target.value}))} />
                    </div>
                    <Button type="button" size="icon" onClick={addRule}><Plus className="h-4 w-4" /></Button>
                </div>
                 <div className="space-y-2">
                    {event.ingredients?.map((rule, index) => (
                    <div key={index} className="flex justify-between items-center p-2 border rounded bg-background shadow-sm text-sm">
                        <span><strong>{rule.baseAmount}{rule.unit}</strong> {rule.productName}</span>
                        <button onClick={() => removeRule(index)} type="button" className="text-destructive p-1 rounded hover:bg-destructive/10">
                            <Trash2 size={16} />
                        </button>
                    </div>
                    ))}
                </div>
            </div>

            <DialogFooter className="mt-4 sticky bottom-0 bg-background py-4">
                <DialogClose asChild><Button type="button" variant="outline">Abbrechen</Button></DialogClose>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 animate-spin h-4 w-4" />}
                    Speichern
                </Button>
            </DialogFooter>
        </form>
    );
}



export default function MarketingPage() {
    const [recipe, setRecipe] = useState<Recipe>(mockAppConfig.recipeOfTheWeek);
    const [stories, setStories] = useState<Story[]>(mockStories);
    const [plannerEvents, setPlannerEvents] = useState<PlannerEvent[]>(mockPlannerEvents);

    const [isRecipePending, startRecipeTransition] = useTransition();
    const [isStoryPending, startStoryTransition] = useTransition();
    const [isPlannerPending, startPlannerTransition] = useTransition();

    const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
    const [editingStory, setEditingStory] = useState<Partial<Story> | null>(null);

    const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);
    const [editingPlannerEvent, setEditingPlannerEvent] = useState<Partial<PlannerEvent> | null>(null);

    const { toast } = useToast();

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
    
    const handleOpenStoryModal = (story: Story | null) => {
        setEditingStory(story ? { ...story } : { id: `story-${Date.now()}`, label: '', author: '', imageUrl: '', imageHint: '' });
        setIsStoryModalOpen(true);
    };

    const handleSaveStory = (storyData: Partial<Story>) => {
        startStoryTransition(() => {
            if (stories.find(s => s.id === storyData.id)) {
                const updatedStories = stories.map(s => s.id === storyData.id ? storyData as Story : s);
                setStories(updatedStories);
                const mockIndex = mockStories.findIndex(s => s.id === storyData.id);
                if (mockIndex > -1) mockStories[mockIndex] = storyData as Story;
                toast({ title: "Story aktualisiert!" });
            } else {
                const newStory: Story = { ...storyData, id: storyData.id || `story-${Date.now()}` } as Story;
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

    const handleOpenPlannerModal = (event: PlannerEvent | null) => {
        setEditingPlannerEvent(event ? { ...event } : { id: `plan-${Date.now()}`, title: '', description: '', imageUrl: '', imageHint: '', ingredients: [] });
        setIsPlannerModalOpen(true);
    };

    const handleSavePlannerEvent = (eventData: Partial<PlannerEvent>) => {
        startPlannerTransition(() => {
            if (plannerEvents.find(e => e.id === eventData.id)) {
                const updatedEvents = plannerEvents.map(e => e.id === eventData.id ? eventData as PlannerEvent : e);
                setPlannerEvents(updatedEvents);
                const mockIndex = mockPlannerEvents.findIndex(e => e.id === eventData.id);
                if (mockIndex > -1) mockPlannerEvents[mockIndex] = eventData as PlannerEvent;
                toast({ title: "Planer Event aktualisiert!" });
            } else {
                const newEvent: PlannerEvent = { ...eventData, id: eventData.id || `plan-${Date.now()}` } as PlannerEvent;
                setPlannerEvents([...plannerEvents, newEvent]);
                mockPlannerEvents.push(newEvent);
                toast({ title: "Neues Planer Event erstellt!" });
            }
            setIsPlannerModalOpen(false);
            setEditingPlannerEvent(null);
        });
    };

     const handleDeletePlannerEvent = (eventId: string) => {
        startPlannerTransition(() => {
            setPlannerEvents(plannerEvents.filter(e => e.id !== eventId));
            const mockIndex = mockPlannerEvents.findIndex(e => e.id === eventId);
            if (mockIndex > -1) mockPlannerEvents.splice(mockIndex, 1);
            toast({ title: "Planer Event gelöscht." });
        });
    };


    return (
        <div className="pb-24 md:pb-0">
            <PageHeader title="Marketing & Events" description="Verwalten Sie hier Inhalte, die auf der Kundenseite angezeigt werden." />
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                 <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row justify-between items-start">
                           <div>
                             <CardTitle>Daily Stories</CardTitle>
                             <CardDescription>
                                Verwalten Sie die Stories auf dem Kunden-Dashboard.
                            </CardDescription>
                           </div>
                           <Button onClick={() => handleOpenStoryModal(null)} size="sm"><PlusCircle className="mr-2 h-4 w-4" />Neu</Button>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {stories.map(story => (
                                <div key={story.id} className="group relative">
                                    <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-md">
                                        <Image src={story.imageUrl} alt={story.label} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                        <div className="absolute bottom-2 left-2 text-white">
                                            <p className="font-bold text-sm leading-tight">{story.label}</p>
                                            <p className="text-xs opacity-80">{story.author}</p>
                                        </div>
                                    </div>
                                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

                     <Card>
                        <CardHeader className="flex flex-row justify-between items-start">
                           <div>
                             <CardTitle>Party Planer Events</CardTitle>
                             <CardDescription>
                                Erstellen Sie Vorlagen für den Party-Planer.
                            </CardDescription>
                           </div>
                           <Button onClick={() => handleOpenPlannerModal(null)} size="sm"><PlusCircle className="mr-2 h-4 w-4" />Neu</Button>
                        </CardHeader>
                        <CardContent className="grid sm:grid-cols-2 gap-3">
                           {plannerEvents.map(event => (
                                <div key={event.id} className="group relative border rounded-lg p-3 pr-10">
                                    <p className="font-bold text-sm">{event.title}</p>
                                    <p className="text-xs text-muted-foreground">{event.ingredients.length} Zutaten-Regeln</p>
                                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => handleOpenPlannerModal(event)}>
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
                                                    <AlertDialogDescription>Möchten Sie das Event '{event.title}' wirklich löschen?</AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeletePlannerEvent(event.id)}>Löschen</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                 </div>
                 
                 <div className="space-y-6">
                     <Card>
                        <CardHeader>
                            <CardTitle>Rezept der Woche</CardTitle>
                            <CardDescription>
                                Änderungen sind nach dem Veröffentlichen sofort sichtbar.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <Label htmlFor="title">Titel</Label>
                                    <Input id="title" name="title" value={recipe.title} onChange={handleRecipeInputChange} placeholder="z.B. Frische Pfifferlinge..." />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="subtitle">Untertitel</Label>
                                    <Input id="subtitle" name="subtitle" value={recipe.subtitle} onChange={handleRecipeInputChange} placeholder="z.B. Ein herbstlicher Genuss" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label>Rezeptbild</Label>
                                <ImageUploader 
                                    onUploadComplete={handleRecipeImageUpload}
                                    currentImageUrl={recipe.image}
                                    folder="recipes"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="description">Kurzbeschreibung (auf der Hauptkarte)</Label>
                                <Textarea id="description" name="description" value={recipe.description} onChange={handleRecipeInputChange} placeholder="Eine kurze, ansprechende Beschreibung..." />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="ingredients">Zutaten (eine pro Zeile)</Label>
                                <Textarea id="ingredients" name="ingredients" value={recipe.ingredients.join('\n')} onChange={handleRecipeInputChange} placeholder="500g Pfifferlinge\n1 Zwiebel..." className="min-h-24" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="instructions">Anleitung</Label>
                                <Textarea id="instructions" name="instructions" value={recipe.instructions} onChange={handleRecipeInputChange} placeholder="1. Pilze putzen...\n2. Zwiebeln anbraten..." className="min-h-32" />
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

            <Dialog open={isStoryModalOpen} onOpenChange={setIsStoryModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingStory?.id ? 'Story bearbeiten' : 'Neue Story erstellen'}</DialogTitle>
                        <DialogDescription>
                            Fügen Sie ein Bild hinzu und geben Sie einen Titel und Autor an.
                        </DialogDescription>
                    </DialogHeader>
                    {isStoryModalOpen && <StoryForm story={editingStory} onSave={handleSaveStory} isPending={isStoryPending} />}
                </DialogContent>
            </Dialog>

            <Dialog open={isPlannerModalOpen} onOpenChange={setIsPlannerModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingPlannerEvent?.id ? 'Planer Event bearbeiten' : 'Neues Planer Event erstellen'}</DialogTitle>
                        <DialogDescription>
                            Definieren Sie hier die Regeln für den Mengenrechner.
                        </DialogDescription>
                    </DialogHeader>
                    {isPlannerModalOpen && <PlannerEventForm event={editingPlannerEvent} onSave={handleSavePlannerEvent} isPending={isPlannerPending} />}
                </DialogContent>
            </Dialog>
        </div>
    );
}
