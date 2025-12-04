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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}


// This function safely serializes data from the server, converting complex
// objects like Firestore Timestamps into a format the client can understand.
export function toPlainObject<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle Dates, Firestore Timestamps (which have toDate method), etc.
  if (typeof (data as any).toDate === 'function') {
    return (data as any).toDate().toISOString();
  }

  if (data instanceof Date) {
    return data.toISOString() as unknown as T;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map(item => toPlainObject(item)) as unknown as T;
  }

  // Handle plain objects
  if (isPlainObject(data)) {
    const obj = data as Record<string, unknown>;
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = toPlainObject(obj[key]);
      return acc;
    }, {} as Record<string, unknown>) as T;
  }

  // Return primitives and other types as is
  return data;
}