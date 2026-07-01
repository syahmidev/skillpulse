import { geminiList } from '@/lib/gemini';

const planPrompt = (goal: string) =>
  [
    'You are a learning coach. Create a concise, ordered learning plan for the goal below.',
    'Return 6 to 12 short, actionable milestone titles (about 8 words or fewer each),',
    'in the order they should be completed. No numbering, week labels, or commentary —',
    'just the milestone titles.',
    '',
    `Goal: ${goal}`,
  ].join('\n');

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
    const steps = await geminiList(planPrompt(prompt.trim()), apiKey);
    return Response.json({ steps });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to generate a plan.';
    return Response.json({ error: message }, { status: 502 });
  }
}
