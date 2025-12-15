
import { LoginForm } from './_components/login-form';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-secondary p-0 md:p-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-5 bg-repeat"></div>
        <div className="relative z-10 w-full md:max-w-sm">
            <Card className="flex flex-col justify-center shadow-2xl border-none rounded-none md:rounded-2xl bg-primary text-primary-foreground min-h-[100dvh] md:min-h-0 overflow-hidden">
                <CardContent className="flex flex-col items-center justify-center text-center p-8 md:p-10 w-full">
                    <div className="h-12 mb-6">
                        <Link href="/">
                            <Image src="/logo.png" alt="Senoner Sarteur Logo" width={160} height={40} className="h-full w-auto object-contain" />
                        </Link>
                    </div>
                    <CardTitle className="text-3xl font-headline text-primary-foreground mb-6">Willkommen zurück</CardTitle>
                    
                    <div className="w-full mb-8">
                      <LoginForm />
                    </div>

                    <div className="flex flex-col items-center gap-4 text-sm text-primary-foreground/80">
                         <p>
                            Noch kein Konto?{' '}
                            <Link href="/register" className="font-semibold text-primary-foreground hover:underline">
                                Jetzt registrieren
                            </Link>
                        </p>
                        <div className="flex justify-center gap-4 text-xs">
                            <Link href="/impressum" className="hover:text-primary-foreground">Impressum</Link>
                            <Link href="/datenschutz" className="hover:text-primary-foreground">Datenschutz</Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
