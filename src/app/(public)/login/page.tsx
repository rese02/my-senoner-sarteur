
import { LoginForm } from './_components/login-form';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/common/Logo';

export default async function LoginPage() {
  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-background p-4">
        <div className="relative z-10 w-full max-w-sm">
            <Card className="shadow-2xl border">
                <CardContent className="flex flex-col items-center justify-center text-center p-8 md:p-10 w-full">
                    <div className="h-12 mb-8">
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
                        <div className="flex justify-center gap-4 text-xs">
                            <Link href="/impressum" className="hover:text-primary">Impressum</Link>
                            <Link href="/datenschutz" className="hover:text-primary">Datenschutz</Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
