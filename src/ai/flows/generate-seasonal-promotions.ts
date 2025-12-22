'use server';
import 'server-only';

/**
 * @fileOverview Generates seasonal marketing promotion ideas using AI.
 *
 * - generateSeasonalPromotions - A function that generates seasonal promotion ideas.
 * - GenerateSeasonalPromotionsInput - The input type for the generateSeasonalPromotions function.
 * - GenerateSeasonalPromotionsOutput - The return type for the generateSeasonalPromotions function.
 */

import { genkit } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {z} from 'zod';

// Initialize a local genkit instance for this flow
const ai = genkit({ plugins: [googleAI()] });

const GenerateSeasonalPromotionsInputSchema = z.object({
  season: z.string().describe('The current season (e.g., Spring, Summer, Autumn, Winter).'),
  availableProducts: z.array(z.string()).describe('A list of available products.'),
  marketTrends: z.string().describe('Current market trends.'),
});
export type GenerateSeasonalPromotionsInput = z.infer<typeof GenerateSeasonalPromotionsInputSchema>;

const GenerateSeasonalPromotionsOutputSchema = z.object({
  promotionIdeas: z.array(z.string()).describe('A list of AI-generated marketing promotion ideas.'),
});
export type GenerateSeasonalPromotionsOutput = z.infer<typeof GenerateSeasonalPromotionsOutputSchema>;

export async function generateSeasonalPromotions(
  input: GenerateSeasonalPromotionsInput
): Promise<GenerateSeasonalPromotionsOutput> {
  return generateSeasonalPromotionsFlow(input);
}

const generateSeasonalPromotionsPrompt = ai.definePrompt({
  name: 'generateSeasonalPromotionsPrompt',
  input: {schema: GenerateSeasonalPromotionsInputSchema},
  output: {schema: GenerateSeasonalPromotionsOutputSchema},
  prompt: `You are a marketing expert tasked with generating engaging seasonal marketing promotion ideas for a supermarket.

  Generate a list of promotion ideas based on the current season, available products, and market trends.

  Season: {{{season}}}
  Available Products: {{#each availableProducts}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
  Market Trends: {{{marketTrends}}}

  Provide a numbered list of promotion ideas. Each idea should be concise and actionable.
  `,
});

const generateSeasonalPromotionsFlow = ai.defineFlow(
  {
    name: 'generateSeasonalPromotionsFlow',
    inputSchema: GenerateSeasonalPromotionsInputSchema,
    outputSchema: GenerateSeasonalPromotionsOutputSchema,
  },
  async input => {
    const {output} = await generateSeasonalPromotionsPrompt(input);
    return output!;
  }
);
