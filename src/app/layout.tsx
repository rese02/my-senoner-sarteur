
import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/components/providers/LanguageProvider';

export const metadata: Metadata = {
  title: 'My Senoner Sarteur - Premium Supermarkt & Feinkost in Wolkenstein/Selva',
  description: 'Ihr digitaler Begleiter für Lebensmittel in Gröden. Bestellen Sie Südtiroler Spezialitäten, Wein und Feinkost bequem per App. Despar Senoner Sarteur.',
  keywords: ['Supermarkt Wolkenstein', 'Supermercato Selva Val Gardena', 'Grocery store Val Gardena', 'Despar Selva', 'Despar Wolkenstein', 'Senoner Sarteur', 'Lebensmittelgeschäft Gröden', 'Alimentari Val Gardena', 'Supermarket Dolomites', 'Südtiroler Speck kaufen', 'Feinkost Südtirol', 'Prodotti tipici Alto Adige', 'Weinhandlung Wolkenstein', 'Enoteca Selva', 'Lieferservice Lebensmittel Gröden', 'Spesa a domicilio Selva', 'Grocery delivery Val Gardena', 'Online Supermarkt Südtirol'],
  authors: [{ name: 'Senoner Sarteur' }],
  creator: 'Senoner Sarteur',
  publisher: 'Senoner Sarteur',
  robots: 'index, follow',
};

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
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
          ptSans.variable
        )}
      >
        <LanguageProvider>
          <FirebaseClientProvider>
            {children}
          </FirebaseClientProvider>
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
