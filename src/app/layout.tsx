import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'My Senoner Sarteur',
  description: 'Digital companion for customers of Senoner Sarteur supermarket.',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-headline',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-body bg-background text-foreground antialiased',
          inter.variable,
          merriweather.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
