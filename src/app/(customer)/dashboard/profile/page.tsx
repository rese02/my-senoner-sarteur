import { PageHeader } from "@/components/common/PageHeader";
import { getSession } from "@/lib/session";
import { mockUsers } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth.actions";

export default async function ProfilePage() {
    const session = await getSession();
    const user = mockUsers.find(u => u.id === session?.userId);

    if (!user) {
        return <PageHeader title="User not found" />;
    }

    return (
        <div className="pb-24 md:pb-8">
            <PageHeader title="Mein Profil" description="Verwalten Sie hier Ihre Kontodetails." />

            <div className="grid gap-8 md:grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Persönliche Informationen</CardTitle>
                        <CardDescription>Aktualisieren Sie hier Ihren Namen. Die E-Mail-Adresse kann nicht geändert werden.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Vollständiger Name</Label>
                            <Input id="name" defaultValue={user.name} />
                        </div>
                        <div className="space-y-2">
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

            <div className="mt-12 pt-6 border-t text-center space-y-4">
                <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} Senoner Sarteur. Wolkenstein in Gröden.
                </p>
                
                <div className="flex justify-center gap-6 text-xs text-muted-foreground font-medium">
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
