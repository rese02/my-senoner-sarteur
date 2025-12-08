'use server';

import { suggestWinePairing } from '@/ai/flows/suggest-wine-pairing';
import type { SuggestWinePairingInput, SuggestWinePairingOutput } from '@/ai/flows/suggest-wine-pairing';

/**
 * A dedicated server action that acts as a safe bridge between the client
 * and the complex Genkit flow. This prevents server-only modules from
 * being bundled into the client-side code.
 * @param input The image data for the wine pairing suggestion.
 * @returns The AI's suggestion for food and recommended wines.
 */
export async function getWineSuggestion(input: SuggestWinePairingInput): Promise<SuggestWinePairingOutput> {
  // This function is now the only one that calls the flow from the server-side.
  return suggestWinePairing(input);
}
