'use server';

// Genkit has been temporarily removed to resolve build issues.
// The 'ai' object is mocked to prevent crashes in files that import it.
export const ai: any = {
    defineFlow: () => () => Promise.resolve({}),
    definePrompt: () => () => Promise.resolve({}),
};
