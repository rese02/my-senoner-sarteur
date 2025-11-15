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
        <>
            <PageHeader title="My Profile" description="Manage your account details." />

            <div className="grid gap-8 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Update your name here. Email cannot be changed.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={user.name} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={user.email} readOnly disabled />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button>Save Changes</Button>
                    </CardFooter>
                </Card>

                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>Sign Out</CardTitle>
                             <CardDescription>End your current session.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={logout} className="w-full">
                                <Button variant="outline" className="w-full">Sign Out</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
