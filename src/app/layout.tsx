import type { Metadata } from 'next';
import { PT_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export const metadata: Metadata = {
  title: 'My Senoner Sarteur | Ihr Supermarkt in Südtirol für Feinkost & Wein',
  description: 'Entdecken Sie Senoner Sarteur in Wolkenstein, Gröden. Ihr Supermarkt in Südtirol für exklusive Feinkost, erlesenen Wein und digitale Services wie Click & Collect.',
  keywords: ['Supermarkt', 'Südtirol', 'Wein', 'Feinkost', 'Wolkenstein', 'Gröden', 'Val Gardena', 'Lebensmittel', 'Click & Collect', 'Senoner Sarteur'],
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
  name: 'Senoner Sarteur',
  description: 'Exklusive Feinkost, Wein und Lebensmittel in Wolkenstein, Gröden (Südtirol).',
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
  image: '/logo.png', // A representative image
  openingHours: 'Mo-Sa 07:30-12:30, 15:30-19:00', // Example, adjust as needed
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
