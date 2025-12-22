'use server';
import 'server-only';

/**
 * @fileOverview This file defines a Genkit flow to improve newsletter text using AI, supporting both German and Italian.
 *
 * - improveTextWithAI - An async function that takes newsletter text and subject as input and returns improved versions.
 * - ImproveTextWithAIInput - The input type for the improveTextWithAI function.
 * - ImproveTextWithAIOutput - The output type for the improveTextWithAI function.
 */

import { genkit } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import {z} from 'zod';

// Initialize a local genkit instance for this flow
const ai = genkit({ plugins: [googleAI()] });

const ImproveTextWithAIInputSchema = z.object({
  subject: z
    .string()
    .describe('The subject line of the newsletter (in German or Italian).'),
  message: z
    .string()
    .describe('The body text of the newsletter to improve (in German or Italian).'),
});
export type ImproveTextWithAIInput = z.infer<typeof ImproveTextWithAIInputSchema>;

const ImproveTextWithAIOutputSchema = z.object({
  improvedSubject: z.string().describe('The improved subject line in the same language as the input.'),
  improvedMessage: z.string().describe('The improved body text in the same language as the input.'),
});
export type ImproveTextWithAIOutput = z.infer<typeof ImproveTextWithAIOutputSchema>;

export async function improveTextWithAI(input: ImproveTextWithAIInput): Promise<ImproveTextWithAIOutput> {
  const validation = ImproveTextWithAIInputSchema.safeParse(input);
   if (!validation.success) {
    // Return original text if validation fails instead of throwing an error.
    return { improvedSubject: input.subject, improvedMessage: input.message };
  }
  return improveTextWithAIFlow(validation.data);
}

const improveTextWithAIPrompt = ai.definePrompt({
  name: 'improveTextWithAIPrompt',
  input: {schema: ImproveTextWithAIInputSchema},
  output: {schema: ImproveTextWithAIOutputSchema},
  prompt: `Du bist ein professioneller Copywriter für 'Senoner Sarteur', einen Premium-Feinkostladen in Südtirol.
        
    Deine Aufgabe:
    1. Analysiere den folgenden Betreff und die Nachricht. Erkenne automatisch, ob sie auf DEUTSCH oder ITALIENISCH sind.
    2. Optimiere BEIDES: Mach Betreff und Nachricht appetitlicher, eleganter, verkaufsfördernder und korrigiere alle Fehler.
    3. Der optimierte Betreff und die Nachricht müssen zueinander passen und ein stimmiges Gesamtbild ergeben.
    4. WICHTIG: Die Ausgabe muss EXAKT in derselben Sprache sein wie der Input. 
       - Wenn Input Deutsch -> Ausgabe Deutsch.
       - Wenn Input Italienisch -> Ausgabe Italienisch.
       - NIEMALS ins Englische übersetzen.
    5. Halte die Texte prägnant und schreibe sie nicht komplett um, sondern verbessere die bestehenden.

    Original Betreff: {{{subject}}}
    Original Nachricht: {{{message}}}`,
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
    try {
        const {output} = await improveTextWithAIPrompt(input);
        if (!output) {
          return {
            improvedSubject: input.subject,
            improvedMessage: input.message
          }
        }
        return output;
    } catch(e) {
        console.error("AI flow failed, returning original text.", e);
        // Fallback to original input on any error
        return {
            improvedSubject: input.subject,
            improvedMessage: input.message
        };
    }
  }
);
