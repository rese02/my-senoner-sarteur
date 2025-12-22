
'use server';

import { PageHeader } from "@/components/common/PageHeader";
import { getSession } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { logout, deleteUserAccount } from "@/app/actions/auth.actions";
import { ProfileUpdateForm } from "./_components/ProfileUpdateForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/types";
import { PrivacySettingsForm } from "./_components/PrivacySettingsForm";
import { LanguageProvider } from "@/components/providers/LanguageProvider";


export default async function ProfilePage() {
    const user = await getSession();

    if (!user) {
        // This should theoretically not be reached due to layout protection,
        // but it's good practice for robustness.
        return <PageHeader title="Nicht angemeldet" description="Bitte melden Sie sich an, um Ihr Profil zu sehen." />;
    }

    return (
        <LanguageProvider>
            <div className="space-y-6">
                <ProfileUpdateForm user={user} />
                <PrivacySettingsForm user={user} />
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

                <Card className="border-destructive/50 bg-destructive/5">
                    <CardHeader>
                        <CardTitle className="text-destructive">Gefahrenzone</CardTitle>
                        <CardDescription className="text-destructive/80">Diese Aktionen können nicht rückgängig gemacht werden.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={deleteUserAccount}>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive">Konto endgültig löschen</Button>
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
        </LanguageProvider>
    );
}
