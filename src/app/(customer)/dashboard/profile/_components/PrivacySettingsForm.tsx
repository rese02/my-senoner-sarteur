
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { updateUserProfile } from "@/app/actions/auth.actions";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { SubmitButton } from "@/components/custom/SubmitButton";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/components/providers/LanguageProvider";


export function PrivacySettingsForm({ user }: { user: User }) {
    const { t } = useLanguage();
    const { toast } = useToast();
    
    // This is a Server Action form
    const updateConsentAction = async (formData: FormData) => {
        const result = await updateUserProfile(formData);
         if (result.success) {
            toast({ title: t.profile.toast.consentSaved });
        } else {
            toast({ variant: 'destructive', title: t.profile.toast.error, description: result.message });
        }
    };

    return (
        <form action={updateConsentAction}>
             <input type="hidden" name="name" value={user.name} />
            <Card>
                <CardHeader>
                    <CardTitle>{t.profile.privacySettings}</CardTitle>
                    <CardDescription>{t.profile.privacySettingsDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-xl">
                        <div>
                            <Label htmlFor="marketingConsent" className="font-medium">{t.profile.consentMarketing}</Label>
                            <p className="text-xs text-muted-foreground">{t.profile.consentMarketingDesc}</p>
                        </div>
                        <Switch
                            id="marketingConsent"
                            name="marketingConsent"
                            defaultChecked={user.consent?.marketing?.accepted ?? false}
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-xl">
                        <div>
                            <Label htmlFor="profilingConsent" className="font-medium">{t.profile.consentProfiling}</Label>
                            <p className="text-xs text-muted-foreground">{t.profile.consentProfilingDesc}</p>
                        </div>
                        <Switch
                            id="profilingConsent"
                            name="profilingConsent"
                            defaultChecked={user.consent?.profiling?.accepted ?? false}
                        />
                    </div>
                </CardContent>
                 <CardFooter>
                    <SubmitButton>{t.profile.saveConsents}</SubmitButton>
                </CardFooter>
            </Card>
        </form>
    );
}
