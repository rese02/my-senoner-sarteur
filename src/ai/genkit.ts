// All Genkit related initializations and configurations will be handled
// by the server-side only imports and setup.
// This file can be removed if no longer referenced, or kept for future client-side AI utilities.

// For now, we restore the mock to ensure parts of the app that might still import it don't crash.
export const ai: any = {
    defineFlow: () => () => Promise.resolve({}),
    definePrompt: () => () => Promise.resolve({}),
};
