import { RegisterForm } from './_components/register-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-background md:py-12 md:px-4">
       <div className="w-full max-w-md h-full md:h-auto flex flex-col justify-center">
          <Card className="shadow-none md:shadow-lg border-none rounded-none md:rounded-2xl flex-grow md:flex-grow-0 flex flex-col justify-center">
            <CardHeader className="text-center pt-12 md:pt-6">
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
    </div>
  );
}
