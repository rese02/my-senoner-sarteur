import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string}) {
  return (
    <Link href="/" className={cn("flex items-center justify-center gap-2 h-full", className)}>
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
