
import { LoginForm } from './_components/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-secondary md:p-4 relative overflow-hidden">

        <div className="absolute inset-0 z-0 opacity-5 bg-repeat" style={{ backgroundImage: "url('/background-pattern.svg')" }}></div>

        <div className="relative z-10 w-full md:max-w-sm">
            <Card className="flex flex-col justify-center shadow-2xl border-none rounded-none md:rounded-2xl bg-primary text-primary-foreground min-h-[100dvh] md:min-h-0">
                <CardHeader className="text-center items-center pt-10 pb-6">
                    <div className="h-12 mb-4">
                        <Logo />
                    </div>
                    <CardTitle className="text-3xl font-headline text-primary-foreground">Willkommen zurück</CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0">
                    <LoginForm />
                </CardContent>
            </Card>

             <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>
                    Noch kein Konto?{' '}
                    <Link href="/register" className="font-semibold text-primary hover:underline">
                        Jetzt registrieren
                    </Link>
                </p>
            </div>
        </div>

        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-6 text-xs text-muted-foreground">
             <Link href="/impressum" className="hover:text-primary">Impressum</Link>
             <Link href="/datenschutz" className="hover:text-primary">Datenschutz</Link>
         </div>
    </div>
  );
}
