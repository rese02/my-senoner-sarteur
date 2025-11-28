'use client'; // Fehler-Komponenten müssen Client Components sein

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Logge den Fehler in die Konsole
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4 text-center bg-background">
      <div className="bg-card p-8 rounded-xl shadow-lg border max-w-md w-full">
        <h2 className="text-2xl font-bold text-destructive">Ups! Etwas ist schiefgelaufen.</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Ein unerwarteter Fehler ist aufgetreten. Unsere Techniker wurden informiert.
        </p>
        <Button
          onClick={() => reset()}
        >
          Erneut versuchen
        </Button>
        <details className="text-xs text-muted-foreground mt-6 text-left bg-secondary p-2 rounded-md">
            <summary className="cursor-pointer">Technische Details</summary>
            <p className="mt-2 font-mono break-all">{error.message}</p>
        </details>
      </div>
    </div>
  );
}
