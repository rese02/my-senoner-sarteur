
'use server';

import { PageHeader } from "@/components/common/PageHeader";
import { getSession } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { logout, deleteUserAccount } from "@/app/actions/auth.actions";
import Link from "next/link";
import { ProfileUpdateForm } from "./_components/ProfileUpdateForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";


export default async function ProfilePage() {
    const user = await getSession();

    if (!user) {
        return <PageHeader title="Nicht angemeldet" description="Bitte melden Sie sich an, um Ihr Profil zu sehen." />;
    }

    return (
        <div className="space-y-6">
            <PageHeader title="Mein Profil" description="Verwalten Sie hier Ihre Kontodetails." />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    <ProfileUpdateForm user={user} />
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
