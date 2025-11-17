import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSession } from "@/lib/session";
import { mockLoyaltyData } from "@/lib/mock-data";
import { Star, Gift, Trophy } from "lucide-react";

async function QrCodeDisplay({ userId }: { userId: string }) {
    // In a real app, you would use a library to generate a QR code.
    // For this mock, we'll display a placeholder SVG.
    const qrData = `senoner-user:${userId}`;
    return (
        <div className="bg-white p-4 rounded-lg shadow-inner">
             <svg viewBox="0 0 100 100" className="w-full h-full">
                <path fill="#000" d="M0 0h30v30H0z M70 0h30v30H70z M0 70h30v30H0z m10-60h10v10h-10z m-10 10h10v10h-10z m10 10h10v10h-10z m-10 10h10v10h-10z M40 0h10v10h-10z m20 0h10v10h-10z M40 10h10v10h-10z m10 10h10v10h-10z M80 10h10v10h-10z m-10 10h10v10h-10z m10 10h10v10h-10z M10 40h10v10h-10z m20 0h10v10h-10z m20 0h10v10h-10z M80 40h10v10h-10z M0 50h10v10h-10z m10 10h10v10h-10z m10 0h10v10h-10z m10 0h10v10h-10z m10 0h10v10h-10z M60 50h10v10h-10z m20 0h10v10h-10z m10 0h10v10h-10z m-70 20h10v10h-10z M40 70h10v10h-10z m20 0h10v10h-10z m20 0h10v10h-10z m-70 10h10v10h-10z m10 10h10v10h-10z m10-10h10v10h-10z M70 80h10v10h-10z m10 10h10v10h-10z" />
             </svg>
            <p className="text-center mt-2 font-mono text-xs text-muted-foreground break-all">{qrData}</p>
        </div>
    );
}

const loyaltyTiers = {
  bronze: { name: 'Bronze', points: 0, next: 500, color: 'text-yellow-600' },
  silver: { name: 'Silber', points: 500, next: 1500, color: 'text-slate-500' },
  gold: { name: 'Gold', points: 1500, next: Infinity, color: 'text-amber-500' }
};

const getLoyaltyTier = (points: number) => {
  if (points >= loyaltyTiers.gold.points) return loyaltyTiers.gold;
  if (points >= loyaltyTiers.silver.points) return loyaltyTiers.silver;
  return loyaltyTiers.bronze;
};


function LoyaltyProgress({ points }: { points: number }) {
    const currentTier = getLoyaltyTier(points);
    const nextTier = currentTier.name === 'Gold' ? loyaltyTiers.gold : (currentTier.name === 'Silber' ? loyaltyTiers.gold : loyaltyTiers.silver);
    
    const pointsInCurrentTier = points - currentTier.points;
    const pointsForNextTier = nextTier.points - currentTier.points;
    const progress = nextTier.name === 'Gold' && currentTier.name === 'Gold' ? 100 : (pointsInCurrentTier / pointsForNextTier) * 100;

    return (
      <div className="w-full">
         <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Trophy className={`w-6 h-6 ${currentTier.color}`} />
              <p className="text-lg font-bold">{currentTier.name}-Status</p>
            </div>
            <p className="font-bold text-lg">{points.toLocaleString('de-DE')} <span className="text-sm font-normal text-muted-foreground">Punkte</span></p>
        </div>
        <Progress value={progress} className="h-4" />
        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
            <span>{currentTier.points.toLocaleString('de-DE')} Pkt.</span>
            { currentTier.name !== 'Gold' ? (
                 <p className="font-medium">Noch { (nextTier.points - points).toLocaleString('de-DE')} Punkte bis {nextTier.name}</p>
            ) : (
                <p className="font-medium">Sie haben den höchsten Status erreicht!</p>
            )}
            <span>{nextTier.name !== 'Gold' ? nextTier.points.toLocaleString('de-DE') + ' Pkt.' : ''}</span>
        </div>
      </div>
    );
  }

export default async function LoyaltyPage() {
    const session = await getSession();
    const loyaltyData = mockLoyaltyData.find(l => l.userId === session?.userId);

    if (!session || !loyaltyData) {
        return <PageHeader title="Not Found" description="Loyalty data not found." />;
    }

    return (
        <>
            <PageHeader title="My Loyalty Card" description="Show this QR code at checkout to collect points and redeem rewards." />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ihre digitale Karte</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <QrCodeDisplay userId={session.userId} />
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ihr Treue-Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LoyaltyProgress points={loyaltyData.stamps} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Verfügbare Gutscheine</CardTitle>
                            <CardDescription>Gutscheine, die Sie verdient haben.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loyaltyData.availableCoupons.length > 0 ? (
                                <ul className="space-y-3">
                                    {loyaltyData.availableCoupons.map(coupon => (
                                        <li key={coupon.id} className="flex items-center gap-4 p-4 bg-accent/20 rounded-lg border-2 border-dashed border-accent">
                                            <Gift className="w-8 h-8 text-accent" />
                                            <div>
                                                <p className="font-bold text-lg">{coupon.description}</p>
                                                <p className="text-sm text-muted-foreground">Zeigen Sie Ihren QR-Code, um ihn einzulösen</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground">Keine Gutscheine verfügbar. Sammeln Sie weiter Punkte!</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
