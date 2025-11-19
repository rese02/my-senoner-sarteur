'use client';

import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button } from '@/components/ui/button';
import { Camera, X, Loader2 } from 'lucide-react';
import { suggestWinePairing } from '@/ai/flows/suggest-wine-pairing';
import { ProductCard } from '@/app/(customer)/dashboard/_components/ProductCard';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export function SommelierCamera() {
  const webcamRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const { toast } = useToast();

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImage(imageSrc);
      handleAnalysis(imageSrc);
    }
  }, [webcamRef]);

  const handleAnalysis = async (imgSrc: string) => {
    setLoading(true);
    try {
      const results = await suggestWinePairing({ foodPhoto: imgSrc });
      if (results && results.recommendedWines.length > 0) {
        setSuggestions(results.recommendedWines);
      } else {
        toast({
            variant: 'destructive',
            title: "Keine Empfehlungen",
            description: "Die KI konnte keine passenden Weine finden."
        });
      }
    } catch (error) {
      console.error("AI Error", error);
       toast({
            variant: 'destructive',
            title: "Analyse fehlgeschlagen",
            description: "Die KI konnte das Bild nicht analysieren. Bitte versuchen Sie es erneut."
        });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setSuggestions([]);
  }

  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col">
      {/* Header */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-50">
        <h2 className="text-white font-bold text-lg drop-shadow-md font-headline">AI Sommelier</h2>
        <Button variant="ghost" asChild className="text-white hover:bg-white/20 hover:text-white">
          <Link href='/dashboard'>
            <X />
          </Link>
        </Button>
      </div>

      {/* Kamera oder Ergebnis */}
      <div className="flex-grow relative">
        {!image ? (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "environment" }} // Rückkamera
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-slate-900 p-4 pt-20 overflow-y-auto">
            <h3 className="text-white text-2xl mb-6 font-headline">Passende Empfehlungen:</h3>
            <div className="grid gap-6">
              {suggestions.map((wine) => (
                <ProductCard key={wine.id} product={wine} />
              ))}
            </div>
             <Button onClick={reset} className="mt-8 w-full bg-background text-foreground hover:bg-background/80">
                Neuer Scan
            </Button>
          </div>
        )}
        
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
            <p className="text-lg font-medium animate-pulse">Analysiere Aromen...</p>
          </div>
        )}
      </div>

      {/* Auslöser Button (nur sichtbar wenn kein Bild) */}
      {!image && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-8 z-10">
          <button
            onClick={capture}
            className="w-20 h-20 rounded-full border-4 border-white bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            aria-label="Take Photo"
          >
            <div className="w-16 h-16 rounded-full bg-white"></div>
          </button>
        </div>
      )}
    </div>
  );
}
