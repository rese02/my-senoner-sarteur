

'use server';

import { RegisterForm } from './_components/register-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export default async function RegisterPage() {
  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-secondary p-0 md:p-4 relative overflow-hidden">
      
        <div className="absolute inset-0 z-0 opacity-5 bg-repeat" style={{ backgroundImage: "url('/background-pattern.svg')" }}></div>

        <div className="relative z-10 max-w-md w-full my-8 md:my-0">
             <Card className="flex flex-col justify-center shadow-2xl border-none rounded-none md:rounded-2xl w-full bg-primary text-primary-foreground">
                 <CardHeader className="text-center items-center pt-10 pb-6">
                    <div className="h-12 mb-4">
                        <Link href="/">
                            <Image src="/logo.png" alt="Senoner Sarteur Logo" width={160} height={40} className="h-full w-auto object-contain brightness-0 invert" />
                        </Link>
                    </div>
                    <CardTitle className="text-3xl font-headline">Konto erstellen</CardTitle>
                    <CardDescription className="text-primary-foreground/80">Werden Sie Teil unserer Community.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0 rounded-b-2xl bg-primary text-primary-foreground">
                  <RegisterForm />
                </CardContent>
                 <CardFooter className="flex-col items-center gap-4 px-8 pb-10 pt-6 bg-primary text-primary-foreground/80 rounded-b-none md:rounded-b-2xl border-t border-primary-foreground/10">
                    <p className="text-sm">
                        Haben Sie bereits ein Konto?{' '}
                        <Link href="/login" className="font-semibold text-white hover:underline">
                            Hier anmelden
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    </div>
  );
}
