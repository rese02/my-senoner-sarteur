'use client';
import { PageHeader } from "@/components/common/PageHeader";
import { getSession } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { logout, updateUserProfile } from "@/app/actions/auth.actions";
import { useFormStatus } from "react-dom";
import { useEffect, useState, useTransition } from "react";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";


function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Änderungen speichern
        </Button>
    )
}

export default function ProfilePage() {
    const { toast } = useToast();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch('/api/get-session');
                if (res.ok) {
                    const sessionData = await res.json();
                    setUser(sessionData.user);
                }
            } catch (error) {
                console.error("Error fetching session:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchSession();
    }, []);

    const handleUpdate = async (formData: FormData) => {
        const result = await updateUserProfile(formData);
        if (result.success) {
            toast({ title: 'Gespeichert', description: result.message });
        } else {
            toast({ variant: 'destructive', title: 'Fehler', description: result.message });
        }
    }
    
    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (!user) {
        return <PageHeader title="Nicht angemeldet" description="Bitte melden Sie sich an, um Ihr Profil zu sehen." />;
    }

    return (
        <div className="pb-24 md:pb-8">
            <PageHeader title="Mein Profil" description="Verwalten Sie hier Ihre Kontodetails." />

            <div className="grid gap-6 md:grid-cols-1 max-w-2xl mx-auto">
                <form action={handleUpdate}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Persönliche Informationen</CardTitle>
                            <CardDescription>Die E-Mail-Adresse kann nicht geändert werden.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name">Vollständiger Name</Label>
                                <Input id="name" name="name" defaultValue={user.name} />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="email">E-Mail</Label>
                                <Input id="email" name="email" value={user.email} readOnly disabled />
                            </div>
                             <div className="space-y-1.5">
                                <Label htmlFor="phone">Telefonnummer</Label>
                                <Input id="phone" name="phone" defaultValue={user.phone} />
                            </div>
                            <h3 className="text-base font-semibold pt-4 border-t">Lieferadresse</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-1.5">
                                    <Label htmlFor="street">Straße & Nr.</Label>
                                    <Input id="street" name="street" defaultValue={user.deliveryAddress?.street} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="zip">PLZ</Label>
                                    <Input id="zip" name="zip" defaultValue={user.deliveryAddress?.zip} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="city">Ort</Label>
                                    <Input id="city" name="city" defaultValue={user.deliveryAddress?.city} />
                                </div>
                                <div className="col-span-2 space-y-1.5">
                                    <Label htmlFor="province">Provinz</Label>
                                    <Input id="province" name="province" defaultValue={user.deliveryAddress?.province} />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <SubmitButton />
                        </CardFooter>
                    </Card>
                </form>

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
