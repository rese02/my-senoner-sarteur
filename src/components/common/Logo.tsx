import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center justify-center gap-2 h-full">
      {/* Use the external placeholder logo and add remote pattern to next.config.mjs */}
      <Image 
        src="https://placehold.co/432x96/FFFFFF/0d1a2e/png?text=Senoner+Sarteur" 
        alt="Senoner Sarteur Logo" 
        width={432}
        height={96}
        className="object-contain h-full w-auto"
        priority
      />
    </Link>
  );
}
