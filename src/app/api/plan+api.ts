import { callGemini } from '@/lib/gemini';

// POST /api/plan — server-side proxy so the Gemini key never ships to the client.
export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Server is missing GEMINI_API_KEY.' }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const prompt = (body as { prompt?: unknown })?.prompt;
  if (typeof prompt !== 'string' || prompt.trim().length < 3) {
    return Response.json({ error: 'Describe what you want to learn.' }, { status: 400 });
  }

  try {
    const steps = await callGemini(prompt.trim(), apiKey);
    return Response.json({ steps });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to generate a plan.';
    return Response.json({ error: message }, { status: 502 });
  }
}
