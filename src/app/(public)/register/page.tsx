import { RegisterForm } from './_components/register-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-background">
       {/* Linke Marken-Säule - Wird auf mobilen Geräten ausgeblendet */}
      <div className="hidden bg-primary lg:flex items-center justify-center relative p-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579541626635-4a88c7b415a7?q=80&w=1974&auto=format&fit=crop')" }}
        />
        <div className="relative z-10 w-1/3">
          <Logo />
        </div>
      </div>
      
       {/* Rechte, helle Aktions-Säule */}
      <div className="flex items-center justify-center py-12 px-4">
         <div className="w-full max-w-md">
            <div className="mx-auto w-2/3 mb-8">
                <Logo />
            </div>
            <Card className="shadow-lg border-none">
              <CardHeader className="text-center">
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
    </div>
  );
}
