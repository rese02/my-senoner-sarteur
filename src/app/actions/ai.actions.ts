'use server';

import 'server-only';
import { improveTextWithAI as improveTextFlow } from '@/ai/flows/improve-newsletter-text';
import { enrichWineList as enrichWineListFlow } from '@/ai/flows/enrich-wine-list';
import type { ImproveTextWithAIInput, ImproveTextWithAIOutput } from '@/ai/flows/improve-newsletter-text';
import type { EnrichWineListInput, EnrichWineListOutput } from '@/ai/flows/enrich-wine-list';

/**
 * Server Action to safely wrap the improveTextWithAI Genkit flow.
 * This acts as a security and abstraction layer between client and AI logic.
 */
export async function improveTextWithAI(input: ImproveTextWithAIInput): Promise<ImproveTextWithAIOutput> {
  // Add any additional validation or logging here if needed
  return improveTextFlow(input);
}

/**
 * Server Action to safely wrap the enrichWineList Genkit flow.
 */
export async function enrichWineList(input: EnrichWineListInput): Promise<EnrichWineListOutput> {
  return enrichWineListFlow(input);
}
