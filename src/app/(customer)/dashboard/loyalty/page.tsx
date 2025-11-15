import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSession } from "@/lib/session";
import { mockLoyaltyData } from "@/lib/mock-data";
import { Star, Gift } from "lucide-react";

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

function LoyaltyProgress({ stamps }: { stamps: number }) {
    const totalStamps = 10;
    const progress = (stamps % totalStamps) / totalStamps * 100;
  
    return (
      <div className="w-full">
        <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium">Your Progress</p>
            <p className="text-sm font-bold">{stamps % totalStamps} / {totalStamps}</p>
        </div>
        <div className="w-full bg-secondary rounded-full h-4 overflow-hidden relative">
          <div className="bg-primary h-4 rounded-full" style={{ width: `${progress}%` }}></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <p className="text-xs font-bold text-primary-foreground">
                {stamps % totalStamps} / {totalStamps} Stamps
             </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">Collect {totalStamps} stamps for a €5 reward!</p>
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
            <PageHeader title="My Loyalty Card" description="Show this QR code at checkout to collect stamps and redeem rewards." />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Digital Card</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <QrCodeDisplay userId={session.userId} />
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Points</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LoyaltyProgress stamps={loyaltyData.stamps} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Available Rewards</CardTitle>
                            <CardDescription>Rewards you've earned.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loyaltyData.availableCoupons.length > 0 ? (
                                <ul className="space-y-3">
                                    {loyaltyData.availableCoupons.map(coupon => (
                                        <li key={coupon.id} className="flex items-center gap-4 p-4 bg-accent/20 rounded-lg border-2 border-dashed border-accent">
                                            <Gift className="w-8 h-8 text-accent" />
                                            <div>
                                                <p className="font-bold text-lg">{coupon.description}</p>
                                                <p className="text-sm text-muted-foreground">Show your QR code to redeem</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted-foreground">No rewards available yet. Keep collecting stamps!</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
