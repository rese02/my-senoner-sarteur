'use server';

import { PageHeader } from "@/components/common/PageHeader";
import { getSession } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gift, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { QRCodeSVG } from 'qrcode.react';

function QrCodeDisplay({ userId }: { userId: string }) {
    const qrData = `senoner-user:${userId}`;
    return (
        <div className="bg-white p-4 rounded-lg shadow-inner">
             <QRCodeSVG value={qrData} size={256} className="w-full h-full" />
            <p className="text-center mt-2 font-mono text-xs text-muted-foreground break-all">{qrData}</p>
        </div>
    );
}

function Stamp({ filled }: { filled: boolean }) {
    return (
        <div className={cn(
            "w-full aspect-square rounded-full flex items-center justify-center transition-all duration-500",
            filled ? "bg-accent/20 border-2 border-dashed border-accent" : "bg-secondary"
        )}>
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
    
    // Calculations for progress bars
    const progressSmall = Math.min(stamps, 5) / 5 * 100;
    const progressBig = Math.min(stamps, 10) / 10 * 100;

    return (
        <>
            <PageHeader title="Meine Treuekarte" description="Zeigen Sie Ihren QR-Code an der Kasse, um Stempel zu sammeln und Belohnungen einzulösen." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Linke Spalte: QR Code & Stempelkarte */}
                <div className="lg:col-span-1 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ihr QR-Code</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <QrCodeDisplay userId={user.id} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Stempelkarte</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-5 gap-2">
                                {Array.from({ length: 10 }).map((_, i) => (
                                    <Stamp key={i} filled={i < stamps} />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Rechte Spalte: Belohnungen */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="bg-gradient-to-br from-primary to-[#003366] text-primary-foreground border-none">
                        <CardHeader>
                            <CardTitle>Ihr Status</CardTitle>
                        </CardHeader>
                         <CardContent className="flex items-center justify-center text-center">
                            <div className="flex items-baseline gap-2">
                                <p className="text-7xl font-bold">{stamps}</p>
                                <p className="text-xl">Stempel</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ihre Belohnungen</CardTitle>
                            <CardDescription>Sparen Sie für noch größere Vorteile!</CardDescription>
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

                    <Card>
                        <CardHeader>
                           <CardTitle>So funktioniert's</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm text-muted-foreground list-disc pl-4 space-y-1">
                                <li>Pro <strong>15€ Einkaufswert</strong> erhalten Sie 1 Stempel.</li>
                                <li>Bei <strong>5 Stempeln</strong> können Sie 3€ Sofort-Rabatt einlösen.</li>
                                <li>Bei <strong>10 Stempeln</strong> können Sie 7€ Sofort-Rabatt einlösen.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}