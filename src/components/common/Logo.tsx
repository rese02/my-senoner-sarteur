import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Logo() {
  const logoImage = PlaceHolderImages.find(p => p.id === 'logo')!;

  return (
    <Link href="/" className="flex items-center justify-center gap-2 h-full">
      {/* The logo is now loaded from the placeholder data. */}
      <Image 
        src={logoImage.imageUrl} 
        alt="Senoner Sarteur Logo" 
        width={432}
        height={96}
        className="object-contain h-full w-auto"
        priority
        data-ai-hint={logoImage.imageHint}
      />
    </Link>
  );
}
