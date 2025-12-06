import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center justify-center gap-2 h-full">
      <Image 
        src="/logo.png"
        alt="Senoner Sarteur Logo" 
        width={432}
        height={96}
        className="object-contain h-full w-auto"
        priority
      />
    </Link>
  );
}
