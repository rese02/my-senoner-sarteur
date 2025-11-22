import { RegisterForm } from './_components/register-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="w-full md:min-h-screen md:flex md:items-center md:justify-center md:bg-background md:py-12 md:px-4">
        <Card className="w-full h-full min-h-screen flex flex-col justify-center shadow-none md:shadow-lg border-none rounded-none md:rounded-2xl md:min-h-0 md:h-auto md:max-w-sm">
          <CardHeader className="text-center pt-12 md:pt-6 items-center">
              <div className="mx-auto w-2/3 mb-8">
                <Logo />
            </div>
            <CardTitle className="text-3xl">Konto erstellen</CardTitle>
            <CardDescription>Werden Sie Teil unserer Community und genießen Sie die Vorteile.</CardDescription>
          </CardHeader>
          <CardContent>
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
  );
}
