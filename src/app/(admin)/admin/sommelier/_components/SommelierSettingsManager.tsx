
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { saveSommelierSettings } from '@/app/actions/wine-manager.actions';
import { Loader2 } from 'lucide-react';

interface SommelierSettingsManagerProps {
    initialIsActive: boolean;
}

export function SommelierSettingsManager({ initialIsActive }: SommelierSettingsManagerProps) {
    const [isActive, setIsActive] = useState(initialIsActive);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleToggle = (checked: boolean) => {
        setIsActive(checked);
        startTransition(async () => {
            try {
                await saveSommelierSettings(checked);
                toast({
                    title: 'Einstellung gespeichert',
                    description: `AI Sommelier ist jetzt ${checked ? 'aktiviert' : 'deaktiviert'}.`,
                });
            } catch (error) {
                toast({ variant: 'destructive', title: 'Fehler', description: 'Einstellung konnte nicht gespeichert werden.' });
                // Revert state on error
                setIsActive(!checked);
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Funktion Aktivierung</CardTitle>
                <CardDescription>
                    Schalten Sie die AI Sommelier-Funktion für alle Kunden ein oder aus.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <Label htmlFor="sommelier-active-toggle" className="font-medium">
                        AI Sommelier aktiv
                    </Label>
                    <div className="flex items-center gap-2">
                        {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                        <Switch
                            id="sommelier-active-toggle"
                            checked={isActive}
                            onCheckedChange={handleToggle}
                            disabled={isPending}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
