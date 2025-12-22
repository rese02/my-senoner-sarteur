'use server';
import 'server-only';

import { genkit, configureGenkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

// This is the central Genkit initialization.
// It configures the AI models and plugins used throughout the application.
// IMPORTANT: This file must NOT export the `ai` object directly.
// Instead, each flow will initialize its own instance.
configureGenkit({
  plugins: [googleAI()],
  logLevel: 'warn', // Use 'debug' for detailed logging, 'warn' for production
  enableTracingAndMetrics: true, // Recommended for production
});

// We only export the main genkit object creator itself and the configure function.
// Flows will call genkit() to get their own instance.
export { genkit, configureGenkit };
