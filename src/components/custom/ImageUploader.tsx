
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
    // Do not clear finalImageUrl immediately, looks better to keep old one until new is ready
    // setFinalImageUrl(null);

    // 1. Compression
    const options = {
      maxSizeMB: 1, // Max size 1MB
      maxWidthOrHeight: 1920, // Max dimensions
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);

      // 2. Upload to Firebase Storage
      const storageRef = ref(storage, `images/${folder}/${Date.now()}_${compressedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          setError('Upload fehlgeschlagen. Bitte versuchen Sie es erneut.');
          setIsUploading(false);
        },
        async () => {
          // 3. Get download URL and send to parent component
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadComplete(downloadURL);
          setFinalImageUrl(downloadURL);
          setIsUploading(false);
           toast({
                title: "Upload erfolgreich!",
                description: "Das Bild wurde hochgeladen und gespeichert.",
            });
        }
      );
    } catch (uploadError) {
      console.error("Compression or upload error:", uploadError);
      setError('Ein Fehler ist aufgetreten.');
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full p-4 border-2 border-dashed border-border rounded-lg text-center bg-secondary/30">
      {/* Hidden input field */}
      <Input
        id="image-upload"
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        onChange={handleImageUpload}
        disabled={isUploading}
      />

      {isUploading && (
        <div className="flex flex-col items-center gap-2 text-sm">
          <p className="font-medium">Lade hoch...</p>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {error && (
        <div className="text-destructive flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {!isUploading && !error && finalImageUrl && (
        <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-md overflow-hidden">
                 <Image src={finalImageUrl} alt="Hochgeladenes Bild" fill sizes="128px" className="object-cover" />
            </div>
             <p className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Upload erfolgreich!
            </p>
        </div>
      )}
      
       {!isUploading && (
         <label htmlFor="image-upload" className="mt-4 inline-block">
             <Button asChild variant={finalImageUrl ? "link" : "outline"} className="cursor-pointer">
                <span>
                 {!finalImageUrl && <UploadCloud className="mr-2" />}
                  {finalImageUrl ? 'Anderes Bild wählen' : 'Bild hochladen'}
                </span>
            </Button>
          </label>
       )}
    </div>
  );
}
