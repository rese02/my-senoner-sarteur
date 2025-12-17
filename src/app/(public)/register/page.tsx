
'use server';

import { RegisterForm } from './_components/register-form';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export default async function RegisterPage() {
  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-secondary p-0 md:p-4 relative overflow-hidden">
      
        <div className="absolute inset-0 z-0 opacity-5 bg-repeat" style={{ backgroundImage: "url('/background-pattern.svg')" }}></div>

        <div className="relative z-10 max-w-md w-full my-0 md:my-8">
             <Card className="flex flex-col justify-center shadow-2xl border-none rounded-none md:rounded-2xl w-full bg-card text-card-foreground min-h-[100dvh] md:min-h-0">
                <CardContent className="p-8 md:p-10 space-y-6">
                    <div className="text-center items-center">
                        <div className="h-12 mb-4 inline-block">
                            <Link href="/">
                                <Image src="/logo.png" alt="Senoner Sarteur Logo" width={160} height={40} className="h-full w-auto object-contain" />
                            </Link>
                        </div>
                        <CardTitle className="text-3xl font-headline text-primary">Konto erstellen</CardTitle>
                        <CardDescription className="text-muted-foreground pt-1">Werden Sie Teil unserer Community.</CardDescription>
                    </div>

                    <RegisterForm />
                    
                    <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground pt-6 border-t border-border">
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
