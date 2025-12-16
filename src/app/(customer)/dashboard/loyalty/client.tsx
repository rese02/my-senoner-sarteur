
'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { spinWheelAndGetPrize } from "@/app/actions/loyalty.actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';

const PRIZES = [
    { id: 'lose', label: 'Niete', chance: 50 },
    { id: 'small', label: '10% Rabatt', chance: 30 },
    { id: 'medium', label: 'Gratis Kaffee', chance: 15 },
    { id: 'jackpot', label: 'Geschenkkorb', chance: 5 },
];

export function LoyaltyClient({ uid, points }: { uid: string, points: number }) {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const { toast } = useToast();
    const router = useRouter();
    const COST = 50; // Kosten pro Dreh

    const handleSpin = async () => {
        if (points < COST) {
            toast({ variant: "destructive", title: "Zu wenig Punkte", description: `Du brauchst ${COST} Punkte.` });
            return;
        }

        setIsSpinning(true);

        try {
            const { prize } = await spinWheelAndGetPrize();
            
            const prizeIndex = PRIZES.findIndex(p => p.id === prize.id);
            const segmentAngle = 360 / PRIZES.length;
            const randomOffset = (Math.random() - 0.5) * segmentAngle * 0.8;
            const targetRotation = (360 * 5) + (360 - (prizeIndex * segmentAngle) - (segmentAngle / 2)) + randomOffset;

            setRotation(targetRotation);

            setTimeout(() => {
                setIsSpinning(false);
                if (prize.id === 'lose') {
                    toast({ title: "Schade!", description: "Diesmal leider nichts. Versuch es nochmal!" });
                } else {
                    toast({ 
                        title: "Gewonnen! 🎉", 
                        description: `Du hast "${prize.label}" gewonnen!`,
                        className: "bg-green-600 text-white"
                    });
                }
                router.refresh();
            }, 4000);

        } catch (e: any) {
            toast({ variant: "destructive", title: "Fehler", description: e.message });
            setIsSpinning(false);
        }
    };

    return (
        <div className="p-4 space-y-8 flex flex-col items-center max-w-md mx-auto">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold font-headline">Deine Treuekarte</h1>
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-xl">
                    <Sparkles className="w-5 h-5" />
                    {points} Punkte
                </div>
            </div>

            <Card className="w-full bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Sparkles className="w-32 h-32" />
                </div>
                <CardContent className="p-8 flex flex-col items-center gap-6 relative z-10">
                    <div className="bg-white p-4 rounded-xl">
                        <QRCodeSVG value={`senoner-user:${uid}`} size={180} />
                    </div>
                    <p className="text-sm text-slate-300 text-center">Zeige diesen Code an der Kasse,<br/>um Punkte zu sammeln.</p>
                </CardContent>
            </Card>

            <Card className="w-full border-2 border-yellow-400/20 overflow-hidden">
                <CardHeader className="bg-yellow-50 text-center pb-2">
                    <CardTitle className="text-yellow-700">Glücksrad</CardTitle>
                    <p className="text-xs text-muted-foreground">Kosten: {COST} Punkte pro Dreh</p>
                </CardHeader>
                <CardContent className="p-6 flex flex-col items-center">
                    
                    <div className="relative w-64 h-64 mb-6">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[20px] border-t-black"></div>
                        
                        <div 
                            className="w-full h-full rounded-full border-4 border-slate-200 shadow-inner relative overflow-hidden transition-transform duration-[3500ms]"
                            style={{ transform: `rotate(${rotation}deg)`, transitionTimingFunction: 'cubic-bezier(0.3, 1, 0.7, 1)' }}
                        >
                            {PRIZES.map((prize, index) => (
                                <div key={index} className="absolute w-1/2 h-1/2 origin-bottom-right flex items-center justify-center text-white font-bold text-lg" style={{
                                    transform: `rotate(${index * (360 / PRIZES.length)}deg)`,
                                    clipPath: `polygon(0 0, 100% 0, 100% 2px, ${Math.tan(( (360 / PRIZES.length) / 2) * (Math.PI / 180)) * 100}% 100%, 2px 100%)`,
                                    backgroundColor: prize.id === 'lose' ? '#f87171' : prize.id === 'small' ? '#60a5fa' : prize.id === 'medium' ? '#facc15' : '#4ade80'
                                }}>
                                    <span style={{ transform: `rotate(${(360 / PRIZES.length / 2)}deg) translate(-50px, -5px)` }}>{prize.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Button 
                        size="lg" 
                        onClick={handleSpin} 
                        disabled={isSpinning || points < COST}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold shadow-md"
                    >
                        {isSpinning ? <Loader2 className="animate-spin" /> : `Jetzt Drehen (-${COST} Pkt)`}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}

