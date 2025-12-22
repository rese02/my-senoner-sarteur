
'use client'; // Muss eine Client-Komponente sein, um den Language-Hook zu verwenden

import { PageHeader } from "@/components/common/PageHeader";
import { useSession } from "@/hooks/use-session";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { logout, deleteUserAccount } from "@/app/actions/auth.actions";
import { ProfileUpdateForm } from "./_components/ProfileUpdateForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/types";
import { PrivacySettingsForm } from "./_components/PrivacySettingsForm";
import { useLanguage } from "@/components/providers/LanguageProvider";
import Loading from "../loading";


export default function ProfilePage() {
    const { session: user, loading } = useSession();
    const { t } = useLanguage();

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return <PageHeader title="Nicht angemeldet" description="Bitte melden Sie sich an, um Ihr Profil zu sehen." />;
    }

    return (
        <div className="space-y-6">
            <PageHeader title={t.profile.title} description={t.profile.description} />
            
            <ProfileUpdateForm user={user} />
            <PrivacySettingsForm user={user} />
            
             <Card>
                <CardHeader>
                    <CardTitle>{t.profile.logout}</CardTitle>
                    <CardDescription>{t.profile.logoutDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={logout} className="w-full">
                        <Button type="submit" variant="outline" className="w-full">{t.profile.logout}</Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="border-destructive/50 bg-destructive/5">
                <CardHeader>
                    <CardTitle className="text-destructive">{t.profile.dangerZone}</CardTitle>
                    <CardDescription className="text-destructive/80">{t.profile.dangerZoneDesc}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={deleteUserAccount}>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="w-full text-destructive border-destructive/50 hover:bg-destructive/10 hover:text-destructive">{t.profile.deleteAccount}</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{t.profile.deleteAccountConfirmTitle}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {t.profile.deleteAccountConfirmDesc}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t.orders.cancel}</AlertDialogCancel>
                                    <AlertDialogAction type="submit" className="bg-destructive text-destructive-foreground hover:bg-destructive/90">{t.profile.deleteAccountButton}</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
