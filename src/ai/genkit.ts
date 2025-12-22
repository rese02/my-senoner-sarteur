'use server';

import 'server-only';
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// This is the central Genkit initialization.
// It configures the AI models and plugins used throughout the application.
export const ai = genkit({
  plugins: [googleAI()],
  logLevel: 'warn', // Use 'debug' for detailed logging, 'warn' for production
  enableTracingAndMetrics: true, // Recommended for production
});
