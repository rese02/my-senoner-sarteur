import { LoginForm } from './_components/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="w-full min-h-[100dvh] flex items-center justify-center bg-[#0d1a2e] p-4 relative overflow-hidden">

        {/* Background Illustrations */}
        <div className="absolute inset-0 z-0 opacity-10 bg-repeat" style={{ backgroundImage: "url('/background-pattern.svg')" }}></div>

        <div className="relative z-10 grid md:grid-cols-2 max-w-6xl w-full items-center">
            {/* Left Side: Login Form */}
            <div className="flex justify-center">
                <Card className="flex flex-col justify-center shadow-2xl border-none rounded-2xl w-full max-w-md bg-card/95 backdrop-blur-sm">
                    <CardHeader className="text-center items-center pt-10 pb-6">
                        <div className="w-1/2 mb-4">
                            <Logo />
                        </div>
                        <CardTitle className="text-3xl font-headline">Anmelden</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <LoginForm />
                        <div className="mt-6 text-center text-sm space-y-2 text-muted-foreground">
                            <p>
                                <Link href="#" className="font-medium hover:text-primary hover:underline">
                                    Passwort vergessen?
                                </Link>
                            </p>
                            <p>
                                Noch kein Konto?{' '}
                                <Link href="/register" className="font-semibold text-primary hover:underline">
                                    Jetzt registrieren
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            
            {/* Right Side: Hidden on mobile */}
            <div className="hidden md:block">
                {/* This div is intentionally empty, the background is handled by the parent container */}
            </div>
        </div>

        {/* Footer links */}
        <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-6 text-xs text-white/50">
             <Link href="/impressum" className="hover:text-white">Impressum</Link>
             <Link href="/datenschutz" className="hover:text-white">Datenschutz</Link>
        </div>
    </div>
  );
}
