'use server';

/**
 * @fileOverview This file defines a Genkit flow to improve newsletter text using AI.
 *
 * - improveTextWithAI - An async function that takes newsletter text as input and returns improved text.
 * - ImproveTextWithAIInput - The input type for the improveTextWithAI function.
 * - ImproveTextWithAIOutput - The output type for the improveTextWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveTextWithAIInputSchema = z.object({
  text: z
    .string()
    .describe('The newsletter text to improve.'),
});
export type ImproveTextWithAIInput = z.infer<typeof ImproveTextWithAIInputSchema>;

const ImproveTextWithAIOutputSchema = z.object({
  improvedText: z.string().describe('The improved newsletter text.'),
});
export type ImproveTextWithAIOutput = z.infer<typeof ImproveTextWithAIOutputSchema>;

export async function improveTextWithAI(input: ImproveTextWithAIInput): Promise<ImproveTextWithAIOutput> {
  return improveTextWithAIFlow(input);
}

const improveTextWithAIPrompt = ai.definePrompt({
  name: 'improveTextWithAIPrompt',
  input: {schema: ImproveTextWithAIInputSchema},
  output: {schema: ImproveTextWithAIOutputSchema},
  prompt: `You are an expert marketing copywriter. Improve the following newsletter text to maximize customer engagement.  The copy should be concise, friendly, and persuasive.

Original text: {{{text}}}`,
});

const improveTextWithAIFlow = ai.defineFlow(
  {
    name: 'improveTextWithAIFlow',
    inputSchema: ImproveTextWithAIInputSchema,
    outputSchema: ImproveTextWithAIOutputSchema,
  },
  async input => {
    const {output} = await improveTextWithAIPrompt(input);
    return output!;
  }
);
