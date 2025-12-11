'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { saveWheelSettings } from '@/app/actions/marketing.actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2, Plus } from 'lucide-react';
import type { WheelOfFortuneSettings, WheelSegment } from '@/lib/types';

export function WheelOfFortuneManager({ initialSettings }: { initialSettings: WheelOfFortuneSettings }) {
    const [settings, setSettings] = useState(initialSettings);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleSave = () => {
        startTransition(async () => {
            try {
                await saveWheelSettings(settings);
                toast({ title: 'Glücksrad-Einstellungen gespeichert!' });
            } catch (error: any) {
                toast({ variant: 'destructive', title: 'Fehler', description: error.message });
            }
        });
    };

    const handleAddSegment = () => {
        setSettings(prev => ({
            ...prev,
            segments: [...prev.segments, { text: 'Neuer Gewinn', type: 'win' }]
        }));
    };

    const handleRemoveSegment = (index: number) => {
        if (settings.segments.length <= 2) {
            toast({ variant: 'destructive', title: 'Mindestens 2 Segmente erforderlich' });
            return;
        }
        setSettings(prev => ({
            ...prev,
            segments: prev.segments.filter((_, i) => i !== index)
        }));
    };

    const handleSegmentChange = (index: number, field: keyof WheelSegment, value: string) => {
        setSettings(prev => {
            const newSegments = [...prev.segments];
            newSegments[index] = { ...newSegments[index], [field]: value };
            return { ...prev, segments: newSegments };
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Glücksrad-Konfiguration</CardTitle>
                <CardDescription>
                    Passen Sie das Glücksrad an, das den Kunden auf ihrem Dashboard angezeigt wird.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-xl bg-secondary/50">
                    <Label htmlFor="isActive" className="font-bold text-base">Glücksrad aktivieren</Label>
                    <Switch
                        id="isActive"
                        checked={settings.isActive}
                        onCheckedChange={(checked) => setSettings(s => ({ ...s, isActive: checked }))}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="schedule">Wie oft kann ein Kunde spielen?</Label>
                    <Select
                        value={settings.schedule}
                        onValueChange={(value: 'daily' | 'weekly' | 'monthly') => setSettings(s => ({ ...s, schedule: value }))}
                    >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Täglich</SelectItem>
                            <SelectItem value="weekly">Wöchentlich</SelectItem>
                            <SelectItem value="monthly">Monatlich</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <Label className="font-semibold">Segmente des Glücksrads</Label>
                    <div className="space-y-3">
                        {settings.segments.map((segment, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 border rounded-lg bg-background">
                                <Input
                                    value={segment.text}
                                    onChange={(e) => handleSegmentChange(index, 'text', e.target.value)}
                                    placeholder="Text des Segments"
                                />
                                <Select
                                    value={segment.type}
                                    onValueChange={(value: 'win' | 'lose') => handleSegmentChange(index, 'type', value)}
                                >
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="win">Gewinn</SelectItem>
                                        <SelectItem value="lose">Niete</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive"
                                    onClick={() => handleRemoveSegment(index)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                     <Button variant="outline" size="sm" onClick={handleAddSegment} className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Segment hinzufügen
                    </Button>
                </div>

            </CardContent>
            <CardFooter>
                <Button onClick={handleSave} disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Einstellungen speichern
                </Button>
            </CardFooter>
        </Card>
    );
}
