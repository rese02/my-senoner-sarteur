
'use server';

import { RegisterForm } from './_components/register-form';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';

export default async function RegisterPage() {
  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-background p-4">
        <div className="relative z-10 max-w-md w-full my-8">
             <Card className="shadow-2xl border">
                <CardContent className="p-8 md:p-10 space-y-6">
                    <div className="text-center items-center">
                        <div className="h-12 mb-4 inline-block">
                           <Logo />
                        </div>
                        <CardTitle className="text-3xl font-bold text-primary">Konto erstellen</CardTitle>
                        <CardDescription className="text-muted-foreground pt-1">Werden Sie Teil unserer Community.</CardDescription>
                    </div>

                    <RegisterForm />
                    
                    <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground pt-6 border-t">
                        <p>
                            Haben Sie bereits ein Konto?{' '}
                            <Link href="/login" className="font-semibold text-primary hover:underline">
                                Hier anmelden
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
