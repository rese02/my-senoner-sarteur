
'use client';

import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "@/components/custom/ImageUploader";
import type { PlannerEvent, Product, PlannerIngredientRule } from "@/lib/types";
import { savePlannerEvent, deletePlannerEvent } from "@/app/actions/marketing.actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Edit, Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { v4 as uuidv4 } from 'uuid';

function PlannerEventForm({ event: initialEvent, onSave, isPending, availableProducts, onCancel }: { event: Partial<PlannerEvent> | null, onSave: (event: Partial<PlannerEvent>) => void, isPending: boolean, availableProducts: Product[], onCancel: () => void }) {
    const [event, setEvent] = useState(initialEvent);
    
    useEffect(() => {
        setEvent(initialEvent);
    }, [initialEvent]);

    const [tempRule, setTempRule] = useState<{productId: string, productName: string, baseAmount: string, unit: string}>({ productId: '', productName: '', baseAmount: '', unit: 'g' });
    const { toast } = useToast();

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
            toast({variant: 'destructive', title: 'Produkt und Menge sind erforderlich.'});
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
        toast({ title: "Zutat hinzugefügt", description: `${newRule.baseAmount}${newRule.unit} ${newRule.productName}` });
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
        <form onSubmit={handleFormSubmit} className="flex flex-col h-full">
            <ScrollArea className="flex-1">
                <div className="grid gap-4 p-6">
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
                        <div className="flex gap-2 items-end bg-secondary p-2 rounded-xl border">
                            <div className="flex-1 space-y-1">
                                <Label className="text-xs">Produkt</Label>
                                <Select onValueChange={(val) => {
                                    const product = availableProducts.find(p => p.id === val);
                                    setTempRule(r => ({...r, productId: val, productName: product?.name || ''}))
                                }} value={tempRule.productId}>
                                    <SelectTrigger><SelectValue placeholder="Wählen..." /></SelectTrigger>
                                    <SelectContent>
                                        {availableProducts.map(p => (
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
                            <div key={index} className="flex justify-between items-center p-2 border rounded-xl bg-background shadow-sm text-sm">
                                <span><strong>{rule.baseAmount}{rule.unit}</strong> {rule.productName}</span>
                                <button onClick={() => removeRule(index)} type="button" className="text-destructive p-1 rounded hover:bg-destructive/10">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </ScrollArea>
            <SheetFooter className="p-6 pt-4 mt-auto sticky bottom-0 bg-card border-t">
                <SheetClose asChild><Button type="button" variant="outline" onClick={onCancel}>Abbrechen</Button></SheetClose>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 animate-spin h-4 w-4" />}
                    Speichern
                </Button>
            </SheetFooter>
        </form>
    );
}

export function PlannerManager({ initialPlannerEvents, availableProducts, onUpdate }: { initialPlannerEvents: PlannerEvent[], availableProducts: Product[], onUpdate: (events: PlannerEvent[]) => void }) {
    const [plannerEvents, setPlannerEvents] = useState<PlannerEvent[]>(initialPlannerEvents);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);
    const [editingPlannerEvent, setEditingPlannerEvent] = useState<Partial<PlannerEvent> | null>(null);

    useEffect(() => {
        setPlannerEvents(initialPlannerEvents);
        onUpdate(initialPlannerEvents);
    }, [initialPlannerEvents, onUpdate]);
    
    const handleOpenPlannerModal = (event: PlannerEvent | null) => {
        if (event) {
            setEditingPlannerEvent({ ...event });
        } else {
            setEditingPlannerEvent({
                id: undefined, // Explicitly set id to undefined for new events
                title: '',
                description: '',
                imageUrl: '',
                imageHint: '',
                ingredients: []
            });
        }
        setIsPlannerModalOpen(true);
    };

    const handleSavePlannerEvent = (eventData: Partial<PlannerEvent>) => {
        startTransition(async () => {
            try {
                const savedEvent = await savePlannerEvent(eventData);
                let updatedEvents;
                 if (plannerEvents.some(e => e.id === savedEvent.id)) {
                    updatedEvents = plannerEvents.map(e => e.id === savedEvent.id ? savedEvent : e);
                } else {
                    updatedEvents = [...plannerEvents, savedEvent];
                }
                setPlannerEvents(updatedEvents);
                onUpdate(updatedEvents);
                toast({ title: "Planer Event gespeichert!" });
                setIsPlannerModalOpen(false);
                setEditingPlannerEvent(null);
            } catch(error: any) {
                toast({ variant: 'destructive', title: 'Fehler', description: error.message || 'Event konnte nicht gespeichert werden.'});
            }
        });
    };

     const handleDeletePlannerEvent = (eventId: string) => {
        startTransition(async () => {
             try {
                await deletePlannerEvent(eventId);
                const updatedEvents = plannerEvents.filter(e => e.id !== eventId);
                setPlannerEvents(updatedEvents);
                onUpdate(updatedEvents);
                toast({ title: "Planer Event gelöscht." });
            } catch (error) {
                toast({ variant: 'destructive', title: 'Fehler', description: 'Event konnte nicht gelöscht werden.'});
            }
        });
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
                {plannerEvents.map(event => (
                    <div key={event.id} className="group relative border rounded-xl p-3 pr-10">
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
                                        <AlertDialogAction onClick={() => handleDeletePlannerEvent(event.id)} disabled={isPending}>Löschen</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
                {plannerEvents.length === 0 && (
                     <p className="text-muted-foreground text-sm col-span-full text-center py-8">Keine Events erstellt.</p>
                )}
            </div>
            <div className="p-6 border-t mt-auto sticky bottom-0 bg-card">
                 <Button onClick={() => handleOpenPlannerModal(null)} className="w-full">Neues Event</Button>
            </div>

            <Sheet open={isPlannerModalOpen} onOpenChange={setIsPlannerModalOpen}>
                <SheetContent className="sm:max-w-lg p-0">
                    <SheetHeader className="p-6 pb-0">
                        <SheetTitle>{editingPlannerEvent?.id ? 'Planer Event bearbeiten' : 'Neues Planer Event erstellen'}</SheetTitle>
                        <SheetDescription>
                            Definieren Sie hier die Regeln für den Mengenrechner.
                        </SheetDescription>
                    </SheetHeader>
                    {isPlannerModalOpen && <PlannerEventForm event={editingPlannerEvent} onSave={handleSavePlannerEvent} isPending={isPending} availableProducts={availableProducts} onCancel={() => setIsPlannerModalOpen(false)} />}
                </SheetContent>
            </Sheet>
        </>
    );
}
