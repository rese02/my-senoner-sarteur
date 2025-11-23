import { RegisterForm } from './_components/register-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="w-full md:min-h-screen md:flex md:items-center md:justify-center md:bg-background md:py-8 md:px-4">
        <Card className="w-full h-full min-h-[100dvh] flex flex-col justify-center shadow-none md:shadow-lg border-none rounded-none md:rounded-xl md:min-h-0 md:h-auto md:max-w-sm overflow-hidden">
          <CardHeader className="text-center items-center bg-primary text-primary-foreground pt-12 pb-8">
              <div className="mx-auto w-2/3 mb-6">
                <Logo />
            </div>
            <CardTitle className="text-2xl">Konto erstellen</CardTitle>
            <CardDescription className="text-primary-foreground/80">Werden Sie Teil unserer Community.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <RegisterForm />
            <p className="mt-4 text-center text-sm text-muted-foreground">
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
