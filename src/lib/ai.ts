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

async function postJson<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${apiBaseUrl()}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Network error — check your connection and try again.');
  }

  if (res.status === 429) {
    throw new Error('Rate limit reached. Please wait a moment and try again.');
  }

  let data: (T & { error?: string }) | { error?: string };
  try {
    data = (await res.json()) as T & { error?: string };
  } catch {
    throw new Error('Unexpected response from the server.');
  }

  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status}).`);
  return data as T;
}

export async function generateLearningPlan(userPrompt: string): Promise<string[]> {
  const { steps } = await postJson<{ steps: string[] }>('/api/plan', { prompt: userPrompt });
  return steps ?? [];
}

export type WeeklySummaryStats = {
  currentStreak: number;
  totalHours: number;
  weekHours: number;
  activeSkills: number;
  completedMilestones: number;
  mostPracticedSkill?: string;
};

export async function generateWeeklySummary(stats: WeeklySummaryStats): Promise<string> {
  const { summary } = await postJson<{ summary: string }>('/api/summary', stats);
  return summary ?? '';
}

export async function suggestNextMilestones(input: {
  skillName: string;
  goal?: string;
  existing: string[];
}): Promise<string[]> {
  const { suggestions } = await postJson<{ suggestions: string[] }>('/api/milestones', input);
  return suggestions ?? [];
}
