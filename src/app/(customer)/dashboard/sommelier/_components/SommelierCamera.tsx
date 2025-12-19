
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Camera, X, Loader2, Sparkles, FileWarning, Info, Wand2 } from 'lucide-react';
import { suggestWinePairing } from '@/app/actions/sommelier.actions';
import { ProductCard } from '@/components/custom/ProductCard';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function SommelierCamera() {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [food, setFood] = useState<string>('');
  const { toast } = useToast();

   useEffect(() => {
    // Vibrieren beim Laden der Komponente, um anzuzeigen, dass die Kamera bereit ist
    if (typeof window.navigator.vibrate === 'function') {
      window.navigator.vibrate(100);
    }
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      if (typeof window.navigator.vibrate === 'function') {
        window.navigator.vibrate(50);
      }
      setImage(imageSrc);
      handleAnalysis(imageSrc);
    }
  }, [webcamRef]); // Add webcamRef to dependencies

  const handleAnalysis = async (imgSrc: string) => {
    setLoading(true);
    setSuggestions([]);
    setFood('');
    try {
      // The server action handles the AI call. The image data (imgSrc)
      // is sent to the server, used for the AI analysis, and then discarded.
      // It is never saved to any database or file storage.
      const results = await suggestWinePairing({ foodPhoto: imgSrc });
      
      if (results && results.recommendedWines && results.recommendedWines.length > 0) {
        setSuggestions(results.recommendedWines);
        setFood(results.foodDetected);
      } else {
        toast({
            variant: 'destructive',
            title: "Keine Empfehlungen",
            description: "Die KI konnte keine passenden Weine in unserem Katalog finden."
        });
        setTimeout(() => reset(), 2000);
      }
    } catch (error: any) {
      console.error("AI Sommelier Error:", error);
       toast({
            variant: 'destructive',
            title: "Analyse fehlgeschlagen",
            description: error.message || "Die KI konnte das Bild nicht analysieren. Bitte versuchen Sie es erneut."
        });
      reset();
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    // This function clears all client-side state, effectively
    // "deleting" the image from the user's device memory.
    setImage(null);
    setSuggestions([]);
    setFood('');
  }

  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/50 to-transparent">
        <h2 className="text-white font-bold text-lg drop-shadow-md font-headline flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-primary" /> KI Sommelier
        </h2>
        <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/20 hover:text-white rounded-full">
          <Link href='/dashboard'>
            <X />
          </Link>
        </Button>
      </div>

      {/* Kamera oder Ergebnis */}
      <div className="flex-grow relative">
        {!image ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "environment" }} // Rückkamera
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="h-full w-full bg-background p-4 pt-24 overflow-y-auto">
             <div className="text-center mb-6">
                <p className="text-muted-foreground">Erkanntes Gericht:</p>
                <h3 className="text-foreground text-2xl font-bold font-headline">{food}</h3>
                <p className="text-muted-foreground mt-1">Passende Weinempfehlungen:</p>
            </div>
            <div className="grid gap-6">
              {suggestions.map((wine) => (
                <ProductCard key={wine.id} product={wine} />
              ))}
            </div>
             <Alert variant="default" className="mt-6 text-xs text-muted-foreground">
                <FileWarning className="h-4 w-4" />
                <AlertTitle className="font-bold">KI-Vorschlag</AlertTitle>
                <AlertDescription>
                   Dieser Vorschlag basiert auf künstlicher Intelligenz und kann Fehler enthalten. Prüfen Sie Allergene stets auf der Verpackung.
                </AlertDescription>
            </Alert>
             <Button onClick={reset} className="mt-4 w-full">
                Neuen Scan starten
            </Button>
          </div>
        )}
        
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
            <p className="text-lg font-medium animate-pulse">Analysiere Aromen...</p>
            <p className="text-sm text-white/70 mt-2">Ihre Aufnahme wird von einem KI-Dienst verarbeitet, um passende Weine vorzuschlagen.</p>
          </div>
        )}
      </div>

      {/* Auslöser Button (nur sichtbar wenn kein Bild) */}
      {!image && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center p-6 bg-gradient-to-t from-black/60 to-transparent">
          <button
            onClick={capture}
            className="w-20 h-20 rounded-full border-4 border-white bg-white/30 backdrop-blur-sm flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            aria-label="Take Photo"
          >
            <div className="w-16 h-16 rounded-full bg-white"></div>
          </button>
        </div>
      )}
    </div>
  );
}
