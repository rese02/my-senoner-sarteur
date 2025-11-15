import Image from 'next/image';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <svg
        className="h-8 w-8 text-primary"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m3 11 18-5v12L3 14V5Z" />
        <path d="m21 16-7-4" />
        <path d="m3 5 7 4" />
        <path d="M12 12 3 7" />
        <path d="M12 12 21 7" />
      </svg>
      <span className="text-xl font-semibold font-headline text-primary">
        Senoner Sarteur
      </span>
    </Link>
  );
}
