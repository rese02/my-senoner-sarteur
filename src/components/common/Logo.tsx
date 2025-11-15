import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      {/* The logo is loaded from the /public folder. 
          Replace /logo.png with your actual logo file.
          The recommended size is 144x32px. */}
      <Image 
        src="/logo.png" 
        alt="Senoner Sarteur Logo" 
        width={144} 
        height={32} 
        className="object-contain"
      />
    </Link>
  );
}
