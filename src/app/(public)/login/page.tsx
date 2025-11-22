import { LoginForm } from './_components/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen grid place-content-center bg-background">
      <div className="w-full max-w-sm">
        <Card className="shadow-lg border-none">
            <CardHeader className="text-center items-center">
               <div className="w-2/3 mb-4">
                 <Logo />
               </div>
            <CardTitle className="text-3xl">Anmelden</CardTitle>
            <CardDescription>Geben Sie Ihre Daten ein, um sich anzumelden.</CardDescription>
            </CardHeader>
            <CardContent>
            <LoginForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
                Noch kein Konto?{' '}
                <Link href="/register" className="font-semibold text-primary hover:underline">
                Jetzt registrieren
                </Link>
            </p>
            </CardContent>
        </Card>
    </div>
    </div>
  );
}
