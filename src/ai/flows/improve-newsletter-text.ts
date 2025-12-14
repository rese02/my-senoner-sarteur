'use server';
import 'server-only';

/**
 * @fileOverview This file defines a Genkit flow to improve newsletter text using AI, supporting both German and Italian.
 *
 * - improveTextWithAI - An async function that takes newsletter text as input and returns improved text in the same language.
 * - ImproveTextWithAIInput - The input type for the improveTextWithAI function.
 * - ImproveTextWithAIOutput - The output type for the improveTextWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const ImproveTextWithAIInputSchema = z.object({
  text: z
    .string()
    .min(3, "Text must be at least 3 characters long.")
    .describe('The newsletter text to improve (in German or Italian).'),
});
export type ImproveTextWithAIInput = z.infer<typeof ImproveTextWithAIInputSchema>;

const ImproveTextWithAIOutputSchema = z.object({
  improvedText: z.string().describe('The improved newsletter text in the same language as the input.'),
});
export type ImproveTextWithAIOutput = z.infer<typeof ImproveTextWithAIOutputSchema>;

export async function improveTextWithAI(input: ImproveTextWithAIInput): Promise<ImproveTextWithAIOutput> {
  const validation = ImproveTextWithAIInputSchema.safeParse(input);
   if (!validation.success) {
    // Return original text if validation fails instead of throwing an error.
    return { improvedText: input.text };
  }
  return improveTextWithAIFlow(validation.data);
}

const improveTextWithAIPrompt = ai.definePrompt({
  name: 'improveTextWithAIPrompt',
  input: {schema: ImproveTextWithAIInputSchema},
  output: {schema: ImproveTextWithAIOutputSchema},
  prompt: `Du bist ein professioneller Copywriter für 'Senoner Sarteur', einen Premium-Feinkostladen in Südtirol.
        
    Deine Aufgabe:
    1. Analysiere den Input. Erkenne automatisch, ob er auf DEUTSCH oder ITALIENISCH ist.
    2. Optimiere den Text: Mach ihn appetitlicher, eleganter, verkaufsfördernder und korrigiere Rechtschreibfehler.
    3. WICHTIG: Die Ausgabe muss EXAKT in derselben Sprache sein wie der Input. 
       - Wenn Input Deutsch -> Ausgabe Deutsch.
       - Wenn Input Italienisch -> Ausgabe Italienisch.
       - NIEMALS ins Englische übersetzen.
    4. Halte den Text prägnant und schreibe ihn nicht komplett um, sondern verbessere den bestehenden.

    Original text: {{{text}}}`,
});

const improveTextWithAIFlow = ai.defineFlow(
  {
    name: 'improveTextWithAIFlow',
    inputSchema: ImproveTextWithAIInputSchema,
    outputSchema: ImproveTextWithAIOutputSchema,
    config: {
        model: 'googleai/gemini-2.5-flash',
        temperature: 0.7,
    }
  },
  async input => {
    const {output} = await improveTextWithAIPrompt(input);
    return output!;
  }
);
