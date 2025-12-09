
'use server';

import { RegisterForm } from './_components/register-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import Link from 'next/link';

export default async function RegisterPage() {
  return (
    <div className="w-full min-h-[100dvh] md:flex md:items-center md:justify-center bg-secondary p-4 relative overflow-hidden">
      
        <div className="absolute inset-0 z-0 opacity-5 bg-repeat" style={{ backgroundImage: "url('/background-pattern.svg')" }}></div>

        <div className="relative z-10 grid md:grid-cols-1 max-w-md w-full items-center my-8 md:my-0">
             <Card className="flex flex-col justify-center shadow-2xl border-border/50 rounded-2xl w-full bg-primary text-primary-foreground">
                 <CardHeader className="text-center items-center pt-10 pb-6">
                    <div className="h-12 mb-4">
                        <Logo />
                    </div>
                    <CardTitle className="text-3xl font-headline text-primary-foreground">Konto erstellen</CardTitle>
                    <CardDescription className="text-primary-foreground/80">Werden Sie Teil unserer Community.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                  <RegisterForm />
                   <p className="mt-6 text-center text-sm text-primary-foreground/80">
                    Haben Sie bereits ein Konto?{' '}
                    <Link href="/login" className="font-semibold text-primary-foreground hover:underline">
                      Hier anmelden
                    </Link>
                  </p>
                </CardContent>
            </Card>
        </div>

         <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-6 text-xs text-muted-foreground">
             <Link href="/impressum" className="hover:text-primary">Impressum</Link>
             <Link href="/datenschutz" className="hover:text-primary">Datenschutz</Link>
         </div>
    </div>
  );
}
