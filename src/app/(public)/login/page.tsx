import { LoginForm } from './_components/login-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/common/Logo';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-background">
      {/* Linke, helle Aktions-Säule */}
      <div className="flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-sm">
            <Card className="shadow-lg border-none">
                <CardHeader className="text-center">
                <CardTitle className="text-3xl">Willkommen zurück</CardTitle>
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

       {/* Rechte Marken-Säule - Wird auf mobilen Geräten ausgeblendet */}
      <div className="hidden bg-primary lg:flex items-center justify-center relative p-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579541626635-4a88c7b415a7?q=80&w=1974&auto=format&fit=crop')" }}
        />

        <div className="relative z-10 w-1/3">
          <Logo />
        </div>
      </div>
    </div>
  );
}
