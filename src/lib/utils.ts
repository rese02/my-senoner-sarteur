import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Language, MultilingualText } from "./translations"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getEmptyMultilingualText(): MultilingualText {
    return { de: '', it: '', en: '' };
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

/**
 * Retrieves the correct string from a multilingual object based on the current language.
 * Ensures that it always returns a string, even if the field is missing or not an object.
 * @param field The object containing language keys (e.g., { de: "Apfel", it: "Mela" }) or a simple string/undefined.
 * @param lang The current language ('de', 'it', or 'en').
 * @returns The translated string or a fallback.
 */
export function getLang(field: unknown, lang: Language): string {
    if (!field) {
        return "";
    }
    // Handle legacy simple string fields gracefully
    if (typeof field === 'string') {
        return field;
    }
    if (typeof field === 'object' && field !== null) {
        const mlText = field as MultilingualText;
        // Fallback chain: Current Lang -> German -> Italian -> English -> first available -> empty string.
        return mlText[lang] || mlText.de || mlText.it || mlText.en || '';
    }
    // Default fallback for other types
    return "";
}

/**
 * Ensures that a given field is a valid MultilingualText object.
 * If it's a string, it converts it. If it's null/undefined, it returns an empty object.
 * @param field The field to sanitize.
 * @returns A valid MultilingualText object.
 */
export function sanitizeMultilingualText(field: unknown): MultilingualText {
  if (typeof field === 'object' && field !== null && 'de' in field && 'it' in field && 'en' in field) {
    return field as MultilingualText;
  }
  if (typeof field === 'string') {
    // If we get a simple string, assume it's German as a fallback.
    return { de: field, it: field, en: field };
  }
  return getEmptyMultilingualText();
}
