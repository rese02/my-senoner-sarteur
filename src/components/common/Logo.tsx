import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center justify-center gap-2">
      {/* The logo is loaded from the /public folder. 
          Replace /logo.png with your actual logo file. */}
      <Image 
        src="/logo.png" 
        alt="Senoner Sarteur Logo" 
        width={432}
        height={96}
        className="object-contain h-24 w-auto"
        priority
      />
    </Link>
  );
}
