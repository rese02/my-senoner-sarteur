
'use client'; // Error components must be Client Components
 
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
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
 
  return (
    <div className="p-8 bg-destructive/10 rounded-lg border border-destructive/20 text-center">
      <h2 className="text-2xl font-bold text-destructive">Ein Fehler ist im Admin-Bereich aufgetreten!</h2>
      <p className="mt-2 text-destructive/80">
        Diese Komponente konnte nicht korrekt geladen werden.
      </p>
      <Button
        variant="destructive"
        className="mt-6"
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Erneut versuchen
      </Button>
    </div>
  );
}
