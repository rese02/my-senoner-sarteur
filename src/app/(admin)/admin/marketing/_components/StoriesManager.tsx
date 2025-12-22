
'use client';

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ImageUploader } from "@/components/custom/ImageUploader";
import type { Story, MultilingualText } from "@/lib/types";
import { saveStory, deleteStory } from "@/app/actions/marketing.actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Edit } from "lucide-react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { getLang, getEmptyMultilingualText } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";


function StoryForm({ story, onSave, isPending, onCancel }: { story: Partial<Story> | null, onSave: (story: Partial<Story>) => void, isPending: boolean, onCancel: () => void }) {
    const [currentStory, setCurrentStory] = useState(story);
    
    useEffect(() => {
        setCurrentStory(story);
    }, [story]);

    const handleInputChange = (field: 'label' | 'author', lang: keyof MultilingualText, value: string) => {
        if (!currentStory) return;
        setCurrentStory(prev => {
            if (!prev) return null;
            const currentField = prev[field] ? { ...(prev[field] as MultilingualText) } : getEmptyMultilingualText();
            currentField[lang] = value;
            return { ...prev, [field]: currentField };
        });
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
        <form onSubmit={handleFormSubmit} className="flex flex-col h-full">
            <ScrollArea className="flex-1">
                <div className="grid gap-6 p-6">
                    <div className="space-y-1.5">
                        <Label>Story Bild</Label>
                        <ImageUploader 
                            onUploadComplete={handleImageUpload}
                            currentImageUrl={currentStory.imageUrl}
                            folder="stories"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="imageHint">Bild-Hinweis für KI</Label>
                        <Input id="imageHint" name="imageHint" value={currentStory.imageHint || ''} onChange={(e) => setCurrentStory({...currentStory, imageHint: e.target.value})} placeholder="z.B. cheese counter" />
                    </div>

                     <Tabs defaultValue="de" className="pt-4 border-t">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="de">Deutsch</TabsTrigger>
                            <TabsTrigger value="it">Italienisch</TabsTrigger>
                            <TabsTrigger value="en">Englisch</TabsTrigger>
                        </TabsList>
                        <TabsContent value="de" className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Titel (DE)</Label>
                                <Input value={getLang(currentStory.label, 'de')} onChange={(e) => handleInputChange('label', 'de', e.target.value)} required />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Autor (DE)</Label>
                                <Input value={getLang(currentStory.author, 'de')} onChange={(e) => handleInputChange('author', 'de', e.target.value)} required />
                            </div>
                        </TabsContent>
                        <TabsContent value="it" className="space-y-4">
                           <div className="space-y-1.5">
                                <Label>Titel (IT)</Label>
                                <Input value={getLang(currentStory.label, 'it')} onChange={(e) => handleInputChange('label', 'it', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Autor (IT)</Label>
                                <Input value={getLang(currentStory.author, 'it')} onChange={(e) => handleInputChange('author', 'it', e.target.value)} />
                            </div>
                        </TabsContent>
                         <TabsContent value="en" className="space-y-4">
                           <div className="space-y-1.5">
                                <Label>Titel (EN)</Label>
                                <Input value={getLang(currentStory.label, 'en')} onChange={(e) => handleInputChange('label', 'en', e.target.value)} />
                            </div>
                            <div className="space-y-1.5">
                                <Label>Autor (EN)</Label>
                                <Input value={getLang(currentStory.author, 'en')} onChange={(e) => handleInputChange('author', 'en', e.target.value)} />
                            </div>
                        </TabsContent>
                    </Tabs>

                </div>
            </ScrollArea>
            <SheetFooter className="p-6 pt-4 mt-auto border-t sticky bottom-0 bg-card">
                <SheetClose asChild><Button type="button" variant="outline" onClick={onCancel}>Abbrechen</Button></SheetClose>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 animate-spin h-4 w-4" />}
                    Speichern
                </Button>
            </SheetFooter>
        </form>
    )
}

export function StoriesManager({ initialStories, onUpdate }: { initialStories: Story[], onUpdate: (stories: Story[]) => void }) {
    const [stories, setStories] = useState<Story[]>(initialStories);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
    const [editingStory, setEditingStory] = useState<Partial<Story> | null>(null);

    useEffect(() => {
        setStories(initialStories)
        onUpdate(initialStories);
    }, [initialStories, onUpdate]);

    const handleOpenStoryModal = (story: Story | null) => {
        if (story) {
            setEditingStory({ ...story });
        } else {
            setEditingStory({
                id: undefined,
                label: getEmptyMultilingualText(),
                author: getEmptyMultilingualText(),
                imageUrl: '',
                imageHint: ''
            });
        }
        setIsStoryModalOpen(true);
    };

    const handleSaveStory = (storyData: Partial<Story>) => {
        startTransition(async () => {
            try {
                const savedStory = await saveStory(storyData);
                let updatedStories;
                if (stories.some(s => s.id === savedStory.id)) {
                    updatedStories = stories.map(s => s.id === savedStory.id ? savedStory : s);
                } else {
                    updatedStories = [...stories, savedStory];
                }
                setStories(updatedStories);
                onUpdate(updatedStories);
                toast({ title: "Story gespeichert!" });
                setIsStoryModalOpen(false);
                setEditingStory(null);
            } catch (error: any) {
                toast({ variant: 'destructive', title: 'Fehler', description: error.message || 'Story konnte nicht gespeichert werden.'});
            }
        });
    };

    const handleDeleteStory = (storyId: string) => {
        startTransition(async () => {
            try {
                await deleteStory(storyId);
                const updatedStories = stories.filter(s => s.id !== storyId);
                setStories(updatedStories);
                onUpdate(updatedStories);
                toast({ title: "Story gelöscht." });
            } catch (error) {
                toast({ variant: 'destructive', title: 'Fehler', description: 'Story konnte nicht gelöscht werden.'});
            }
        });
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto px-6 pb-6">
                <div className="grid sm:grid-cols-2 md:grid-cols-2 gap-3">
                    {stories.map(story => (
                        <div key={story.id} className="group relative">
                            <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-md">
                                <Image src={story.imageUrl} alt={getLang(story.label, 'de')} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover" data-ai-hint={story.imageHint} />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-2 left-2 text-white">
                                    <p className="font-bold text-sm leading-tight">{getLang(story.label, 'de')}</p>
                                    <p className="text-xs opacity-80">{getLang(story.author, 'de')}</p>
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
                                            <AlertDialogDescription>Möchten Sie die Story '{getLang(story.label, 'de')}' wirklich löschen?</AlertDialogDescription>
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
                    {stories.length === 0 && (
                        <p className="text-muted-foreground text-sm col-span-full text-center py-8">Keine aktiven Stories.</p>
                    )}
                </div>
            </div>
             <div className="p-6 border-t mt-auto sticky bottom-0 bg-card">
                 <Button onClick={() => handleOpenStoryModal(null)} className="w-full">Neue Story</Button>
            </div>

            <Sheet open={isStoryModalOpen} onOpenChange={setIsStoryModalOpen}>
                <SheetContent className="sm:max-w-lg p-0">
                    <SheetHeader className="p-6 pb-0">
                        <SheetTitle>{editingStory?.id && stories.some(s => s.id === editingStory.id) ? 'Story bearbeiten' : 'Neue Story erstellen'}</SheetTitle>
                        <SheetDescription>
                            Fügen Sie ein Bild hinzu und geben Sie einen Titel und Autor an.
                        </SheetDescription>
                    </SheetHeader>
                    {isStoryModalOpen && <StoryForm story={editingStory} onSave={handleSaveStory} isPending={isPending} onCancel={() => setIsStoryModalOpen(false)} />}
                </SheetContent>
            </Sheet>
        </>
    );
}
