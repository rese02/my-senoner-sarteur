
'use server';

import { PageHeader } from "@/components/common/PageHeader";
import { getSession } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { logout, deleteUserAccount } from "@/app/actions/auth.actions";
import { ProfileUpdateForm } from "./_components/ProfileUpdateForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateUserProfile } from "@/app/actions/auth.actions";
import { SubmitButton } from "@/components/custom/SubmitButton";
import type { User } from "@/lib/types";

function PrivacySettingsForm({ user }: { user: User }) {
    // This is a Server Action form
    const updateConsentAction = updateUserProfile.bind(null);

    return (
        <form action={updateConsentAction}>
             <input type="hidden" name="name" value={user.name} />
            <Card>
                <CardHeader>
                    <CardTitle>Datenschutzeinstellungen</CardTitle>
                    <CardDescription>Verwalten Sie hier Ihre Einwilligungen.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-xl">
                        <div>
                            <Label htmlFor="marketingConsent" className="font-medium">Newsletter & Angebote</Label>
                            <p className="text-xs text-muted-foreground">Erhalten Sie E-Mails über Neuigkeiten und Aktionen.</p>
                        </div>
                        <Switch
                            id="marketingConsent"
                            name="marketingConsent"
                            defaultChecked={user.consent?.marketing?.accepted ?? false}
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-xl">
                        <div>
                            <Label htmlFor="profilingConsent" className="font-medium">Personalisierte Empfehlungen</Label>
                            <p className="text-xs text-muted-foreground">Erlauben Sie uns, Ihre Einkäufe für bessere Vorschläge zu analysieren.</p>
                        </div>
                        <Switch
                            id="profilingConsent"
                            name="profilingConsent"
                            defaultChecked={user.consent?.profiling?.accepted ?? false}
                        />
                    </div>
                </CardContent>
                 <CardFooter>
                    <SubmitButton>Einwilligungen speichern</SubmitButton>
                </CardFooter>
            </Card>
        </form>
    );
}


export default async function ProfilePage() {
    const user = await getSession();

    if (!user) {
        // This should theoretically not be reached due to layout protection,
        // but it's good practice for robustness.
        return <PageHeader title="Nicht angemeldet" description="Bitte melden Sie sich an, um Ihr Profil zu sehen." />;
    }

    return (
        <div className="space-y-6">
            <PageHeader title="Mein Profil" description="Verwalten Sie hier Ihre Kontodetails und Datenschutzeinstellungen." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-6">
                    <ProfileUpdateForm user={user} />
                    <PrivacySettingsForm user={user} />
                </div>

                <div className="space-y-6 lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Abmelden</CardTitle>
                            <CardDescription>Beenden Sie Ihre aktuelle Sitzung.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={logout} className="w-full">
                                <Button type="submit" variant="outline" className="w-full">Abmelden</Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Gefahrenzone</CardTitle>
                            <CardDescription>Diese Aktionen können nicht rückgängig gemacht werden.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={deleteUserAccount}>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive">Konto endgültig löschen</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Sind Sie absolut sicher?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Diese Aktion kann nicht rückgängig gemacht werden. Ihr Konto, Ihre Bestellhistorie und Ihre Treuepunkte werden dauerhaft gelöscht.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                                            {/* The form submission is handled by the parent form element */}
                                            <AlertDialogAction type="submit" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Ja, mein Konto löschen</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
