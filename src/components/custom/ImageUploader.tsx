
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import imageCompression from 'browser-image-compression';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useStorage } from '@/firebase/provider';


// This component receives a function to send the final URL to the parent component
interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
  currentImageUrl?: string | null; // Optional, to show an existing image
  folder: string; // e.g. 'products' or 'recipes'
}

export function ImageUploader({ onUploadComplete, currentImageUrl, folder }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(currentImageUrl || null);
  const { toast } = useToast();
  const storage = useStorage(); // Use the hook to get storage instance

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset state for new upload
    setIsUploading(true);
    setError(null);
    setProgress(0);

    const options = {
      maxSizeMB: 0.5, // Compress to max 500KB
      maxWidthOrHeight: 1280, // Resize to max 1280px
      useWebWorker: true,
      initialQuality: 0.7, // Start with a quality of 70%
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const storageRef = ref(storage, `images/${folder}/${Date.now()}_${compressedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error("Firebase Upload Error:", error);
          setError('Upload fehlgeschlagen. Bitte versuchen Sie es erneut.');
          setIsUploading(false);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onUploadComplete(downloadURL);
            setFinalImageUrl(downloadURL);
            setIsUploading(false);
            toast({
                  title: "Upload erfolgreich!",
                  description: "Das komprimierte Bild wurde gespeichert.",
              });
          } catch(downloadError) {
              console.error("Firebase Get URL Error:", downloadError);
              setError('Fehler beim Abrufen der Bild-URL.');
              setIsUploading(false);
          }
        }
      );
    } catch (compressionError) {
      console.error("Image Compression Error:", compressionError);
      setError('Ein Fehler ist bei der Bildkomprimierung aufgetreten.');
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <Input
        id={`image-upload-${folder}`}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleImageUpload}
        disabled={isUploading}
      />

      {finalImageUrl && !isUploading && (
        <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden mb-2 border">
          <Image src={finalImageUrl} alt="Hochgeladenes Bild" fill sizes="(max-width: 640px) 90vw, 500px" className="object-cover" />
        </div>
      )}

      {isUploading && (
        <div className="flex flex-col items-center gap-2 text-sm p-4 bg-secondary rounded-lg">
          <p className="font-medium">Komprimiere & lade hoch...</p>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {error && (
        <div className="text-destructive flex items-center justify-center gap-2 p-4 bg-destructive/10 rounded-lg">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <label htmlFor={`image-upload-${folder}`} className="mt-2 w-full">
         <Button asChild variant={finalImageUrl ? "outline" : "default"} className="cursor-pointer w-full">
            <span>
             {!finalImageUrl && <UploadCloud className="mr-2 h-4 w-4" />}
              {finalImageUrl ? 'Anderes Bild wählen' : 'Bild hochladen'}
            </span>
        </Button>
      </label>
    </div>
  );
}
