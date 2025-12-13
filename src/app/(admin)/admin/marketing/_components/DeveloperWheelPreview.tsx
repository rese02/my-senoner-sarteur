'use client';

import { useState, useTransition, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, Sparkles, Gift, FlaskConical } from 'lucide-react';
import type { WheelOfFortuneSettings } from '@/lib/types';
import { spinWheel } from '@/app/actions/marketing.actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const WHEEL_COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--secondary))',
];

const TEXT_COLORS = [
    'hsl(var(--primary-foreground))',
    'hsl(var(--secondary-foreground))',
    'hsl(var(--accent-foreground))',
    'hsl(var(--secondary-foreground))',
]

function Wheel({ segments, rotation, isSpinning }: { segments: {text: string}[], rotation: number, isSpinning: boolean }) {
    const segmentAngle = 360 / segments.length;
    return (
        <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto transition-transform duration-[6000ms] ease-out" style={{ transform: `rotate(${rotation}deg)`}}>
            <div className={cn("absolute inset-0 rounded-full border-8 border-primary shadow-2xl transition-all", isSpinning && "animate-pulse")}>
                {segments.map((segment, index) => (
                    <div
                        key={index}
                        className="absolute w-1/2 h-1/2 origin-bottom-right"
                        style={{
                            transform: `rotate(${index * segmentAngle}deg)`,
                            clipPath: `polygon(0 0, 100% 0, 100% 1px, ${Math.tan((segmentAngle/2) * (Math.PI / 180)) * 100}% 100%, 1px 100%)`
                        }}
                    >
                        <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{ backgroundColor: WHEEL_COLORS[index % WHEEL_COLORS.length] }}
                        >
                            <span
                                className="font-bold text-xs transform -rotate-90 -translate-x-8"
                                style={{ 
                                    transform: `rotate(${(segmentAngle/2)-90}deg) translateX(-3.5rem)`,
                                    color: TEXT_COLORS[index % TEXT_COLORS.length]
                                }}
                            >{segment.text}</span>
                        </div>
                    </div>
                ))}
            </div>
             <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 border-4 border-primary z-10 flex items-center justify-center">
                <Sparkles className="text-primary w-8 h-8"/>
            </div>
        </div>
    );
}


export function DeveloperWheelPreview({ initialSettings }: { initialSettings: WheelOfFortuneSettings }) {
    const [settings, setSettings] = useState(initialSettings);
    const [isSpinning, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<string | null>(null);
    const { toast } = useToast();

    // Sync with external changes from the main manager
    useEffect(() => {
        setSettings(initialSettings);
    }, [initialSettings]);
    
    // Ensure this wheel always spins in developer mode
    const testSettings = { ...settings, developerMode: true };

    const handleSpin = () => {
        setResult(null);
        startTransition(async () => {
            try {
                // The action will use the settings from the DB, but canUserPlay will be bypassed by dev mode
                const { winningSegment, prize } = await spinWheel();
                
                const segmentAngle = 360 / testSettings.segments.length;
                const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.8;
                const targetRotation = 360 * 10 - (winningSegment * segmentAngle) - (segmentAngle/2) + randomOffset;
                
                setRotation(targetRotation);

                setTimeout(() => {
                    setResult(prize);
                    toast({
                        title: "Test-Gewinn",
                        description: `Ergebnis: ${prize}`,
                    });
                }, 6500); 

            } catch (error: any) {
                toast({ variant: 'destructive', title: 'Fehler', description: error.message });
            }
        });
    };

    return (
        <>
            <Card className="shadow-lg border-yellow-400 border-2 bg-yellow-50">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-800">
                        <FlaskConical /> Glücksrad Entwickler-Vorschau
                    </CardTitle>
                    <CardDescription className="text-yellow-700">
                        Dies ist eine Live-Vorschau zum Testen. Zeitlimits sind hier deaktiviert.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={() => setIsOpen(true)} className="w-full bg-yellow-600 text-white hover:bg-yellow-700">
                        Test-Drehung starten
                    </Button>
                </CardContent>
            </Card>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent onInteractOutside={(e) => { if (isSpinning) e.preventDefault(); }} className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Viel Glück! (Testlauf)</DialogTitle>
                        <DialogDescription>Klicken Sie auf "Drehen", um das Rad zu testen.</DialogDescription>
                    </DialogHeader>
                    
                    <div className="relative py-8 flex flex-col items-center justify-center">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-primary z-20 drop-shadow-lg"></div>
                        <Wheel segments={testSettings.segments} rotation={rotation} isSpinning={isSpinning} />
                    </div>

                    <div className="mt-4 text-center">
                        {result && (
                             <div className="p-4 bg-accent/10 text-accent-foreground rounded-lg animate-in fade-in-50 zoom-in-95 mb-4">
                                <p className="text-sm text-muted-foreground">Ihr Ergebnis:</p>
                                <p className="font-bold text-lg">{result}</p>
                            </div>
                        )}
                        {!result && (
                            <Button onClick={handleSpin} disabled={isSpinning} className="w-full mt-2" size="lg">
                                {isSpinning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isSpinning ? 'Wird gedreht...' : 'Drehen!'}
                            </Button>
                        )}
                         {result && (
                            <Button onClick={() => setIsOpen(false)} variant="secondary" className="w-full">
                                Schließen
                            </Button>
                        )}
                    </div>

                </DialogContent>
            </Dialog>
        </>
    );
}