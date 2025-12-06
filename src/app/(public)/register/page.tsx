'use server';

import { RegisterForm } from './_components/register-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import Link from 'next/link';

export default async function RegisterPage() {
  return (
    <div className="w-full min-h-[100dvh] md:flex md:items-center md:justify-center bg-secondary p-4 relative overflow-hidden">
      
        <div className="absolute inset-0 z-0 opacity-10 bg-repeat" style={{ backgroundImage: "url('/background-pattern.svg')" }}></div>

        <div className="relative z-10 grid md:grid-cols-1 max-w-sm w-full items-center">
             <Card className="flex flex-col justify-center shadow-2xl border border-border rounded-2xl w-full bg-card">
                 <CardHeader className="text-center items-center pt-10 pb-6">
                    <div className="w-1/2 mb-4">
                        <Logo />
                    </div>
                    <CardTitle className="text-3xl font-headline">Konto erstellen</CardTitle>
                    <CardDescription>Werden Sie Teil unserer Community.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <RegisterForm />
                   <p className="mt-6 text-center text-sm text-muted-foreground">
                    Haben Sie bereits ein Konto?{' '}
                    <Link href="/login" className="font-semibold text-primary hover:underline">
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