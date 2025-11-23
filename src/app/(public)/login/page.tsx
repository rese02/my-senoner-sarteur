import { LoginForm } from './_components/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="w-full md:min-h-screen md:flex md:items-center md:justify-center md:bg-background md:p-4">
      <Card className="w-full h-full min-h-[100dvh] flex flex-col justify-center shadow-none md:shadow-lg border-none rounded-none md:rounded-xl md:min-h-0 md:h-auto md:max-w-sm">
          <CardHeader className="text-center items-center">
              <div className="w-2/3 mb-4">
                <Logo />
              </div>
          <CardTitle className="text-2xl">Anmelden</CardTitle>
          <CardDescription>Geben Sie Ihre Daten ein, um sich anzumelden.</CardDescription>
          </CardHeader>
          <CardContent>
          <LoginForm />
          <p className="mt-4 text-center text-sm text-muted-foreground">
              Noch kein Konto?{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline">
              Jetzt registrieren
              </Link>
          </p>
          </CardContent>
      </Card>
    </div>
  );
}
