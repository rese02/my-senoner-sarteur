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
  return JSON.parse(JSON.stringify(data));
}
