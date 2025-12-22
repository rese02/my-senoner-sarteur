
'use client';

import { LoginForm } from './_components/login-form';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/components/providers/LanguageProvider';

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-background p-4">
        <div className="relative z-10 w-full max-w-sm">
            <Card className="shadow-2xl border">
                <CardContent className="flex flex-col items-center justify-center text-center p-8 md:p-10 w-full">
                    <div className="h-24 mb-8">
                       <Logo />
                    </div>
                    
                    <div className="w-full mb-8">
                      <LoginForm />
                    </div>

                    <div className="flex flex-col items-center gap-4 text-sm text-muted-foreground">
                         <p>
                            Noch kein Konto?{' '}
                            <Link href="/register" className="font-semibold text-primary hover:underline">
                                Jetzt registrieren
                            </Link>
                        </p>
                        <div className="w-48 my-4">
                           <LanguageSwitcher />
                        </div>
                        <div className="flex justify-center gap-4 text-xs">
                            <Link href="/impressum" className="hover:text-primary">{t.common.impressum}</Link>
                            <Link href="/datenschutz" className="hover:text-primary">{t.common.privacy}</Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
