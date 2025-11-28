import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Funktion, um Initialen aus dem Namen zu generieren
export const getInitials = (name: string) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

// Diese Funktion macht Firebase-Daten "browser-freundlich"
export function toPlainObject<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }
  // This is a simplified serialization. For a more robust solution,
  // you might recursively check for Timestamps and convert them.
  // However, for many use cases, JSON.stringify/parse is sufficient.
  return JSON.parse(JSON.stringify(data));
}
