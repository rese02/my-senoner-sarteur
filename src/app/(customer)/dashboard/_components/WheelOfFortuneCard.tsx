
'use client';

import { useState, useTransition } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Loader2, Gift } from 'lucide-react';
import type { WheelOfFortuneSettings } from '@/lib/types';
import { spinWheel } from '@/app/actions/marketing.actions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

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
    const segmentCount = segments.length;
    const segmentAngle = 360 / segmentCount;
    const gradientColors = segments.map((_, index) => 
        `${WHEEL_COLORS[index % WHEEL_COLORS.length]} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`
    ).join(', ');

    return (
        <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto transition-transform duration-[6000ms] ease-out" style={{ transform: `rotate(${rotation}deg)`}}>
            <div 
                className={cn(
                    "absolute inset-0 rounded-full border-8 border-primary/50 shadow-2xl transition-all flex items-center justify-center overflow-hidden", 
                    isSpinning && "animate-pulse"
                )}
                style={{ background: `conic-gradient(${gradientColors})` }}
            >
                {segments.map((segment, index) => {
                    const textRotation = (index * segmentAngle) + (segmentAngle / 2);
                    return (
                         <div
                            key={index}
                            className="absolute w-full h-full origin-center flex justify-center items-start"
                            style={{ transform: `rotate(${textRotation}deg)`}}
                        >
                            <span
                                className="font-medium text-sm"
                                style={{
                                    color: TEXT_COLORS[index % TEXT_COLORS.length],
                                    transform: `translateY(3.5rem) rotate(-90deg)`,
                                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                }}
                            >
                                {segment.text}
                            </span>
                        </div>
                    )
                })}
            </div>
             <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-card rounded-full transform -translate-x-1/2 -translate-y-1/2 border-4 border-primary z-10 flex items-center justify-center shadow-inner">
                <Gift className="text-primary w-8 h-8"/>
            </div>
        </div>
    );
}


export function WheelOfFortuneCard({ settings }: { settings: WheelOfFortuneSettings }) {
    const [isSpinning, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [result, setResult] = useState<string | null>(null);
    const { toast } = useToast();
    const router = useRouter();

    const handleSpin = () => {
        setResult(null);
        startTransition(async () => {
            try {
                const { winningSegment, prize } = await spinWheel();
                
                // Calculate rotation
                const segmentAngle = 360 / settings.segments.length;
                const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.8;
                const targetRotation = 360 * 10 - (winningSegment * segmentAngle) - (segmentAngle/2) + randomOffset;
                
                setRotation(targetRotation);
                setResult(prize);

                if (prize !== 'Niete') {
                    toast({
                        title: "Glückwunsch!",
                        description: `Sie haben gewonnen: ${prize}`,
                    });
                } else {
                    toast({
                        title: "Leider nichts...",
                        description: "Versuchen Sie es morgen wieder!",
                    });
                }
                
                // Manually re-fetch server data to update prize display
                router.refresh(); 

            } catch (error: any) {
                toast({ variant: 'destructive', title: 'Fehler', description: error.message });
            }
        });
    };

    const handleClose = () => {
        setIsOpen(false);
        // Refresh data on close to hide the card if user can't play again
        router.refresh();
    }

    return (
        <>
            <Card className="shadow-sm bg-card text-card-foreground border-none overflow-hidden relative flex flex-col justify-center min-h-[150px] h-full">
                <div className="absolute -right-10 -top-10 w-32 h-32 text-primary/10">
                    <Gift className="w-full h-full" />
                </div>
                <CardHeader className="pt-6">
                    <CardTitle className="flex items-center gap-2">
                        <Gift /> Ihr tägliches Glücksrad
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Drehen und gewinnen Sie tolle Preise – jeden Tag eine neue Chance!
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-0 mt-auto">
                    <Button onClick={() => setIsOpen(true)} className="w-full">
                        Jetzt drehen & gewinnen!
                    </Button>
                </CardContent>
            </Card>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent onInteractOutside={(e) => {
                    // Prevent closing while spinning
                    if (isSpinning) e.preventDefault();
                }} className="max-w-sm m-2 p-0">
                    <DialogHeader className="p-6 pb-2">
                        <DialogTitle>Viel Glück!</DialogTitle>
                        <DialogDescription>
                            Klicken Sie auf "Drehen", um Ihr Glück zu versuchen.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="relative py-8 flex flex-col items-center justify-center">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-primary z-20 drop-shadow-lg"></div>

                        <Wheel segments={settings.segments} rotation={rotation} isSpinning={isSpinning} />
                    </div>

                    <div className="p-6 pt-2 text-center">
                        {result && (
                             <div className="p-4 bg-secondary text-secondary-foreground rounded-lg animate-in fade-in-50 zoom-in-95 mb-4">
                                <p className="text-sm text-muted-foreground">Ihr Ergebnis:</p>
                                <p className="font-bold text-lg">{result}</p>
                            </div>
                        )}
                        {!result && (
                            <Button onClick={handleSpin} disabled={isSpinning} className="w-full" size="lg">
                                {isSpinning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                {isSpinning ? 'Wird gedreht...' : 'Drehen!'}
                            </Button>
                        )}
                         {result && (
                            <Button onClick={handleClose} variant="secondary" className="w-full">
                                Schließen
                            </Button>
                        )}
                    </div>

                </DialogContent>
            </Dialog>
        </>
    );
}
