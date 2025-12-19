
import type { Metadata } from 'next';
import { Lato, Merriweather } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'My Senoner Sarteur - Premium Supermarkt & Feinkost in Wolkenstein/Selva',
  description: 'Ihr digitaler Begleiter für Lebensmittel in Gröden. Bestellen Sie Südtiroler Spezialitäten, Wein und Feinkost bequem per App. Despar Senoner Sarteur.',
  keywords: ['Supermarkt Wolkenstein', 'Supermercato Selva Val Gardena', 'Grocery store Val Gardena', 'Despar Selva', 'Despar Wolkenstein', 'Senoner Sarteur', 'Lebensmittelgeschäft Gröden', 'Alimentari Val Gardena', 'Supermarket Dolomites', 'Südtiroler Speck kaufen', 'Feinkost Südtirol', 'Prodotti tipici Alto Adige', 'Weinhandlung Wolkenstein', 'Enoteca Selva', 'Lieferservice Lebensmittel Gröden', 'Spesa a domicilio Selva', 'Grocery delivery Val Gardena', 'Online Supermarkt Südtirol'],
  authors: [{ name: 'Senoner Sarteur' }],
  creator: 'Senoner Sarteur',
  publisher: 'Senoner Sarteur',
  robots: 'index, follow',
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-body',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-headline',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
      </head>
      <body
        className={cn(
          'font-body antialiased',
          lato.variable,
          merriweather.variable
        )}
      >
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
