'use client';

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ImageUploader } from "@/components/custom/ImageUploader";
import type { Story } from "@/lib/types";
import { saveStory, deleteStory } from "@/app/actions/marketing.actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash2, Edit } from "lucide-react";
import Image from "next/image";

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

export function StoriesManager({ initialStories }: { initialStories: Story[] }) {
    const [stories, setStories] = useState<Story[]>(initialStories);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
    const [editingStory, setEditingStory] = useState<Partial<Story> | null>(null);

    useEffect(() => setStories(initialStories), [initialStories]);

    const handleOpenStoryModal = (story: Story | null) => {
        setEditingStory(story ? { ...story } : { id: `story-${Date.now()}`, label: '', author: '', imageUrl: '', imageHint: '' });
        setIsStoryModalOpen(true);
    };

    const handleSaveStory = (storyData: Partial<Story>) => {
        startTransition(async () => {
            try {
                const savedStory = await saveStory(storyData);
                if (stories.some(s => s.id === savedStory.id)) {
                    setStories(stories.map(s => s.id === savedStory.id ? savedStory : s));
                } else {
                    setStories([...stories, savedStory]);
                }
                toast({ title: "Story gespeichert!" });
                setIsStoryModalOpen(false);
                setEditingStory(null);
            } catch (error) {
                toast({ variant: 'destructive', title: 'Fehler', description: 'Story konnte nicht gespeichert werden.'});
            }
        });
    };

    const handleDeleteStory = (storyId: string) => {
        startTransition(async () => {
            try {
                await deleteStory(storyId);
                setStories(stories.filter(s => s.id !== storyId));
                toast({ title: "Story gelöscht." });
            } catch (error) {
                toast({ variant: 'destructive', title: 'Fehler', description: 'Story konnte nicht gelöscht werden.'});
            }
        });
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                        <CardTitle>Daily Stories</CardTitle>
                        <CardDescription>
                            Verwalten Sie die Stories auf dem Kunden-Dashboard (24h gültig).
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
                    {stories.length === 0 && (
                        <p className="text-muted-foreground text-sm col-span-full text-center py-8">Keine aktiven Stories.</p>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isStoryModalOpen} onOpenChange={setIsStoryModalOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingStory?.id?.startsWith('story-') ? 'Neue Story erstellen' : 'Story bearbeiten'}</DialogTitle>
                        <DialogDescription>
                            Fügen Sie ein Bild hinzu und geben Sie einen Titel und Autor an.
                        </DialogDescription>
                    </DialogHeader>
                    {isStoryModalOpen && <StoryForm story={editingStory} onSave={handleSaveStory} isPending={isPending} />}
                </DialogContent>
            </Dialog>
        </>
    );
}