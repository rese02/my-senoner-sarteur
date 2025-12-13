'use server';

import 'server-only';
import { suggestWinePairing } from '@/ai/flows/suggest-wine-pairing';
import type { SuggestWinePairingInput, SuggestWinePairingOutput } from '@/ai/flows/suggest-wine-pairing';
import { getSession } from '@/lib/session';

/**
 * A dedicated server action that acts as a safe bridge between the client
 * and the complex Genkit flow. This prevents server-only modules from
 * being bundled into the client-side code.
 * @param input The image data for the wine pairing suggestion.
 * @returns The AI's suggestion for food and recommended wines.
 */
export async function getWineSuggestion(input: SuggestWinePairingInput): Promise<SuggestWinePairingOutput> {
  const session = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  
  // This function is now the only one that calls the flow from the server-side.
  // It provides a layer of abstraction and security.
  return suggestWinePairing(input);
}
