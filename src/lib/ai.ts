// Client for the learning-plan feature. Calls our own API route
// (app/api/plan+api.ts), which proxies Gemini server-side so the key never
// ships in the app bundle.

import Constants from 'expo-constants';

/**
 * Base URL for API routes. In production set EXPO_PUBLIC_API_URL to the deployed
 * server origin (e.g. an EAS Hosting URL). In development we fall back to the
 * Expo dev server, which serves the API routes.
 */
function apiBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_URL;
  if (configured) return configured.replace(/\/$/, '');
  const host = Constants.expoConfig?.hostUri;
  return host ? `http://${host}` : '';
}

export async function generateLearningPlan(userPrompt: string): Promise<string[]> {
  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl()}/api/plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userPrompt }),
    });
  } catch {
    throw new Error('Network error — check your connection and try again.');
  }

  if (res.status === 429) {
    throw new Error('Rate limit reached. Please wait a moment and try again.');
  }

  let data: { steps?: string[]; error?: string };
  try {
    data = (await res.json()) as { steps?: string[]; error?: string };
  } catch {
    throw new Error('Unexpected response from the server.');
  }

  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status}).`);
  return data.steps ?? [];
}
