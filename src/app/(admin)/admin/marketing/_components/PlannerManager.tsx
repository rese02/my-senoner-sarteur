'use client';

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "@/components/custom/ImageUploader";
import type { PlannerEvent, Product, PlannerIngredientRule } from "@/lib/types";
import { savePlannerEvent, deletePlannerEvent } from "@/app/actions/marketing.actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash2, Edit, Plus } from "lucide-react";

function PlannerEventForm({ event: initialEvent, onSave, isPending, availableProducts }: { event: Partial<PlannerEvent> | null, onSave: (event: Partial<PlannerEvent>) => void, isPending: boolean, availableProducts: Product[] }) {
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

export function PlannerManager({ initialPlannerEvents, availableProducts }: { initialPlannerEvents: PlannerEvent[], availableProducts: Product[] }) {
    const [plannerEvents, setPlannerEvents] = useState<PlannerEvent[]>(initialPlannerEvents);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);
    const [editingPlannerEvent, setEditingPlannerEvent] = useState<Partial<PlannerEvent> | null>(null);

    useEffect(() => setPlannerEvents(initialPlannerEvents), [initialPlannerEvents]);
    
    const handleOpenPlannerModal = (event: PlannerEvent | null) => {
        setEditingPlannerEvent(event ? { ...event } : { id: `plan-${Date.now()}`, title: '', description: '', imageUrl: '', imageHint: '', ingredients: [] });
        setIsPlannerModalOpen(true);
    };

    const handleSavePlannerEvent = (eventData: Partial<PlannerEvent>) => {
        startTransition(async () => {
            try {
                const savedEvent = await savePlannerEvent(eventData);
                 if (plannerEvents.some(e => e.id === savedEvent.id)) {
                    setPlannerEvents(plannerEvents.map(e => e.id === savedEvent.id ? savedEvent : e));
                } else {
                    setPlannerEvents([...plannerEvents, savedEvent]);
                }
                toast({ title: "Planer Event gespeichert!" });
                setIsPlannerModalOpen(false);
                setEditingPlannerEvent(null);
            } catch(error) {
                toast({ variant: 'destructive', title: 'Fehler', description: 'Event konnte nicht gespeichert werden.'});
            }
        });
    };

     const handleDeletePlannerEvent = (eventId: string) => {
        startTransition(async () => {
             try {
                await deletePlannerEvent(eventId);
                setPlannerEvents(plannerEvents.filter(e => e.id !== eventId));
                toast({ title: "Planer Event gelöscht." });
            } catch (error) {
                toast({ variant: 'destructive', title: 'Fehler', description: 'Event konnte nicht gelöscht werden.'});
            }
        });
    };

    return (
        <>
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
                    {plannerEvents.length === 0 && (
                         <p className="text-muted-foreground text-sm col-span-full text-center py-8">Keine Events erstellt.</p>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isPlannerModalOpen} onOpenChange={setIsPlannerModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingPlannerEvent?.id?.startsWith('plan-') ? 'Neues Planer Event erstellen' : 'Planer Event bearbeiten'}</DialogTitle>
                        <DialogDescription>
                            Definieren Sie hier die Regeln für den Mengenrechner.
                        </DialogDescription>
                    </DialogHeader>
                    {isPlannerModalOpen && <PlannerEventForm event={editingPlannerEvent} onSave={handleSavePlannerEvent} isPending={isPending} availableProducts={availableProducts} />}
                </DialogContent>
            </Dialog>
        </>
    );
}
