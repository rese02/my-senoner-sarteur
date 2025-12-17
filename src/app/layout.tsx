
import type { Metadata } from 'next';
import { PT_Sans, Playfair_Display } from 'next/font/google';
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

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-body',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-headline',
});

// JSON-LD Schema for Local Business SEO
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Supermarket',
  name: 'My Senoner Sarteur',
  description: 'Ihr Premium Supermarkt & Feinkost-Geschäft in Wolkenstein, Gröden. Bestellen Sie online Südtiroler Spezialitäten, Wein, Speck und mehr.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Meisulesstraße 111',
    addressLocality: 'Wolkenstein in Gröden',
    addressRegion: 'BZ',
    postalCode: '39048',
    addressCountry: 'IT'
  },
  telephone: '+39-0471-795128',
  url: 'https://www.senoner-sarteur.it', // Replace with the actual production URL when live
  image: '/logo.png',
  openingHours: 'Mo-Sa 07:30-12:30, 15:30-19:00',
  keywords: 'Supermarkt, Supermercato, Wolkenstein, Selva Val Gardena, Feinkost, Wein, Speck, Lieferservice, spesa a domicilio, Despar'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
         <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
      </head>
      <body
        className={cn(
          'font-body antialiased',
          ptSans.variable,
          playfair.variable
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
