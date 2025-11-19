'use server';

/**
 * @fileOverview An AI flow to suggest wine pairings for a given food image.
 * 
 * - suggestWinePairing - A function that takes a food photo and returns wine recommendations.
 * - SuggestWinePairingInput - The input type for the suggestWinePairing function.
 * - SuggestWinePairingOutput - The return type for the suggestWinePairing function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/lib/types';


// Define input and output schemas with Zod
const SuggestWinePairingInputSchema = z.object({
  foodPhoto: z.string().describe("A photo of a food dish as a data URI. Expected format: 'data:image/jpeg;base64,<encoded_data>'"),
});
export type SuggestWinePairingInput = z.infer<typeof SuggestWinePairingInputSchema>;

const SuggestWinePairingOutputSchema = z.object({
  foodDetected: z.string().describe('The name of the food detected in the image.'),
  recommendedWines: z.array(z.any()).describe('An array of recommended wine products.'),
});
export type SuggestWinePairingOutput = z.infer<typeof SuggestWinePairingOutputSchema>;


// The main function exported to the application
export async function suggestWinePairing(input: SuggestWinePairingInput): Promise<SuggestWinePairingOutput> {
  return suggestWinePairingFlow(input);
}


// Define the Genkit Flow
const suggestWinePairingFlow = ai.defineFlow(
  {
    name: 'suggestWinePairingFlow',
    inputSchema: SuggestWinePairingInputSchema,
    outputSchema: SuggestWinePairingOutputSchema,
  },
  async (input) => {
    // 1. Get all available wines from our mock data
    const wineInventory: Product[] = mockProducts.filter(p => p.categoryId === 'cat-3'); // Assuming cat-3 is 'Weine'

    // This is a simplified representation of the inventory for the prompt.
    const wineInventoryForPrompt = wineInventory.map(wine => ({
        id: wine.id,
        name: wine.name,
        description: `Price: €${wine.price}, Unit: ${wine.unit}` // Keep it concise
    }));

    // 2. Define the AI prompt using the Genkit prompt helper
    const prompt = ai.definePrompt({
        name: 'wineSuggestionPrompt',
        prompt: `Du bist ein Weltklasse-Sommelier für Senoner Sarteur in den Dolomiten.
        Deine Aufgabe:
        1. Erkenne das Essen auf dem Bild.
        2. Wähle aus dem folgenden Inventar bis zu 3 Weine aus, die perfekt dazu passen.
        
        Inventar: ${JSON.stringify(wineInventoryForPrompt)}
        
        Antworte NUR im JSON-Format: { "foodDetected": "Name des Essens", "recommendedWineIds": ["id1", "id2", "id3"] }`,
        input: {
            schema: z.object({
                foodPhoto: z.string(),
            }),
        },
        output: {
            schema: z.object({
                foodDetected: z.string(),
                recommendedWineIds: z.array(z.string()),
            }),
        },
        config: {
            model: 'googleai/gemini-2.5-flash',
        }
    });

    // 3. Execute the prompt with the user's image
    const { output } = await prompt({
        foodPhoto: input.foodPhoto
    }, {
        // Pass the image as media to the model
        media: [{ url: input.foodPhoto }]
    });

    if (!output || !output.recommendedWineIds) {
        throw new Error('AI did not return valid recommendations.');
    }

    // 4. Retrieve the full product details for the recommended wine IDs
    const recommendedWines = wineInventory.filter(wine =>
      output.recommendedWineIds.includes(wine.id)
    );
    
    // 5. Return the final, structured output
    return {
      foodDetected: output.foodDetected,
      recommendedWines: recommendedWines,
    };
  }
);
