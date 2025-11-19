import { config } from 'dotenv';
config();

import '@/ai/flows/generate-seasonal-promotions.ts';
import '@/ai/flows/improve-newsletter-text.ts';
import '@/ai/flows/suggest-wine-pairing.ts';
import '@/ai/flows/enrich-wine-list.ts';
