import { PageHeader } from "@/components/common/PageHeader";
import { getSession } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth.actions";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await getSession();
    
    // If there is no session, redirect to login.
    if (!session) {
        redirect('/login');
    }

    // The user data is directly available in the session object.
    const user = session;

    return (
        <div className="pb-24 md:pb-8">
            <PageHeader title="Mein Profil" description="Verwalten Sie hier Ihre Kontodetails." />

            <div className="grid gap-6 md:grid-cols-1 max-w-lg mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Persönliche Informationen</CardTitle>
                        <CardDescription>Die E-Mail-Adresse kann nicht geändert werden.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">Vollständiger Name</Label>
                            <Input id="name" defaultValue={user.name} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="email">E-Mail</Label>
                            <Input id="email" value={user.email} readOnly disabled />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Änderungen speichern</Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Abmelden</CardTitle>
                        <CardDescription>Beenden Sie Ihre aktuelle Sitzung.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={logout} className="w-full">
                            <Button variant="outline" className="w-full">Abmelden</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-12 pt-6 border-t text-center space-y-3">
                <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Senoner Sarteur. Wolkenstein in Gröden.
                </p>
                
                <div className="flex justify-center gap-4 text-xs text-muted-foreground font-medium">
                    <a href="https://www.senoner-sarteur.it/impressum" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Impressum</a>
                    <a href="https://www.senoner-sarteur.it/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Datenschutz</a>
                </div>

                <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">
                    Hinweis zu Allergenen: Informationen zu Inhaltsstoffen erhalten Sie direkt in unseren Filialen oder telefonisch.
                </p>
            </div>
        </div>
    );
}
