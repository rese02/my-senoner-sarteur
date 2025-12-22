
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/app/actions/auth.actions";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { SubmitButton } from "@/components/custom/SubmitButton";
import { useTransition } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function ProfileUpdateForm({ user }: { user: User }) {
    const { toast } = useToast();
    const { t } = useLanguage();
    const [isPending, startTransition] = useTransition();
   
    const handleUpdate = async (formData: FormData) => {
        startTransition(async () => {
            const result = await updateUserProfile(formData);
            if (result.success) {
                toast({ title: t.profile.toast.profileSaved, description: result.message });
            } else {
                toast({ variant: 'destructive', title: t.profile.toast.error, description: result.message });
            }
        });
    }
    
    return (
        <form action={handleUpdate}>
             <Card>
                <CardHeader>
                    <CardTitle>{t.profile.personalInfo}</CardTitle>
                    <CardDescription>{t.profile.personalInfoDesc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="name">{t.profile.fullName}</Label>
                            <Input id="name" name="name" defaultValue={user.name} />
                        </div>
                         <div className="space-y-1.5">
                            <Label htmlFor="phone">{t.profile.phone}</Label>
                            <Input id="phone" name="phone" defaultValue={user.phone} />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="email">{t.profile.email}</Label>
                        <Input id="email" name="email" value={user.email} readOnly disabled />
                    </div>
                    <h3 className="text-base font-semibold pt-4 border-t">{t.profile.deliveryAddress}</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-1.5">
                            <Label htmlFor="street">{t.profile.street}</Label>
                            <Input id="street" name="street" defaultValue={user.deliveryAddress?.street} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="zip">{t.profile.zip}</Label>
                            <Input id="zip" name="zip" defaultValue={user.deliveryAddress?.zip} />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="city">{t.profile.city}</Label>
                            <Input id="city" name="city" defaultValue={user.deliveryAddress?.city} />
                        </div>
                        <div className="col-span-2 space-y-1.5">
                            <Label htmlFor="province">{t.profile.province}</Label>
                            <Input id="province" name="province" defaultValue={user.deliveryAddress?.province} />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton isSubmitting={isPending}>{t.profile.saveChanges}</SubmitButton>
                </CardFooter>
            </Card>
        </form>
    );
}
