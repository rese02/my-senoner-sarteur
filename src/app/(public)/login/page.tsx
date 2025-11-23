import { LoginForm } from './_components/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="w-full min-h-[100dvh] md:flex md:items-center md:justify-center md:bg-primary md:p-4">
      {/* Desktop View */}
      <Card className="hidden md:flex flex-col justify-center shadow-lg border-none rounded-xl md:min-h-0 md:h-auto md:max-w-sm overflow-hidden">
          <CardHeader className="text-center items-center bg-primary text-primary-foreground pt-12 pb-8">
              <div className="w-1/2 mb-4">
                <Logo />
              </div>
          <CardTitle className="text-2xl text-primary-foreground">Anmelden</CardTitle>
          <CardDescription className="text-primary-foreground/80">Geben Sie Ihre Daten ein, um sich anzumelden.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <LoginForm />
            <p className="mt-4 text-center text-sm text-muted-foreground">
                Noch kein Konto?{' '}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                Jetzt registrieren
                </Link>
            </p>
          </CardContent>
      </Card>

      {/* Mobile View */}
       <div className="md:hidden w-full h-[100dvh] flex flex-col bg-gradient-to-b from-[#001a3b] via-[#003366] to-primary">
        <div className="flex-grow flex flex-col items-center justify-center pt-12 px-4 text-center">
            <div className="w-2/5">
                <Logo />
            </div>
        </div>
        <div className="flex-shrink-0 bg-background rounded-t-3xl p-6 pt-8 z-10">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold font-headline">Willkommen!</h1>
                <p className="text-muted-foreground text-sm">Bitte melden Sie sich an.</p>
            </div>
            <LoginForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Noch kein Konto?{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline">
              Jetzt registrieren
              </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
