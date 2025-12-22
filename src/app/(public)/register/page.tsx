
'use client';

import { RegisterForm } from './_components/register-form';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function RegisterPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-background p-4">
        <div className="relative z-10 max-w-md w-full my-8">
             <Card className="shadow-2xl border">
                <CardContent className="p-8 md:p-10 space-y-6">
                    <div className="text-center items-center">
                        <div className="h-24 mb-4 inline-block">
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
                         <div className="w-48 my-4">
                           <LanguageSwitcher />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
