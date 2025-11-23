import { RegisterForm } from './_components/register-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  return (
    <div className="w-full min-h-[100dvh] md:flex md:items-center md:justify-center md:bg-primary md:p-4">
      {/* Desktop View */}
      <Card className="hidden md:flex flex-col justify-center shadow-lg border-none rounded-xl md:min-h-0 md:h-auto md:max-w-sm overflow-hidden">
          <CardHeader className="text-center items-center bg-primary text-primary-foreground pt-12 pb-8">
              <div className="w-1/2 mb-6">
                <Logo />
            </div>
            <CardTitle className="text-2xl text-primary-foreground">Konto erstellen</CardTitle>
            <CardDescription className="text-primary-foreground/80">Werden Sie Teil unserer Community.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <RegisterForm />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Haben Sie bereits ein Konto?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Hier anmelden
              </Link>
            </p>
          </CardContent>
        </Card>

      {/* Mobile View */}
      <div className="md:hidden w-full h-[100dvh] flex flex-col bg-slate-900">
        <div className="relative flex-grow h-1/3 flex flex-col items-center justify-center pt-12 px-4 text-center">
            <Image 
                src="https://images.unsplash.com/photo-1542856336-074a3f8c88e9?q=80&w=1974&auto=format&fit=crop"
                alt="Dolomites background"
                fill
                className="object-cover"
                data-ai-hint="dolomites mountains"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>

            <div className="relative z-10 flex flex-col items-center justify-end h-full w-full pb-8">
                <div className="w-2/5 mb-4">
                    <Logo />
                </div>
            </div>
        </div>
        <div className="flex-shrink-0 bg-background rounded-t-3xl p-6 pt-8 -mt-6 z-20">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold font-headline">Neues Konto</h1>
                <p className="text-muted-foreground text-sm">Erstellen Sie jetzt Ihr Kundenkonto.</p>
            </div>
            <RegisterForm />
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Haben Sie bereits ein Konto?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Hier anmelden
              </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
