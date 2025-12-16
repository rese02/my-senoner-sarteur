
'use server';

import { PageHeader } from "@/components/common/PageHeader";
import { getSession } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gift, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { QrCodeDisplay } from "./_components/QrCodeDisplay";

function Stamp({ filled, index }: { filled: boolean, index: number }) {
    return (
        <div className={cn(
            "w-full aspect-square rounded-full flex items-center justify-center transition-all",
            filled ? "bg-accent/20 border-2 border-dashed border-accent" : "bg-secondary"
        )}
        style={{ animationDelay: `${index * 50}ms`}}
        >
            {filled && <Sparkles className="w-1/2 h-1/2 text-accent animate-in fade-in-50 zoom-in-75" />}
        </div>
    );
}

export default async function LoyaltyPage() {
    const user = await getSession();

    if (!user) {
        return <PageHeader title="Nicht angemeldet" description="Bitte melden Sie sich an, um Ihre Treuekarte zu sehen." />;
    }
    
    const stamps = user.loyaltyStamps || 0;
    const activePrize = user.activePrize;
    
    const progressSmall = Math.min(stamps, 5) / 5 * 100;
    const progressBig = Math.min(stamps, 10) / 10 * 100;

    return (
        <div className="space-y-6">
            <PageHeader title="Fidelity" description="Zeigen Sie Ihren QR-Code an der Kasse, um Stempel zu sammeln und Belohnungen einzulösen." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Ihr QR-Code</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <QrCodeDisplay userId={user.id} />
                        </CardContent>
                    </Card>

                    {activePrize && (
                        <Card className="shadow-lg bg-gradient-to-br from-accent/80 to-blue-400 border-accent animate-in fade-in-50">
                             <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-accent-foreground">
                                    <Star className="w-5 h-5"/> Aktiver Gewinn
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <p className="text-2xl font-bold text-accent-foreground">{activePrize}</p>
                                <p className="text-sm text-accent-foreground/80 mt-1">An der Kasse einlösbar!</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-2 space-y-6">
                     <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Stempelkarte</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-5 gap-2">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <Stamp key={i} index={i} filled={i < stamps} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle>Stempel-Belohnungen</CardTitle>
                            <CardDescription>Sammeln Sie Stempel für tolle Rabatte!</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Ziel 1: 5 Stempel */}
                            <div className={cn("p-4 rounded-lg transition-all", stamps >= 5 ? "bg-accent/10 border-2 border-dashed border-accent" : "bg-secondary")}>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Gift className={cn("w-6 h-6", stamps >= 5 ? "text-accent" : "text-muted-foreground")} />
                                        <p className="font-bold text-lg">3€ Rabatt</p>
                                    </div>
                                    <span className="font-mono text-sm text-muted-foreground">5 Stempel</span>
                                </div>
                                <div className="h-2 bg-background rounded-full overflow-hidden mt-3">
                                    <div 
                                    className="h-full bg-accent transition-all duration-1000" 
                                    style={{ width: `${progressSmall}%` }} 
                                    />
                                </div>
                                 {stamps >= 5 && stamps < 10 && (
                                    <p className="text-xs text-accent-foreground mt-2 font-bold animate-pulse text-center">
                                    Bereit zum Einlösen! (Oder weiter sparen für 7€)
                                    </p>
                                )}
                            </div>

                            {/* Ziel 2: 10 Stempel */}
                            <div className={cn("p-4 rounded-lg transition-all", stamps >= 10 ? "bg-accent/10 border-2 border-dashed border-accent" : "bg-secondary")}>
                                <div className="flex justify-between items-center">
                                     <div className="flex items-center gap-3">
                                        <Gift className={cn("w-6 h-6", stamps >= 10 ? "text-accent" : "text-muted-foreground")} />
                                        <p className="font-bold text-lg">7€ Rabatt (Super-Bonus)</p>
                                    </div>
                                    <span className="font-mono text-sm text-muted-foreground">10 Stempel</span>
                                </div>
                                <div className="h-2 bg-background rounded-full overflow-hidden mt-3">
                                    <div 
                                    className="h-full bg-accent transition-all duration-1000" 
                                    style={{ width: `${progressBig}%` }} 
                                    />
                                </div>
                                {stamps >= 10 && (
                                    <p className="text-xs text-accent-foreground mt-2 font-bold text-center">
                                    Maximale Belohnung erreicht!
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
