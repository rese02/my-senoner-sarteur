'use server';
/**
 * @fileOverview This file defines a Genkit flow to enrich a list of wine names with metadata.
 *
 * - enrichWineList - An async function that takes a list of wine names and returns them enriched with tags.
 * - EnrichWineListInput - The input type for the enrichWineList function.
 * - EnrichWineListOutput - The output type for the enrichWineList function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WineInfoSchema = z.object({
  name: z.string().describe('The original name of the wine.'),
  tags: z.array(z.string()).describe('An array of relevant tags like "rotwein", "weisswein", "kräftig", "leicht", "trocken", "fruchtig", as well as food pairings like "fleisch", "fisch", "käse", "pasta".'),
});

const EnrichWineListInputSchema = z.object({
  wineNames: z.array(z.string()).describe('A list of wine names to be enriched.'),
});
export type EnrichWineListInput = z.infer<typeof EnrichWineListInputSchema>;

const EnrichWineListOutputSchema = z.object({
  enrichedWines: z.array(WineInfoSchema).describe('The list of wines, enriched with AI-generated tags.'),
});
export type EnrichWineListOutput = z.infer<typeof EnrichWineListOutputSchema>;

export async function enrichWineList(input: EnrichWineListInput): Promise<EnrichWineListOutput> {
  return enrichWineListFlow(input);
}

const enrichWineListPrompt = ai.definePrompt({
  name: 'enrichWineListPrompt',
  input: { schema: EnrichWineListInputSchema },
  output: { schema: EnrichWineListOutputSchema },
  prompt: `You are an expert sommelier data analyst.
For the given list of wine names, generate a list of descriptive tags for each.
The tags should include the type of wine (e.g., "rotwein", "weisswein", "schaumwein"), its character (e.g., "kräftig", "leicht", "fruchtig", "trocken"), and potential food pairings (e.g., "fleisch", "fisch", "geflügel", "käse", "pasta", "asiatisch"). Keep the tags in German and lowercase.

Wine Names:
{{#each wineNames}}
- {{{this}}}
{{/each}}

Please provide the output as a JSON object containing a single key "enrichedWines".
`,
});


const enrichWineListFlow = ai.defineFlow(
  {
    name: 'enrichWineListFlow',
    inputSchema: EnrichWineListInputSchema,
    outputSchema: EnrichWineListOutputSchema,
  },
  async (input) => {
    const { output } = await enrichWineListPrompt(input);
    
    if (!output || !output.enrichedWines) {
        throw new Error("AI failed to generate enriched wine list.");
    }
    return output;
  }
);
