'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/app/actions/auth.actions";
import type { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { SubmitButton } from "@/components/custom/SubmitButton";


export function ProfileUpdateForm({ user }: { user: User }) {
    const { toast } = useToast();
   
    const handleUpdate = async (formData: FormData) => {
        const result = await updateUserProfile(formData);
        if (result.success) {
            toast({ title: 'Gespeichert', description: result.message });
        } else {
            toast({ variant: 'destructive', title: 'Fehler', description: result.message });
        }
    }
    
    return (
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
                    <SubmitButton>Änderungen speichern</SubmitButton>
                </CardFooter>
            </Card>
        </form>
    );
}
