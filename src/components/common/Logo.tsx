import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string}) {
  return (
    <Link href="/" className={cn("flex items-center justify-center h-full", className)}>
      <Image 
        src="/logo.png"
        alt="Senoner Sarteur Logo" 
        width={140}
        height={30}
        className="object-contain h-full w-auto"
        priority
      />
    </Link>
  );
}
