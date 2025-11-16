import type { Metadata } from 'next';
import { Lato, Merriweather } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'My Senoner Sarteur',
  description: 'Digital companion for customers of Senoner Sarteur supermarket.',
};

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather',
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
          lato.variable,
          merriweather.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
