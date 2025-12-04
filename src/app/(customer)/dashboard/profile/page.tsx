'use server';

import { PageHeader } from "@/components/common/PageHeader";
import { getSession } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { logout } from "@/app/actions/auth.actions";
import Link from "next/link";
import { ProfileUpdateForm } from "./_components/ProfileUpdateForm";


export default async function ProfilePage() {
    const user = await getSession();

    if (!user) {
        return <PageHeader title="Nicht angemeldet" description="Bitte melden Sie sich an, um Ihr Profil zu sehen." />;
    }

    return (
        <div className="pb-24 md:pb-8">
            <PageHeader title="Mein Profil" description="Verwalten Sie hier Ihre Kontodetails." />

            <div className="grid gap-6 md:grid-cols-1 max-w-2xl mx-auto">
                <ProfileUpdateForm user={user} />

                <Card>
                    <CardHeader>
                        <CardTitle>Abmelden</CardTitle>
                        <CardDescription>Beenden Sie Ihre aktuelle Sitzung.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={logout} className="w-full">
                            <button type="submit" className="w-full h-10 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transition-transform active:scale-[0.98] border border-input bg-background hover:bg-accent hover:text-accent-foreground">Abmelden</button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-12 pt-6 border-t text-center space-y-3">
                <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Senoner Sarteur. Wolkenstein in Gröden.
                </p>
                
                <div className="flex justify-center gap-4 text-xs text-muted-foreground font-medium">
                    <Link href="/impressum" className="hover:text-primary">Impressum</Link>
                    <Link href="/datenschutz" className="hover:text-primary">Datenschutz</Link>
                </div>

                <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">
                    Hinweis zu Allergenen: Informationen zu Inhaltsstoffen erhalten Sie direkt in unseren Filialen oder telefonisch.
                </p>
            </div>
        </div>
    );
}
